// Uplisting API Client
const UPLISTING_API_KEY = process.env.UPLISTING_API_KEY;
const UPLISTING_API_URL = process.env.UPLISTING_API_URL;
const UPLISTING_CLIENT_ID = process.env.UPLISTING_CLIENT_ID;

// Function to get headers with properly encoded Basic auth
function getHeaders() {
  if (!UPLISTING_API_KEY) {
    throw new Error('UPLISTING_API_KEY is not configured');
  }
  if (!UPLISTING_CLIENT_ID) {
    throw new Error('UPLISTING_CLIENT_ID is not configured');
  }
  // Uplisting API key is already base64 encoded, use it directly
  return {
    'Authorization': `Basic ${UPLISTING_API_KEY}`,
    'X-Uplisting-Client-Id': UPLISTING_CLIENT_ID,
    'Content-Type': 'application/json'
  };
}

// Helper to format date as YYYY-MM-DD in local timezone (not UTC)
export function formatDateLocal(date) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function verifyApiKey() {
  const response = await fetch(`${UPLISTING_API_URL}/users/me`, { headers: getHeaders() });
  return response.json();
}

export async function getProperties() {
  const response = await fetch(`${UPLISTING_API_URL}/properties`, { 
    headers: getHeaders(),
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Uplisting API error:', response.status, errorText);
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }
  return response.json();
}

export async function getProperty(id) {
  const response = await fetch(`${UPLISTING_API_URL}/properties/${id}`, { 
    headers: getHeaders(),
    next: { revalidate: 300 }
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Uplisting API error:', response.status, errorText);
    throw new Error(`Failed to fetch property: ${response.status}`);
  }
  return response.json();
}

export async function getAvailability(propertyId, from, to) {
  const response = await fetch(
    `${UPLISTING_API_URL}/calendar/${propertyId}?from=${from}&to=${to}`,
    { headers: getHeaders(), next: { revalidate: 60 } } // Cache for 1 minute
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Uplisting API error:', response.status, errorText);
    throw new Error(`Failed to fetch availability: ${response.status}`);
  }
  return response.json();
}

// Helper to get current month date range
export function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  return {
    from: firstDay.toISOString().split('T')[0],
    to: lastDay.toISOString().split('T')[0]
  };
}

// Calculate average nightly rate and check availability
// NOTE: This function is used for BROWSING/LISTING pages
// For BOOKING calculations, use calculateAccommodationTotal() instead
export function calculatePricing(calendarData) {
  // Handle both data formats from Uplisting
  const days = calendarData.data || calendarData.calendar?.days || [];
  
  if (days.length === 0) {
    return {
      available: false,
      averageRate: 0,
      totalNights: 0,
      total: 0,
      unavailableDates: [],
      noCalendarData: true,
      error: 'No calendar data available for selected dates',
      useFallback: true
    };
  }
  
  let totalRate = 0;
  let rateCount = 0;
  const unavailableDates = [];
  
  days.forEach(day => {
    // Handle both nested attributes and direct properties
    const available = day.available ?? day.attributes?.available ?? true;
    const closed = day.closed_for_arrival || day.closed_for_departure || day.attributes?.closed;
    const rate = parseFloat(day.day_rate || day.rate || day.attributes?.rate || day.attributes?.day_rate || 0);
    const date = day.date || day.attributes?.date;
    
    // ALWAYS include rate in calculation (even if not available)
    if (rate > 0) {
      totalRate += rate;
      rateCount++;
    }
    
    // Track unavailable dates separately
    if (!available || closed) {
      unavailableDates.push(date);
    }
  });
  
  // Use fallback if no rates found
  if (rateCount === 0) {
    return {
      available: false,
      averageRate: 300, // Fallback rate
      totalNights: days.length,
      availableNights: 0,
      total: days.length * 300,
      unavailableDates,
      currency: 'CHF',
      noCalendarData: false,
      useFallback: true
    };
  }
  
  const allAvailable = unavailableDates.length === 0 && rateCount > 0;
  const averageRate = rateCount > 0 ? Math.round(totalRate / rateCount) : 0;
  
  return {
    available: allAvailable,
    averageRate,
    totalNights: days.length,
    availableNights: days.length - unavailableDates.length,
    total: Math.round(totalRate),
    unavailableDates,
    currency: days[0]?.currency || days[0]?.attributes?.currency || 'CHF',
    noCalendarData: false,
    useFallback: false
  };
}

/**
 * Calculate accommodation total for a specific booking date range
 * IMPORTANT: Uses Uplisting's date interpretation - dates represent the morning you wake up
 * 
 * For a booking from Jan 6 (check-in) to Jan 9 (check-out):
 * - Night 1: Sleep from 6th→7th (rate for "7th" in Uplisting)
 * - Night 2: Sleep from 7th→8th (rate for "8th" in Uplisting)
 * - Night 3: Sleep from 8th→9th (rate for "9th" in Uplisting)
 * 
 * So we calculate rates for dates: checkIn+1 through checkOut (inclusive)
 * 
 * @param {Object} calendarData - Calendar data from Uplisting
 * @param {string} checkInDate - Check-in date (YYYY-MM-DD)
 * @param {string} checkOutDate - Check-out date (YYYY-MM-DD)
 * @returns {Object} Accommodation pricing breakdown
 */
export function calculateAccommodationTotal(calendarData, checkInDate, checkOutDate) {
  const FALLBACK_RATE = 300; // CHF 300 per night fallback
  
  // Handle both data formats from Uplisting
  const days = calendarData.data || calendarData.calendar?.days || [];
  
  if (days.length === 0) {
    return {
      success: false,
      error: 'No calendar data available for selected dates',
      accommodationTotal: 0,
      nights: 0,
      nightlyRates: [],
      usedFallback: false
    };
  }
  
  // Convert check-in and check-out to Date objects
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  // Calculate number of nights
  const diffTime = Math.abs(checkOut - checkIn);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (nights <= 0) {
    return {
      success: false,
      error: 'Invalid date range',
      accommodationTotal: 0,
      nights: 0,
      nightlyRates: [],
      usedFallback: false
    };
  }
  
  // Build a map of dates to rates for quick lookup
  const rateMap = {};
  days.forEach(day => {
    const date = day.date || day.attributes?.date;
    const rate = parseFloat(day.day_rate || day.rate || day.attributes?.rate || day.attributes?.day_rate || 0);
    if (date) {
      rateMap[date] = rate;
    }
  });
  
  // Calculate rates for each night following Uplisting's logic
  // Dates represent the morning you wake up, so:
  // Night 1 (checkIn → checkIn+1) uses rate for checkIn+1
  // Night 2 (checkIn+1 → checkIn+2) uses rate for checkIn+2
  // ...
  // Night N (checkOut-1 → checkOut) uses rate for checkOut
  
  let totalAccommodation = 0;
  const nightlyRates = [];
  const missingRates = [];
  let usedFallback = false;
  
  for (let i = 1; i <= nights; i++) {
    const nightDate = new Date(checkIn);
    nightDate.setDate(checkIn.getDate() + i);
    const dateStr = nightDate.toISOString().split('T')[0];
    
    let rateForNight = rateMap[dateStr];
    
    // If rate is missing or zero, use fallback
    if (!rateForNight || rateForNight <= 0) {
      rateForNight = FALLBACK_RATE;
      usedFallback = true;
      missingRates.push({
        date: dateStr,
        nightNumber: i,
        usedFallback: true,
        fallbackRate: FALLBACK_RATE
      });
    }
    
    totalAccommodation += rateForNight;
    nightlyRates.push({
      date: dateStr,
      nightNumber: i,
      rate: rateForNight,
      isFallback: rateForNight === FALLBACK_RATE && (!rateMap[dateStr] || rateMap[dateStr] <= 0)
    });
  }
  
  // Get currency from calendar data
  const currency = days[0]?.currency || days[0]?.attributes?.currency || 'CHF';
  
  return {
    success: true,
    accommodationTotal: totalAccommodation,
    nights,
    nightlyRates,
    averagePerNight: totalAccommodation / nights,
    currency,
    usedFallback,
    missingRates: missingRates.length > 0 ? missingRates : null,
    checkIn: checkInDate,
    checkOut: checkOutDate
  };
}

export async function getBookings(propertyId, from, to) {
  const response = await fetch(
    `${UPLISTING_API_URL}/bookings/${propertyId}?from=${from}&to=${to}`,
    { headers: getHeaders() }
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Uplisting API error:', response.status, errorText);
    throw new Error(`Failed to fetch bookings: ${response.status}`);
  }
  return response.json();
}

// Helper to format property data for display
export function formatProperty(propertyData) {
  const property = propertyData.data;
  const included = propertyData.included || [];
  
  // Find related data from included
  const address = included.find(i => 
    i.type === 'addresses' && i.id === property.relationships?.address?.data?.id
  );
  
  const photos = property.relationships?.photos?.data?.map(photoRef => {
    const photo = included.find(i => i.type === 'photos' && i.id === photoRef.id);
    return photo?.attributes;
  }).filter(Boolean) || [];
  
  const amenities = property.relationships?.amenities?.data?.map(amenityRef => {
    const amenity = included.find(i => i.type === 'amenities' && i.id === amenityRef.id);
    return amenity?.attributes;
  }).filter(Boolean) || [];

  const fees = included.filter(i => i.type === 'property_fees');
  const taxes = included.filter(i => i.type === 'property_taxes');
  
  return {
    id: property.id,
    ...property.attributes,
    address: address?.attributes,
    photos,
    amenities,
    fees,
    taxes,
    uplistingUrl: property.attributes.uplisting_domain + '/' + property.attributes.property_slug
  };
}

export function formatProperties(data) {
  return data.data.map(property => {
    const included = data.included || [];
    return formatProperty({ data: property, included });
  });
}