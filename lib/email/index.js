// Email service factory
import { ResendProvider } from './providers/resend';

// Provider configuration
const PROVIDERS = {
  resend: ResendProvider,
  // Add other providers here as needed
  // sendgrid: SendGridProvider,
};

// Default provider from environment or fallback to resend
const DEFAULT_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';

/**
 * Email service factory that returns the configured provider
 */
export function createEmailService(provider = DEFAULT_PROVIDER) {
  if (!PROVIDERS[provider]) {
    console.warn(`Email provider "${provider}" not found, using default (resend)`);
    provider = 'resend';
  }
  
  return new PROVIDERS[provider]();
}

/**
 * Get the default email service instance
 */
export function getEmailService() {
  return createEmailService();
}

/**
 * Send an admin alert email
 * @param {Object} options - Email options
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (HTML supported)
 * @param {string} options.severity - Alert severity (info, warning, error, critical)
 * @param {Object} options.metadata - Additional metadata for the email
 */
export async function sendAdminAlert({ subject, message, severity = 'info', metadata = {} }) {
  const emailService = getEmailService();
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.error('ADMIN_EMAIL not configured in environment variables');
    return {
      success: false,
      error: 'Admin email not configured'
    };
  }
  
  return emailService.sendEmail({
    to: adminEmail,
    subject: `[${severity.toUpperCase()}] ${subject}`,
    html: message,
    metadata: {
      alertType: 'admin',
      severity,
      ...metadata
    }
  });
}
