// Uplisting API Client
const UPLISTING_API_KEY = process.env.UPLISTING_API_KEY;
const UPLISTING_API_URL = process.env.UPLISTING_API_URL;

const headers = {
  'Authorization': `Basic ${UPLISTING_API_KEY}`,
  'Content-Type': 'application/json'
};

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

// Calculate average nightly rate and check availability
export function calculatePricing(calendarData) {
  const days = calendarData.data || [];
  
  if (days.length === 0) {
    return {
      available: false,
      averageRate: 0,
      totalNights: 0,
      total: 0,
      unavailableDates: []
    };
  }
  
  let totalRate = 0;
  let availableNights = 0;
  const unavailableDates = [];
  
  days.forEach(day => {
    const attrs = day.attributes;
    if (!attrs.available || attrs.closed) {
      unavailableDates.push(attrs.date);
    } else {
      totalRate += parseFloat(attrs.rate || 0);
      availableNights++;
    }
  });
  
  const available = unavailableDates.length === 0 && availableNights > 0;
  const averageRate = availableNights > 0 ? Math.round(totalRate / availableNights) : 0;
  
  return {
    available,
    averageRate,
    totalNights: days.length,
    availableNights,
    total: totalRate,
    unavailableDates,
    currency: days[0]?.attributes?.currency || 'CHF'
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