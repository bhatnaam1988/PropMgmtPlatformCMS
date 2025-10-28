import { NextResponse } from 'next/server';
import { getProperty, formatProperty } from '@/lib/uplisting';

export async function GET(request, { params }) {
  try {
    const data = await getProperty(params.id);
    const property = formatProperty(data);
    
    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}