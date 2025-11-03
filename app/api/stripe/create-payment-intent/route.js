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

    // Fetch property data to get fees and taxes
    const propertyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!propertyResponse.ok) {
      throw new Error('Failed to fetch property data');
    }

    const { property } = await propertyResponse.json();

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log('📋 Property data fetched:', {
      id: property.id,
      fees: property.fees?.length || 0,
      taxes: property.taxes?.length || 0
    });

    // Calculate pricing with property fees and taxes
    const pricing = calculateBookingPrice({
      accommodationTotal,
      cleaningFee: cleaningFee || 0,
      nights,
      adults: adults || 2,
      children: children || 0,
      infants: infants || 0,
      propertyFees: property.fees || [],
      propertyTaxes: property.taxes || []
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
          adults: (adults || 2).toString(),
          children: (children || 0).toString(),
          infants: (infants || 0).toString(),
          guestEmail,
          guestName,
          nights: nights.toString(),
          accommodationTotal: pricing.accommodationTotal.toString(),
          cleaningFee: pricing.cleaningFee.toString(),
          extraGuestFee: pricing.extraGuestFee.toString(),
          totalTax: pricing.totalTax.toString(),
          taxBreakdown: JSON.stringify(pricing.taxes),
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
      extraGuestFee: pricing.extraGuestFee,
      totalTax: pricing.totalTax,
      taxBreakdown: pricing.taxes,
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
      pricing: {
        accommodationTotal: pricing.accommodationTotal,
        cleaningFee: pricing.cleaningFee,
        extraGuestFee: pricing.extraGuestFee,
        subtotal: pricing.subtotal,
        taxes: pricing.taxes,
        totalTax: pricing.totalTax,
        grandTotal: pricing.grandTotal
      }
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', message: error.message },
      { status: 500 }
    );
  }
}
