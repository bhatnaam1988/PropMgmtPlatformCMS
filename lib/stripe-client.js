import Stripe from 'stripe';

// Validate Stripe configuration
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Latest stable API version
  typescript: false,
});

// Stripe configuration helper
export const stripeConfig = {
  currency: process.env.STRIPE_CURRENCY || 'chf',
  taxMode: process.env.STRIPE_TAX_MODE || 'manual',
  manualVatRate: parseFloat(process.env.MANUAL_VAT_RATE || '7.7'),
  
  // Check if using Stripe Tax
  isStripeTaxEnabled() {
    return this.taxMode === 'stripe_tax';
  },
  
  // Get VAT rate
  getVatRate() {
    return this.manualVatRate;
  }
};

// Retry configuration
export const retryConfig = {
  maxAttempts: parseInt(process.env.BOOKING_RETRY_MAX_ATTEMPTS || '2'),
  backoffMs: parseInt(process.env.BOOKING_RETRY_BACKOFF_MS || '2000'),
};

// Admin alert configuration
export const adminConfig = {
  email: process.env.ADMIN_EMAIL,
  alertEnabled: process.env.ADMIN_ALERT_ENABLED === 'true',
};

export default stripe;
