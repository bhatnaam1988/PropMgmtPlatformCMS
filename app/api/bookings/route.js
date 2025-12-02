import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

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
    
    logger.info('Creating Uplisting booking', { service: 'Uplisting' });
    
    // Get base URL from environment or construct it
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
    
    // Construct success and failure redirect URLs with booking parameters
    const successUrl = `${baseUrl}/booking/success?bookingId={booking_id}&propertyId=${bookingData.propertyId}`;
    const failureUrl = `${baseUrl}/booking/failure?propertyId=${bookingData.propertyId}&checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&adults=${bookingData.adults}&children=${bookingData.children || 0}&infants=${bookingData.infants || 0}`;
    
    // Format data for Uplisting API - matches documentation structure
    const uplistingBooking = {
      data: {
        attributes: {
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          guest_name: bookingData.guestName,
          guest_email: bookingData.guestEmail,
          guest_phone: bookingData.guestPhone,
          number_of_guests: (bookingData.adults || 0) + (bookingData.children || 0) + (bookingData.infants || 0)
        },
        relationships: {
          property: {
            data: {
              type: 'properties',
              id: bookingData.propertyId
            }
          }
        }
      }
    };
    
    logger.info('Booking payload prepared', { propertyId: bookingData.propertyId });
    
    const response = await fetch(`${UPLISTING_API_URL}/v2/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(uplistingBooking)
    });
    
    // Handle both JSON and text responses
    let data;
    const contentType = response.headers.get('content-type');
    const textResponse = await response.text();
    
    try {
      // Try to parse as JSON regardless of content-type
      data = JSON.parse(textResponse);
    } catch (e) {
      logger.error('Non-JSON response from Uplisting', { error: e.message });
      data = { error: textResponse };
    }
    
    if (!response.ok) {
      logger.error('Uplisting API error', { status: response.status });
      return NextResponse.json(
        { error: 'Failed to create booking. Please try again later.' },
        { status: response.status }
      );
    }
    
    logger.info('Booking created successfully', { bookingId: data.data?.id });
    
    // Return booking details including payment link
    return NextResponse.json({
      success: true,
      booking: data,
      bookingId: data.data?.id,
      // Uplisting provides a payment link in the response
      paymentUrl: data.data?.attributes?.payment_url || data.data?.attributes?.uplisting_url
    });
    
  } catch (error) {
    logger.error('Error creating booking', error);
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again later.' },
      { status: 500 }
    );
  }
}
