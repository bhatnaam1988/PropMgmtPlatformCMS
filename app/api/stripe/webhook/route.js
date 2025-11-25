import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe-client';
import { retryWithBackoff } from '@/lib/retry-utils';
import { alertUplistingBookingFailure } from '@/lib/webhooks/alertFailure';
import {
  findBookingByPaymentIntent,
  updateBookingStatus,
  updateBookingWithUplisting,
  markForManualReview,
  isPaymentIntentProcessed,
} from '@/lib/booking-store';

const UPLISTING_API_KEY = process.env.UPLISTING_API_KEY;
const UPLISTING_API_URL = process.env.UPLISTING_API_URL;
const UPLISTING_CLIENT_ID = process.env.UPLISTING_CLIENT_ID;

/**
 * Create booking in Uplisting
 * @param {Object} bookingData - Booking details from payment metadata
 * @returns {Promise<Object>} Uplisting booking response
 */
async function createUplistingBooking(bookingData) {
  const headers = {
    'Authorization': `Basic ${UPLISTING_API_KEY}`,
    'X-Uplisting-Client-Id': UPLISTING_CLIENT_ID,
    'Content-Type': 'application/json',
  };

  const uplistingPayload = {
    data: {
      attributes: {
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guest_name: bookingData.guestName,
        guest_email: bookingData.guestEmail,
        guest_phone: bookingData.guestPhone || '',
        number_of_guests: bookingData.numberOfGuests,
      },
      relationships: {
        property: {
          data: {
            type: 'properties',
            id: bookingData.propertyId,
          },
        },
      },
    },
  };

  console.log('📤 Creating Uplisting booking:', uplistingPayload);

  const response = await fetch(`${UPLISTING_API_URL}/v2/bookings`, {
    method: 'POST',
    headers,
    body: JSON.stringify(uplistingPayload),
  });

  const textResponse = await response.text();
  let data;

  try {
    data = JSON.parse(textResponse);
  } catch (e) {
    console.error('❌ Non-JSON response from Uplisting:', textResponse);
    throw new Error(`Uplisting API error: ${textResponse}`);
  }

  if (!response.ok) {
    console.error('❌ Uplisting API error:', data);
    throw new Error(`Uplisting booking failed: ${JSON.stringify(data)}`);
  }

  console.log('✅ Uplisting booking created:', data.data?.id);
  return data;
}

/**
 * Process successful payment
 * @param {Object} paymentIntent - Stripe Payment Intent object
 */
async function processSuccessfulPayment(paymentIntent) {
  const paymentIntentId = paymentIntent.id;
  
  console.log(`🎉 Processing successful payment: ${paymentIntentId}`);

  // Check if already processed (idempotency)
  if (await isPaymentIntentProcessed(paymentIntentId)) {
    console.log(`⚠️ Payment Intent ${paymentIntentId} already processed. Skipping.`);
    return { success: true, message: 'Already processed' };
  }

  // Get booking from database
  const booking = await findBookingByPaymentIntent(paymentIntentId);
  if (!booking) {
    console.error(`❌ No booking found for Payment Intent: ${paymentIntentId}`);
    throw new Error('Booking not found');
  }

  // Update payment status to succeeded
  await updateBookingStatus(paymentIntentId, 'succeeded', 'processing_booking', {
    paidAt: new Date(),
  });

  // Prepare booking data for Uplisting
  const bookingData = {
    propertyId: booking.propertyId,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    numberOfGuests: (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0),
  };

  // Attempt to create booking in Uplisting with retry logic
  try {
    const uplistingResponse = await retryWithBackoff(
      () => createUplistingBooking(bookingData),
      2, // max 2 attempts as specified
      2000, // 2 second backoff
      'Uplisting Booking Creation'
    );

    // Success! Update booking with Uplisting ID
    const uplistingBookingId = uplistingResponse.data?.id;
    await updateBookingWithUplisting(paymentIntentId, uplistingBookingId, 'confirmed');

    console.log(`✅ Booking completed successfully. Uplisting ID: ${uplistingBookingId}`);
    
    return {
      success: true,
      uplistingBookingId,
      bookingId: booking.bookingId,
    };

  } catch (error) {
    // All retry attempts failed
    console.error(`💥 Failed to create Uplisting booking after retries:`, error);

    // Send critical admin alert via email
    await alertUplistingBookingFailure({
      paymentIntentId,
      amount: paymentIntent.amount,
      bookingDetails: {
        propertyId: booking.propertyId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        adults: booking.adults || 0,
        children: booking.children || 0,
        infants: booking.infants || 0,
        firstName: booking.firstName || '',
        lastName: booking.lastName || '',
        email: booking.guestEmail,
        phone: booking.guestPhone || '',
      },
      error: error.message,
      retryCount: 2,
    });

    // Mark for manual review
    await markForManualReview(paymentIntentId, `Uplisting booking failed after 2 retries: ${error.message}`);

    // Despite failure, we still consider this a success from webhook perspective
    // The payment succeeded, we just need manual intervention for the booking
    return {
      success: true,
      requiresManualReview: true,
      bookingId: booking.bookingId,
      error: error.message,
    };
  }
}

/**
 * Process failed payment
 * @param {Object} paymentIntent - Stripe Payment Intent object
 */
async function processFailedPayment(paymentIntent) {
  const paymentIntentId = paymentIntent.id;
  
  console.log(`❌ Processing failed payment: ${paymentIntentId}`);

  // Update booking status
  await updateBookingStatus(paymentIntentId, 'failed', 'cancelled', {
    failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
  });

  return {
    success: true,
    message: 'Payment failure recorded',
  };
}

/**
 * Webhook handler
 */
export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event;

  try {
    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      // Only allow unverified webhooks in local development
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Development mode: Webhook verification skipped');
        event = JSON.parse(body);
      } else {
        console.error('❌ STRIPE_WEBHOOK_SECRET not configured in production');
        return NextResponse.json(
          { error: 'Webhook secret not configured' },
          { status: 500 }
        );
      }
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
    
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log(`📥 Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const result = await processSuccessfulPayment(paymentIntent);
        return NextResponse.json(result);

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        const failureResult = await processFailedPayment(failedPaymentIntent);
        return NextResponse.json(failureResult);

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    );
  }
}
