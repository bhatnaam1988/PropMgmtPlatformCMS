/**
 * Booking validation utilities
 * Validates booking constraints against property rules from Uplisting
 */

/**
 * Calculate nights between two dates
 * @param {string} checkIn - Check-in date (ISO format)
 * @param {string} checkOut - Check-out date (ISO format)
 * @returns {number} Number of nights
 */
function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Validate booking against property constraints
 * @param {Object} params - Validation parameters
 * @param {Object} params.property - Property data from Uplisting
 * @param {string} params.checkIn - Check-in date
 * @param {string} params.checkOut - Check-out date
 * @param {number} params.adults - Number of adults
 * @param {number} params.children - Number of children
 * @param {number} params.infants - Number of infants
 * @param {Object} params.availabilityData - Availability data from Uplisting
 * @returns {Object} Validation result with errors and warnings
 */
export function validateBooking({
  property,
  checkIn,
  checkOut,
  adults,
  children,
  infants,
  availabilityData
}) {
  const errors = [];
  const warnings = [];
  
  // Basic validation
  if (!property || !checkIn || !checkOut) {
    errors.push({
      field: 'general',
      message: 'Missing required booking information.'
    });
    return { valid: false, errors, warnings };
  }
  
  // 1. Validate guest count
  const totalGuests = (adults || 0) + (children || 0) + (infants || 0);
  const maxCapacity = property.maximum_capacity || 10;
  
  if (totalGuests > maxCapacity) {
    errors.push({
      field: 'guests',
      message: `This property can accommodate maximum ${maxCapacity} guest${maxCapacity !== 1 ? 's' : ''}. You selected ${totalGuests} guest${totalGuests !== 1 ? 's' : ''}.`
    });
  }
  
  if (totalGuests === 0) {
    errors.push({
      field: 'guests',
      message: 'Please select at least 1 guest.'
    });
  }
  
  // 2. Validate dates
  const nights = calculateNights(checkIn, checkOut);
  
  if (nights <= 0) {
    errors.push({
      field: 'dates',
      message: 'Check-out date must be after check-in date.'
    });
    return { valid: false, errors, warnings };
  }
  
  // 3. Validate minimum stay
  const minStay = availabilityData?.calendar?.days?.[0]?.minimum_length_of_stay || 
                  property.minimum_length_of_stay || 1;
  
  if (nights < minStay) {
    errors.push({
      field: 'dates',
      message: `This property requires a minimum stay of ${minStay} night${minStay !== 1 ? 's' : ''}. You selected ${nights} night${nights !== 1 ? 's' : ''}.`
    });
  }
  
  // 4. Validate maximum stay (if specified)
  const maxStay = availabilityData?.calendar?.days?.[0]?.maximum_available_nights;
  if (maxStay && nights > maxStay) {
    errors.push({
      field: 'dates',
      message: `Maximum stay for this property is ${maxStay} night${maxStay !== 1 ? 's' : ''}. You selected ${nights} night${nights !== 1 ? 's' : ''}.`
    });
  }
  
  // 5. Check for closed dates
  if (availabilityData?.calendar?.days) {
    const closedForArrival = availabilityData.calendar.days.find(
      day => day.date === checkIn && day.closed_for_arrival
    );
    
    if (closedForArrival) {
      errors.push({
        field: 'checkIn',
        message: 'Check-in is not available on the selected date. Please choose a different date.'
      });
    }
    
    const closedForDeparture = availabilityData.calendar.days.find(
      day => day.date === checkOut && day.closed_for_departure
    );
    
    if (closedForDeparture) {
      errors.push({
        field: 'checkOut',
        message: 'Check-out is not available on the selected date. Please choose a different date.'
      });
    }
    
    // Check if any dates are unavailable
    const unavailableDates = availabilityData.calendar.days.filter(
      day => day.available === false
    );
    
    if (unavailableDates.length > 0) {
      errors.push({
        field: 'dates',
        message: 'Some dates in your selected range are not available. Please choose different dates.'
      });
    }
  }
  
  // 6. Check overall availability
  if (availabilityData?.pricing?.available === false) {
    errors.push({
      field: 'dates',
      message: 'These dates are not available for booking. Please select different dates.'
    });
  }
  
  // 7. Warnings for extra guests
  const extraGuestFee = property.fees?.find(
    f => f.attributes?.label === 'extra_guest_charge' && f.attributes?.enabled
  );
  
  if (extraGuestFee && totalGuests > extraGuestFee.attributes.guests_included) {
    const extraGuests = totalGuests - extraGuestFee.attributes.guests_included;
    const extraCost = extraGuests * extraGuestFee.attributes.amount;
    warnings.push({
      field: 'guests',
      message: `Note: ${extraGuests} extra guest${extraGuests !== 1 ? 's' : ''} will incur an additional fee of CHF ${extraCost}.`
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get property constraints for display
 * @param {Object} property - Property data
 * @param {Object} availabilityData - Availability data
 * @returns {Object} Constraint information
 */
export function getPropertyConstraints(property, availabilityData) {
  const constraints = {
    maxCapacity: property?.maximum_capacity || 10,
    minStay: availabilityData?.calendar?.days?.[0]?.minimum_length_of_stay || 
             property?.minimum_length_of_stay || 1,
    maxStay: availabilityData?.calendar?.days?.[0]?.maximum_available_nights || null,
    checkInTime: property?.check_in_time || 15,
    checkOutTime: property?.check_out_time || 11,
    extraGuestFee: null,
    guestsIncluded: 0
  };
  
  // Get extra guest fee info
  const extraGuestFeeConfig = property?.fees?.find(
    f => f.attributes?.label === 'extra_guest_charge' && f.attributes?.enabled
  );
  
  if (extraGuestFeeConfig) {
    constraints.extraGuestFee = extraGuestFeeConfig.attributes.amount;
    constraints.guestsIncluded = extraGuestFeeConfig.attributes.guests_included;
  }
  
  return constraints;
}
