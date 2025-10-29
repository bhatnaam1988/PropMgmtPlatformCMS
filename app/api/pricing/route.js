import { NextResponse } from 'next/server';
import { getAvailability, calculatePricing, getCurrentMonthRange } from '@/lib/uplisting';

// Fetch pricing for multiple properties
export async function POST(request) {
  try {
    const body = await request.json();
    const { propertyIds, from, to } = body;
    
    if (!propertyIds || !Array.isArray(propertyIds)) {
      return NextResponse.json(
        { error: 'propertyIds array required' },
        { status: 400 }
      );
    }
    
    // If no dates provided, use current month
    const dateRange = (from && to) ? { from, to } : getCurrentMonthRange();
    
    // Fetch pricing for all properties in parallel
    const pricingPromises = propertyIds.map(async (propertyId) => {
      try {
        const calendarData = await getAvailability(propertyId, dateRange.from, dateRange.to);
        const pricing = calculatePricing(calendarData);
        
        return {
          propertyId,
          pricing,
          dateRange
        };
      } catch (error) {
        console.error(`Error fetching pricing for property ${propertyId}:`, error);
        return {
          propertyId,
          pricing: {
            averageRate: 300,
            useFallback: true,
            error: 'Failed to fetch pricing'
          },
          dateRange
        };
      }
    });
    
    const results = await Promise.all(pricingPromises);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching bulk pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
