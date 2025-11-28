import { stripeConfig } from './stripe-config';

/**
 * Calculate extra guest fees based on property configuration
 * @param {number} totalGuests - Total number of guests
 * @param {Array} propertyFees - Array of fee objects from Uplisting
 * @returns {number} Extra guest fee amount
 */
function calculateExtraGuestFee(totalGuests, propertyFees) {
  if (!propertyFees || propertyFees.length === 0) return 0;
  
  const extraGuestFeeConfig = propertyFees.find(
    fee => fee.attributes?.label === 'extra_guest_charge' && 
           fee.attributes?.enabled === true
  );
  
  if (!extraGuestFeeConfig) return 0;
  
  const guestsIncluded = extraGuestFeeConfig.attributes.guests_included || 0;
  const feePerGuest = extraGuestFeeConfig.attributes.amount || 0;
  const extraGuests = Math.max(0, totalGuests - guestsIncluded);
  
  return extraGuests * feePerGuest;
}

/**
 * Calculate all applicable taxes based on property configuration
 * @param {Object} params - Tax calculation parameters
 * @param {number} params.subtotal - Subtotal before taxes
 * @param {number} params.nights - Number of nights
 * @param {number} params.guests - Total number of guests
 * @param {Array} params.propertyTaxes - Array of tax objects from Uplisting
 * @returns {Object} Tax breakdown and total
 */
function calculateTaxes({ subtotal, nights, guests, propertyTaxes }) {
  const breakdown = [];
  let totalTax = 0;
  
  if (!propertyTaxes || propertyTaxes.length === 0) {
    return { breakdown, totalTax: 0 };
  }
  
  propertyTaxes.forEach(tax => {
    const attrs = tax.attributes;
    let taxAmount = 0;
    
    switch (attrs.label) {
      case 'per_booking_percentage':
        // Percentage tax on subtotal
        if (attrs.type === 'percentage' && attrs.amount > 0) {
          taxAmount = subtotal * (attrs.amount / 100);
          breakdown.push({
            name: attrs.name,
            type: 'percentage',
            rate: attrs.amount,
            amount: taxAmount
          });
        }
        break;
        
      case 'per_booking_amount':
        // Fixed amount per booking
        if (attrs.type === 'fixed' && attrs.amount > 0) {
          taxAmount = attrs.amount;
          breakdown.push({
            name: attrs.name,
            type: 'fixed',
            amount: taxAmount
          });
        }
        break;
        
      case 'per_night':
        // Fixed amount per night
        if (attrs.type === 'fixed' && attrs.amount > 0) {
          taxAmount = attrs.amount * nights;
          breakdown.push({
            name: attrs.name,
            type: 'per_night',
            nights: nights,
            rate: attrs.amount,
            amount: taxAmount
          });
        }
        break;
        
      case 'per_person_per_night':
        // Tourist tax: per person per night
        if (attrs.type === 'fixed' && attrs.amount > 0) {
          taxAmount = attrs.amount * guests * nights;
          breakdown.push({
            name: attrs.name,
            type: 'per_person_per_night',
            guests: guests,
            nights: nights,
            rate: attrs.amount,
            amount: taxAmount
          });
        }
        break;
    }
    
    totalTax += taxAmount;
  });
  
  return { breakdown, totalTax };
}

/**
 * Calculate complete booking price using Uplisting property data
 * @param {Object} params - Pricing parameters
 * @param {number} params.accommodationTotal - Total accommodation cost
 * @param {number} params.cleaningFee - Cleaning fee amount
 * @param {number} params.nights - Number of nights
 * @param {number} params.adults - Number of adults
 * @param {number} params.children - Number of children
 * @param {number} params.infants - Number of infants
 * @param {Array} params.propertyFees - Property fees from Uplisting
 * @param {Array} params.propertyTaxes - Property taxes from Uplisting
 * @returns {Object} Complete price breakdown
 */
export function calculateBookingPrice({
  accommodationTotal,
  cleaningFee = 0,
  nights = 1,
  adults = 2,
  children = 0,
  infants = 0,
  propertyFees = [],
  propertyTaxes = []
}) {
  // Validate inputs
  if (!accommodationTotal || accommodationTotal <= 0) {
    throw new Error('Invalid accommodation total');
  }

  // Calculate total guests
  const totalGuests = adults + children + infants;
  
  // Calculate extra guest fees
  const extraGuestFee = calculateExtraGuestFee(totalGuests, propertyFees);
  
  // Calculate subtotal (before taxes)
  const subtotal = Math.round(accommodationTotal + cleaningFee + extraGuestFee);
  
  // Calculate all applicable taxes
  const taxes = calculateTaxes({
    subtotal,
    nights,
    guests: totalGuests,
    propertyTaxes
  });
  
  // Calculate grand total
  const grandTotal = subtotal + taxes.totalTax;
  
  // Calculate average per night for display
  const averagePerNight = Math.round(accommodationTotal / nights);

  return {
    currency: stripeConfig.getCurrency(),
    accommodationTotal: Math.round(accommodationTotal),
    cleaningFee: Math.round(cleaningFee),
    extraGuestFee: Math.round(extraGuestFee),
    subtotal,
    taxes: taxes.breakdown,
    totalTax: taxes.totalTax,
    grandTotal,
    nights,
    guests: totalGuests,
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
