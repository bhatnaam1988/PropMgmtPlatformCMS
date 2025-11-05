import { NextResponse } from 'next/server';
import { alertUplistingBookingFailure } from '@/lib/webhooks/alertFailure';
import { sendAdminAlert } from '@/lib/email';
import { generateAdminAlertEmail } from '@/lib/email/templates/adminAlert';

/**
 * Test endpoint for email alerts
 * Access: http://localhost:3000/api/test-email
 */
export async function GET() {
  try {
    // Test 1: Simple admin alert
    const simpleAlertResult = await sendAdminAlert({
      subject: 'Test Email Alert',
      message: generateAdminAlertEmail({
        title: 'Email System Test',
        message: '<p>This is a test email from the Swiss Alpine Journey booking system.</p><p>If you receive this, the email integration is working correctly! ✅</p>',
        severity: 'info',
        metadata: {
          testType: 'Simple Alert',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        }
      }),
      severity: 'info'
    });

    // Test 2: Booking failure alert (simulated)
    const bookingFailureResult = await alertUplistingBookingFailure({
      paymentIntentId: 'pi_test_1234567890',
      amount: 50000, // CHF 500.00
      bookingDetails: {
        propertyId: '84656',
        checkIn: '2025-12-20',
        checkOut: '2025-12-27',
        adults: 2,
        children: 1,
        infants: 0,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+41 79 123 4567',
      },
      error: 'This is a simulated booking failure for testing purposes',
      retryCount: 2,
    });

    return NextResponse.json({
      success: true,
      message: 'Test emails sent successfully!',
      results: {
        simpleAlert: simpleAlertResult,
        bookingFailureAlert: bookingFailureResult
      },
      recipient: process.env.ADMIN_EMAIL
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
