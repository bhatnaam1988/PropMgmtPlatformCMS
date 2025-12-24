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
    
    const statusCode = error.statusCode || 500;
    const errorMessage = error.userMessage || 'Failed to fetch properties';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}