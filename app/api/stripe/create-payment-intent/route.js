import { NextResponse } from 'next/server';
import stripe, { stripeConfig } from '@/lib/stripe-client';
import { calculateBookingPrice, toStripeCents, validateBookingDates } from '@/lib/pricing-calculator';
import { generateIdempotencyKey } from '@/lib/retry-utils';
import { createBooking } from '@/lib/booking-store';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      propertyId,
      checkIn,
      checkOut,
      adults,
      children,
      infants,
      guestName,
      guestEmail,
      guestPhone,
      accommodationTotal,
      cleaningFee,
      marketingConsent,
    } = body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guestName || !guestEmail || !accommodationTotal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return NextResponse.json(
        { error: dateValidation.error },
        { status: 400 }
      );
    }

    const nights = dateValidation.nights;

    // Calculate pricing with VAT
    const pricing = calculateBookingPrice({
      accommodationTotal,
      cleaningFee: cleaningFee || 0,
      nights,
    });

    console.log('💰 Calculated pricing:', pricing);

    // Generate idempotency key
    const idempotencyKey = generateIdempotencyKey('booking', {
      propertyId,
      checkIn,
      checkOut,
      guestEmail,
    });

    // Create Payment Intent in Stripe
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: toStripeCents(pricing.grandTotal),
        currency: stripeConfig.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          propertyId,
          checkIn,
          checkOut,
          adults: adults?.toString() || '2',
          children: children?.toString() || '0',
          infants: infants?.toString() || '0',
          guestEmail,
          guestName,
          nights: nights.toString(),
          accommodationTotal: pricing.accommodationTotal.toString(),
          cleaningFee: pricing.cleaningFee.toString(),
          vatAmount: pricing.vatAmount.toString(),
          vatRate: pricing.vatRate.toString(),
          grandTotal: pricing.grandTotal.toString(),
          currency: pricing.currency,
        },
        description: `Booking for ${propertyId} from ${checkIn} to ${checkOut}`,
      },
      {
        idempotencyKey,
      }
    );

    console.log('✅ Payment Intent created:', paymentIntent.id);

    // Store initial booking record in MongoDB
    const booking = await createBooking({
      stripePaymentIntentId: paymentIntent.id,
      propertyId,
      checkIn,
      checkOut,
      nights,
      guestName,
      guestEmail,
      guestPhone: guestPhone || '',
      adults: adults || 2,
      children: children || 0,
      infants: infants || 0,
      currency: pricing.currency,
      accommodationTotal: pricing.accommodationTotal,
      cleaningFee: pricing.cleaningFee,
      vatAmount: pricing.vatAmount,
      vatRate: pricing.vatRate,
      grandTotal: pricing.grandTotal,
      paymentStatus: 'pending',
      bookingStatus: 'pending_payment',
      source: 'website',
      marketingConsent: marketingConsent || false,
    });

    console.log('📝 Booking record created:', booking.bookingId);

    // Return client secret for frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      bookingId: booking.bookingId,
      amount: pricing.grandTotal,
      currency: pricing.currency,
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', message: error.message },
      { status: 500 }
    );
  }
}
