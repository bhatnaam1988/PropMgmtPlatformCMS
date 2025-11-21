import { NextResponse } from 'next/server';
import { getProperties, formatProperties } from '@/lib/uplisting';
import { setPrimaryImagesForList } from '@/lib/property-config';

export async function GET() {
  try {
    const data = await getProperties();
    let properties = formatProperties(data);
    
    // Set primary images for properties that have them configured
    properties = setPrimaryImagesForList(properties);
    
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}