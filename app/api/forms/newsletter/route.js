import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sanitizeEmail } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { email } = formData;

    // Validate and sanitize email
    let sanitizedEmail;
    try {
      sanitizedEmail = sanitizeEmail(email);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME || 'swissalpine');
    
    // Check if email already exists
    const existingSubscriber = await db.collection('newsletter_subscribers').findOne({ 
      email: sanitizedEmail 
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, error: 'This email is already subscribed to our newsletter' },
        { status: 400 }
      );
    }

    // Create subscription record
    const subscription = {
      email: sanitizedEmail,
      subscribedAt: new Date(),
      status: 'active',
      source: 'homepage',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    const result = await db.collection('newsletter_subscribers').insertOne(subscription);

    logger.secureLog('Newsletter subscription', { email: sanitizedEmail, source: 'homepage' });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    logger.error('Newsletter subscription error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
