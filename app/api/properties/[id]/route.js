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
    
    // Return appropriate error based on error type
    const statusCode = error.statusCode || 500;
    const errorMessage = error.userMessage || 'Failed to fetch property';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}