/**
 * Stripe configuration that can be safely used on both client and server
 * Does NOT initialize Stripe SDK
 */

// Stripe configuration helper (safe for client-side)
export const stripeConfig = {
  currency: 'chf',
  
  // Get currency in uppercase
  getCurrency() {
    return this.currency.toUpperCase();
  }
};
