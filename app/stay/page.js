'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { formatDateLocal } from '@/lib/uplisting';
import {
  LocationSelect,
  DateRangePicker,
  GuestsSelect,
  BedroomsSelect,
  AmenitiesMultiSelect
} from '@/components/FilterDropdowns';

function StayPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null,
    checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    infants: parseInt(searchParams.get('infants') || '0'),
    bedrooms: 'any',
    amenities: [] // Changed to array for multi-select
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch pricing when properties load or dates change
  useEffect(() => {
    if (properties.length > 0) {
      fetchPricing();
    }
  }, [properties, filters.checkIn, filters.checkOut]);

  async function fetchProperties() {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      const props = data.properties || [];
      setProperties(props);
      
      // Extract unique amenities from all properties
      const amenitiesSet = new Set();
      props.forEach(property => {
        if (property.amenities && Array.isArray(property.amenities)) {
          property.amenities.forEach(amenity => {
            if (amenity.name) {
              amenitiesSet.add(amenity.name);
            }
          });
        }
      });
      
      // Convert to sorted array
      const uniqueAmenities = Array.from(amenitiesSet).sort();
      setAvailableAmenities(uniqueAmenities);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPricing() {
    setPricingLoading(true);
    try {
      const propertyIds = properties.map(p => p.id);
      
      const body = {
        propertyIds
      };
      
      // Add dates if selected - use local timezone formatting
      if (filters.checkIn && filters.checkOut) {
        body.from = formatDateLocal(filters.checkIn);
        body.to = formatDateLocal(filters.checkOut);
      }
      
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      // Convert results array to object keyed by propertyId
      const pricingMap = {};
      data.results.forEach(result => {
        pricingMap[result.propertyId] = result.pricing;
      });
      
      setPricingData(pricingMap);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setPricingLoading(false);
    }
  }

  const totalGuests = filters.adults + filters.children + filters.infants;
  
  const calculateNights = () => {
    if (!filters.checkIn || !filters.checkOut) return 0;
    const diffTime = Math.abs(filters.checkOut - filters.checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  
  const filteredProperties = properties.filter(property => {
    // Filter by guest capacity
    if (totalGuests && property.maximum_capacity < totalGuests) return false;
    
    // Filter by bedrooms
    if (filters.bedrooms !== 'any' && property.bedrooms < parseInt(filters.bedrooms)) return false;
    
    // Filter by location
    if (filters.location && !filters.location.toLowerCase().includes('grächen') && 
        !property.address?.city?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by amenities - property must have ALL selected amenities
    if (filters.amenities && filters.amenities.length > 0) {
      const propertyAmenities = (property.amenities || []).map(a => 
        a.name.toLowerCase().replace(/\s+/g, '_')
      );
      
      const hasAllAmenities = filters.amenities.every(selectedAmenity => 
        propertyAmenities.includes(selectedAmenity)
      );
      
      if (!hasAllAmenities) return false;
    }
    
    // Filter by availability - if dates are selected, filter out unavailable properties
    if (nights > 0) {
      const pricing = pricingData[property.id];
      if (pricing && !pricing.available) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-light mb-4">Book your Stay</h1>
          <p className="text-gray-600 mb-12">
            Find a home that fits your journey. Our listings are chosen for their comfort, character,
            and proximity to the best of local life – from mountain adventures to peaceful relaxation.
          </p>

          {/* Filters - Custom Shadcn Components */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <LocationSelect
                value={filters.location}
                onChange={(value) => setFilters({...filters, location: value})}
              />
              
              <DateRangePicker
                checkIn={filters.checkIn}
                checkOut={filters.checkOut}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setFilters({...filters, checkIn: start, checkOut: end});
                }}
              />
              
              <GuestsSelect
                adults={filters.adults}
                children={filters.children}
                infants={filters.infants}
                onGuestsChange={(guests) => setFilters({...filters, ...guests})}
              />
              
              <BedroomsSelect
                value={filters.bedrooms}
                onChange={(value) => setFilters({...filters, bedrooms: value})}
              />
              
              <AmenitiesMultiSelect
                value={filters.amenities}
                onChange={(value) => setFilters({...filters, amenities: value})}
                availableAmenities={availableAmenities}
              />
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <p className="text-gray-600">{filteredProperties.length} listing{filteredProperties.length !== 1 ? 's' : ''} found</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <svg 
                    className="w-24 h-24 mx-auto text-gray-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-3">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-8">
                  We couldn't find any properties matching your search criteria. Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      location: '',
                      checkIn: null,
                      checkOut: null,
                      adults: 2,
                      children: 0,
                      infants: 0,
                      bedrooms: 'any',
                      amenities: []
                    });
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-full text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
              {filteredProperties.map((property) => {
                const pricing = pricingData[property.id];
                const currency = pricing?.currency || 'CHF';
                
                // Determine what to display
                let priceDisplay;
                if (pricingLoading) {
                  priceDisplay = 'Loading...';
                } else if (nights > 0 && pricing?.total) {
                  priceDisplay = `${currency} ${pricing.total} for ${nights} night${nights > 1 ? 's' : ''}`;
                } else if (pricing?.averageRate) {
                  priceDisplay = `${currency} ${pricing.averageRate}/night`;
                } else {
                  priceDisplay = `${currency} 300/night`;
                }
                
                const showFallbackWarning = pricing?.useFallback;
                const isUnavailable = nights > 0 && pricing && !pricing.available;
                
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    priceDisplay={priceDisplay}
                    showFallbackWarning={showFallbackWarning}
                    isUnavailable={isUnavailable}
                    filters={filters}
                    nights={nights}
                  />
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-gray-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-light mb-4">Have a question about our listings or locations?</h2>
            <p className="text-gray-600 mb-8">Contact us and we would be happy to help</p>
            <Link href="/about">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function StayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <StayPageContent />
    </Suspense>
  );
}
