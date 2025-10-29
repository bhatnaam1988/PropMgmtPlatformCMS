import { NextResponse } from 'next/server';
import { getAvailability, calculatePricing } from '@/lib/uplisting';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing from or to date' },
        { status: 400 }
      );
    }
    
    const calendarData = await getAvailability(params.propertyId, from, to);
    const pricing = calculatePricing(calendarData);
    
    return NextResponse.json({
      calendar: calendarData,
      pricing
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}