import { NextResponse } from 'next/server';

const UPLISTING_API_KEY = process.env.UPLISTING_API_KEY;
const UPLISTING_API_URL = process.env.UPLISTING_API_URL;
const UPLISTING_CLIENT_ID = process.env.UPLISTING_CLIENT_ID;

export async function POST(request) {
  try {
    const bookingData = await request.json();
    
    const headers = {
      'Authorization': `Basic ${UPLISTING_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Uplisting-Client-ID': UPLISTING_CLIENT_ID
    };
    
    // Format data for Uplisting API
    const uplistingBooking = {
      data: {
        type: 'bookings',
        attributes: {
          property_id: bookingData.propertyId,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          adults: bookingData.adults,
          children: bookingData.children,
          infants: bookingData.infants,
          guest_name: bookingData.guestName,
          guest_email: bookingData.guestEmail,
          guest_phone: bookingData.guestPhone,
          source: 'website',
          notes: bookingData.notes || '',
          marketing_consent: bookingData.marketingConsent || false
        }
      }
    };
    
    const response = await fetch(`${UPLISTING_API_URL}/v2/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(uplistingBooking)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Uplisting API error:', data);
      return NextResponse.json(
        { error: 'Failed to create booking', details: data },
        { status: response.status }
      );
    }
    
    // Return booking details including payment link
    return NextResponse.json({
      success: true,
      booking: data,
      // Uplisting provides a payment link in the response
      paymentUrl: data.data?.attributes?.payment_url || data.data?.attributes?.uplisting_url
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
