import { NextResponse } from 'next/server';
import { getAvailability, calculatePricing, calculateAccommodationTotal } from '@/lib/uplisting';
import { sendMissingRatesAlert, sendNoRatesAlert } from '@/lib/email-alerts';
import { logger } from '@/lib/logger';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const forBooking = searchParams.get('forBooking') === 'true'; // Flag for booking calculations
    
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing from or to date' },
        { status: 400 }
      );
    }
    
    // For bookings, we need to fetch one extra day beyond checkout
    // because the last night's rate in Uplisting corresponds to the checkout date
    // Example: Checkout on Jan 9 means last night (Jan 8→9) uses rate for Jan 9
    let fetchTo = to;
    if (forBooking) {
      const checkoutDate = new Date(to);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      fetchTo = checkoutDate.toISOString().split('T')[0];
      
      logger.info('Fetching extended calendar for booking', {
        propertyId: params.propertyId,
        requestedCheckout: to,
        fetchingUntil: fetchTo
      });
    }
    
    const calendarData = await getAvailability(params.propertyId, from, fetchTo);
    
    // For bookings, use the new accommodation total calculation
    if (forBooking) {
      const accommodationCalc = calculateAccommodationTotal(calendarData, from, to);
      
      if (!accommodationCalc.success) {
        return NextResponse.json({
          calendar: calendarData,
          pricing: {
            error: accommodationCalc.error,
            available: false
          }
        });
      }
      
      // Check if fallback rates were used and send alert
      if (accommodationCalc.usedFallback && accommodationCalc.missingRates) {
        // Determine if all rates were missing or just some
        const allMissing = accommodationCalc.missingRates.length === accommodationCalc.nights;
        
        if (allMissing) {
          // All rates missing
          logger.warn('All rates missing for booking', {
            propertyId: params.propertyId,
            checkIn: from,
            checkOut: to,
            nights: accommodationCalc.nights
          });
          
          // Send critical alert (don't await - run async)
          sendNoRatesAlert({
            propertyId: params.propertyId,
            propertyName: calendarData.name || 'Unknown Property',
            checkIn: from,
            checkOut: to,
            nights: accommodationCalc.nights
          }).catch(err => logger.error('Failed to send no rates alert', { error: err.message }));
          
        } else {
          // Partial rates missing
          logger.warn('Partial rates missing for booking', {
            propertyId: params.propertyId,
            checkIn: from,
            checkOut: to,
            missingCount: accommodationCalc.missingRates.length,
            totalNights: accommodationCalc.nights
          });
          
          // Send warning alert (don't await - run async)
          sendMissingRatesAlert({
            propertyId: params.propertyId,
            propertyName: calendarData.name || 'Unknown Property',
            checkIn: from,
            checkOut: to,
            missingRates: accommodationCalc.missingRates
          }).catch(err => logger.error('Failed to send missing rates alert', { error: err.message }));
        }
      }
      
      // Return booking-specific pricing
      return NextResponse.json({
        calendar: calendarData,
        pricing: {
          total: accommodationCalc.accommodationTotal,
          averageRate: accommodationCalc.averagePerNight,
          totalNights: accommodationCalc.nights,
          currency: accommodationCalc.currency,
          nightlyBreakdown: accommodationCalc.nightlyRates,
          usedFallback: accommodationCalc.usedFallback,
          available: true
        }
      });
    }
    
    // For browsing/listing, use the old calculation method
    const pricing = calculatePricing(calendarData);
    
    return NextResponse.json({
      calendar: calendarData,
      pricing
    });
  } catch (error) {
    logger.error('Error fetching availability', {
      propertyId: params.propertyId,
      message: error.message,
      statusCode: error.statusCode
    });
    
    const statusCode = error.statusCode || 500;
    const errorMessage = error.userMessage || 'Failed to fetch availability';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}