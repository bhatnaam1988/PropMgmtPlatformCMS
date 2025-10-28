import { NextResponse } from 'next/server';
import { getProperties, formatProperties } from '@/lib/uplisting';

export async function GET() {
  try {
    const data = await getProperties();
    const properties = formatProperties(data);
    
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}