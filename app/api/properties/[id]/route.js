import { NextResponse } from 'next/server';
import { getProperty, formatProperty } from '@/lib/uplisting';
import { setPrimaryImage } from '@/lib/property-config';

export async function GET(request, { params }) {
  try {
    const data = await getProperty(params.id);
    let property = formatProperty(data);
    
    // Set primary image for this property if configured
    property = setPrimaryImage(property);
    
    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}