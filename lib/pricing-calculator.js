import { stripeConfig } from './stripe-client';

/**
 * Calculate booking pricing including VAT
 * @param {Object} params - Pricing parameters
 * @param {number} params.accommodationTotal - Total accommodation cost (from Uplisting)
 * @param {number} params.cleaningFee - Cleaning fee
 * @param {number} params.nights - Number of nights
 * @returns {Object} Calculated pricing with VAT breakdown
 */
export function calculateBookingPrice({ accommodationTotal, cleaningFee = 0, nights = 1 }) {
  // Validate inputs
  if (!accommodationTotal || accommodationTotal <= 0) {
    throw new Error('Invalid accommodation total');
  }

  const subtotal = accommodationTotal + cleaningFee;
  const vatRate = stripeConfig.getVatRate();
  const vatAmount = Math.round(subtotal * (vatRate / 100));
  const grandTotal = subtotal + vatAmount;
  
  // Calculate average per night for display
  const averagePerNight = Math.round(accommodationTotal / nights);

  return {
    currency: stripeConfig.currency.toUpperCase(),
    accommodationTotal: Math.round(accommodationTotal),
    cleaningFee: Math.round(cleaningFee),
    subtotal: Math.round(subtotal),
    vatRate,
    vatAmount,
    grandTotal,
    nights,
    averagePerNight,
  };
}

/**
 * Format price for display
 * @param {number} amount - Amount in currency
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
export function formatPrice(amount, currency = 'CHF') {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert price to Stripe format (cents)
 * Stripe requires amounts in smallest currency unit (rappen for CHF)
 * @param {number} amount - Amount in major currency unit (CHF)
 * @returns {number} Amount in cents
 */
export function toStripeCents(amount) {
  return Math.round(amount * 100);
}

/**
 * Convert from Stripe format (cents) to major currency unit
 * @param {number} cents - Amount in cents
 * @returns {number} Amount in major currency unit
 */
export function fromStripeCents(cents) {
  return cents / 100;
}

/**
 * Validate booking dates
 * @param {string} checkIn - Check-in date (ISO format)
 * @param {string} checkOut - Check-out date (ISO format)
 * @returns {Object} Validation result with nights count
 */
export function validateBookingDates(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Check if dates are valid
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return { valid: false, error: 'Invalid dates' };
  }

  // Check if check-in is in the past
  if (checkInDate < now) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }

  // Check if check-out is after check-in
  if (checkOutDate <= checkInDate) {
    return { valid: false, error: 'Check-out must be after check-in' };
  }

  // Calculate nights
  const diffTime = Math.abs(checkOutDate - checkInDate);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { valid: true, nights };
}

/**
 * Calculate nights between two dates
 * @param {string} checkIn - Check-in date (ISO format)
 * @param {string} checkOut - Check-out date (ISO format)
 * @returns {number} Number of nights
 */
export function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
