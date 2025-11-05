import { sendAdminAlert } from '../email';
import { generateAdminAlertEmail } from '../email/templates/adminAlert';

/**
 * Send an alert email for webhook failures
 * @param {Object} options
 * @param {string} options.webhookName - Name of the webhook
 * @param {string} options.error - Error message or description
 * @param {Object} options.payload - The webhook payload that failed (optional)
 * @param {Object} options.metadata - Additional metadata
 */
export async function alertWebhookFailure({ webhookName, error, payload, metadata = {} }) {
  const title = `Webhook Failure: ${webhookName}`;
  
  // Create detailed message with error information
  const message = generateAdminAlertEmail({
    title,
    message: `
      <p>A webhook processing failure occurred:</p>
      <p><strong>Error:</strong> ${error}</p>
      ${payload ? `
        <h3>Payload Summary:</h3>
        <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; max-height: 400px;">${JSON.stringify(payload, null, 2)}</pre>
      ` : ''}
    `,
    severity: 'error',
    metadata: {
      timestamp: new Date().toISOString(),
      webhookName,
      ...metadata
    }
  });

  // Send the alert email
  return sendAdminAlert({
    subject: title,
    message,
    severity: 'error',
    metadata: {
      webhookName,
      error,
      ...metadata
    }
  });
}

/**
 * Send alert for Uplisting booking creation failure after successful payment
 * @param {Object} options
 * @param {string} options.paymentIntentId - Stripe payment intent ID
 * @param {number} options.amount - Payment amount
 * @param {Object} options.bookingDetails - Booking details
 * @param {string} options.error - Error message
 * @param {number} options.retryCount - Number of retry attempts made
 */
export async function alertUplistingBookingFailure({
  paymentIntentId,
  amount,
  bookingDetails,
  error,
  retryCount = 0
}) {
  const title = 'CRITICAL: Uplisting Booking Failed After Payment';
  
  const message = generateAdminAlertEmail({
    title,
    message: `
      <p style="color: #d32f2f; font-weight: bold;">⚠️ A customer's payment was successful but the Uplisting booking creation failed!</p>
      <p><strong>Action Required:</strong> Manual intervention needed to create the booking in Uplisting.</p>
      
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Payment Intent ID:</strong> ${paymentIntentId}</li>
        <li><strong>Amount Charged:</strong> CHF ${(amount / 100).toFixed(2)}</li>
        <li><strong>Retry Attempts:</strong> ${retryCount}</li>
      </ul>
      
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Property ID:</strong> ${bookingDetails.propertyId}</li>
        <li><strong>Check-in:</strong> ${bookingDetails.checkIn}</li>
        <li><strong>Check-out:</strong> ${bookingDetails.checkOut}</li>
        <li><strong>Guests:</strong> ${bookingDetails.adults} adults, ${bookingDetails.children} children, ${bookingDetails.infants} infants</li>
        <li><strong>Guest Name:</strong> ${bookingDetails.firstName} ${bookingDetails.lastName}</li>
        <li><strong>Guest Email:</strong> ${bookingDetails.email}</li>
        <li><strong>Guest Phone:</strong> ${bookingDetails.phone}</li>
      </ul>
      
      <h3>Error Message:</h3>
      <pre style="background-color: #ffebee; padding: 10px; border-radius: 4px; color: #c62828;">${error}</pre>
      
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Log into Uplisting dashboard</li>
        <li>Manually create the booking with the details above</li>
        <li>Contact the guest to confirm their booking</li>
        <li>Investigate why the API call failed</li>
      </ol>
    `,
    severity: 'critical',
    metadata: {
      paymentIntentId,
      amount: `CHF ${(amount / 100).toFixed(2)}`,
      propertyId: bookingDetails.propertyId,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      guestEmail: bookingDetails.email,
      retryCount,
      timestamp: new Date().toISOString()
    }
  });

  return sendAdminAlert({
    subject: title,
    message,
    severity: 'critical',
    metadata: {
      paymentIntentId,
      bookingDetails,
      retryCount
    }
  });
}
