// Uplisting API Client
const UPLISTING_API_KEY = process.env.UPLISTING_API_KEY;
const UPLISTING_API_URL = process.env.UPLISTING_API_URL;

const headers = {
  'Authorization': `Basic ${UPLISTING_API_KEY}`,
  'Content-Type': 'application/json'
};

// Helper to format date as YYYY-MM-DD in local timezone (not UTC)
export function formatDateLocal(date) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function verifyApiKey() {
  const response = await fetch(`${UPLISTING_API_URL}/users/me`, { headers });
  return response.json();
}

export async function getProperties() {
  const response = await fetch(`${UPLISTING_API_URL}/properties`, { 
    headers,
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
}

export async function getProperty(id) {
  const response = await fetch(`${UPLISTING_API_URL}/properties/${id}`, { 
    headers,
    next: { revalidate: 300 }
  });
  if (!response.ok) throw new Error('Failed to fetch property');
  return response.json();
}

export async function getAvailability(propertyId, from, to) {
  const response = await fetch(
    `${UPLISTING_API_URL}/calendar/${propertyId}?from=${from}&to=${to}`,
    { headers, next: { revalidate: 60 } } // Cache for 1 minute
  );
  if (!response.ok) throw new Error('Failed to fetch availability');
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

export async function getBookings(propertyId, from, to) {
  const response = await fetch(
    `${UPLISTING_API_URL}/bookings/${propertyId}?from=${from}&to=${to}`,
    { headers }
  );
  if (!response.ok) throw new Error('Failed to fetch bookings');
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