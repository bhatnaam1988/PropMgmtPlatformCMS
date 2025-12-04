/**
 * Email Alert Functions
 * Send notifications to admins for system events requiring attention
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@swissalpinejourney.com';
const FROM_EMAIL = 'booking@swissalpinejourney.com';

/**
 * Send email notification about missing rates in Uplisting
 * @param {Object} params - Notification parameters
 * @param {string} params.propertyId - Property ID
 * @param {string} params.propertyName - Property name
 * @param {string} params.checkIn - Check-in date
 * @param {string} params.checkOut - Check-out date
 * @param {Array} params.missingRates - Array of missing rate details
 * @param {string} params.bookingId - Booking ID (if available)
 */
export async function sendMissingRatesAlert({ 
  propertyId, 
  propertyName, 
  checkIn, 
  checkOut, 
  missingRates,
  bookingId = null 
}) {
  try {
    // Build list of missing dates
    const missingDatesList = missingRates
      .map(mr => `  • ${mr.date} (Night ${mr.nightNumber}) - Used fallback: CHF ${mr.fallbackRate}`)
      .join('\n');

    const subject = `⚠️ Missing Price Data in Uplisting - Property ${propertyId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⚠️ Missing Price Data Alert</h2>
        
        <p>A booking was made with missing rate data from Uplisting. Fallback rates (CHF 300/night) were used.</p>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Property Details</h3>
          <p style="margin: 4px 0;"><strong>Property ID:</strong> ${propertyId}</p>
          <p style="margin: 4px 0;"><strong>Property Name:</strong> ${propertyName || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>Check-in:</strong> ${checkIn}</p>
          <p style="margin: 4px 0;"><strong>Check-out:</strong> ${checkOut}</p>
          ${bookingId ? `<p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>` : ''}
        </div>
        
        <h3 style="color: #991b1b;">Missing Rates for Dates:</h3>
        <pre style="background: #f9fafb; padding: 12px; border-radius: 4px; overflow-x: auto;">
${missingDatesList}
        </pre>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">Action Required</h3>
          <ol style="margin: 8px 0; padding-left: 20px;">
            <li>Log into Uplisting dashboard</li>
            <li>Navigate to property: <strong>${propertyId}</strong></li>
            <li>Update pricing for the missing dates listed above</li>
            <li>Verify rates are set for upcoming bookings</li>
          </ol>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          This is an automated alert from your booking system. The booking proceeded using fallback rates, but you should update Uplisting pricing to ensure accurate future bookings.
        </p>
      </div>
    `;

    const text = `
⚠️ MISSING PRICE DATA ALERT

A booking was made with missing rate data from Uplisting.

Property Details:
- Property ID: ${propertyId}
- Property Name: ${propertyName || 'N/A'}
- Check-in: ${checkIn}
- Check-out: ${checkOut}
${bookingId ? `- Booking ID: ${bookingId}` : ''}

Missing Rates for Dates:
${missingDatesList}

ACTION REQUIRED:
1. Log into Uplisting dashboard
2. Navigate to property: ${propertyId}
3. Update pricing for the missing dates
4. Verify rates are set for upcoming bookings

Fallback rate used: CHF 300/night
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
      text,
    });

    console.log('✅ Missing rates alert sent to admin:', ADMIN_EMAIL);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send missing rates alert:', error);
    // Don't throw - we don't want to block booking if email fails
    return { success: false, error: error.message };
  }
}

/**
 * Send email notification about complete missing rate data (all dates)
 * @param {Object} params - Notification parameters
 */
export async function sendNoRatesAlert({ 
  propertyId, 
  propertyName, 
  checkIn, 
  checkOut, 
  nights,
  bookingId = null 
}) {
  try {
    const subject = `🚨 No Price Data in Uplisting - Property ${propertyId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 Critical: No Price Data Available</h2>
        
        <p><strong>All rates were missing</strong> for a booking. Complete fallback pricing was used (CHF 300/night for all ${nights} nights).</p>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Property Details</h3>
          <p style="margin: 4px 0;"><strong>Property ID:</strong> ${propertyId}</p>
          <p style="margin: 4px 0;"><strong>Property Name:</strong> ${propertyName || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>Check-in:</strong> ${checkIn}</p>
          <p style="margin: 4px 0;"><strong>Check-out:</strong> ${checkOut}</p>
          <p style="margin: 4px 0;"><strong>Nights:</strong> ${nights}</p>
          ${bookingId ? `<p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>` : ''}
          <p style="margin: 4px 0; color: #dc2626;"><strong>Total Fallback Cost:</strong> CHF ${nights * 300}</p>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">⚠️ URGENT Action Required</h3>
          <ol style="margin: 8px 0; padding-left: 20px;">
            <li><strong>IMMEDIATELY</strong> check Uplisting calendar for property ${propertyId}</li>
            <li>Verify pricing is set for ${checkIn} to ${checkOut}</li>
            <li>Update any missing rates</li>
            <li>Consider reviewing calendar sync settings</li>
            <li>Check if there are upcoming bookings with similar issues</li>
          </ol>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          This is a critical automated alert. Complete fallback pricing was used, which may not reflect actual property rates.
        </p>
      </div>
    `;

    const text = `
🚨 CRITICAL: NO PRICE DATA AVAILABLE

All rates were missing for a booking. Complete fallback pricing was used.

Property Details:
- Property ID: ${propertyId}
- Property Name: ${propertyName || 'N/A'}
- Check-in: ${checkIn}
- Check-out: ${checkOut}
- Nights: ${nights}
${bookingId ? `- Booking ID: ${bookingId}` : ''}
- Total Fallback Cost: CHF ${nights * 300}

⚠️ URGENT ACTION REQUIRED:
1. IMMEDIATELY check Uplisting calendar for property ${propertyId}
2. Verify pricing is set for ${checkIn} to ${checkOut}
3. Update any missing rates
4. Consider reviewing calendar sync settings
5. Check upcoming bookings for similar issues

Complete fallback used: CHF 300/night × ${nights} nights = CHF ${nights * 300}
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
      text,
    });

    console.log('✅ No rates alert sent to admin:', ADMIN_EMAIL);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send no rates alert:', error);
    return { success: false, error: error.message };
  }
}
