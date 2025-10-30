import { NextResponse } from 'next/server';

const UPLISTING_API_KEY = process.env.UPLISTING_API_KEY;
const UPLISTING_API_URL = process.env.UPLISTING_API_URL;
const UPLISTING_CLIENT_ID = process.env.UPLISTING_CLIENT_ID;

export async function POST(request) {
  try {
    const bookingData = await request.json();
    
    const headers = {
      'Authorization': `Basic ${UPLISTING_API_KEY}`,
      'X-Uplisting-Client-Id': UPLISTING_CLIENT_ID,
      'Content-Type': 'application/json'
    };
    
    console.log('🔑 Using credentials:', {
      apiKeyPrefix: UPLISTING_API_KEY?.substring(0, 10) + '...',
      clientId: UPLISTING_CLIENT_ID,
      url: UPLISTING_API_URL
    });
    
    // Get base URL from environment or construct it
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
    
    // Construct success and failure redirect URLs with booking parameters
    const successUrl = `${baseUrl}/booking/success?bookingId={booking_id}&propertyId=${bookingData.propertyId}`;
    const failureUrl = `${baseUrl}/booking/failure?propertyId=${bookingData.propertyId}&checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&adults=${bookingData.adults}&children=${bookingData.children || 0}&infants=${bookingData.infants || 0}`;
    
    // Format data for Uplisting API
    const uplistingBooking = {
      data: {
        type: 'bookings',
        attributes: {
          property_id: bookingData.propertyId,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          guest_name: bookingData.guestName,
          guest_email: bookingData.guestEmail,
          guest_phone: bookingData.guestPhone
        }
      }
    };
    
    console.log('📤 Creating booking with redirect URLs:', {
      successUrl,
      failureUrl,
      propertyId: bookingData.propertyId
    });
    
    console.log('📦 Full booking payload:', JSON.stringify(uplistingBooking, null, 2));
    
    const response = await fetch(`${UPLISTING_API_URL}/v2/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(uplistingBooking)
    });
    
    // Handle both JSON and text responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      console.error('❌ Non-JSON response from Uplisting:', textResponse);
      data = { error: textResponse };
    }
    
    if (!response.ok) {
      console.error('❌ Uplisting API error:', data);
      return NextResponse.json(
        { error: 'Failed to create booking', details: data },
        { status: response.status }
      );
    }
    
    console.log('✅ Booking created successfully:', data.data?.id);
    
    // Return booking details including payment link
    return NextResponse.json({
      success: true,
      booking: data,
      bookingId: data.data?.id,
      // Uplisting provides a payment link in the response
      paymentUrl: data.data?.attributes?.payment_url || data.data?.attributes?.uplisting_url
    });
    
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
