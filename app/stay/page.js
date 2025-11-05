'use client';

import { useState, useEffect } from 'react';
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

export default function StayPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  
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
      setProperties(data.properties || []);
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
    
    return true;
  });

  const calculateNights = () => {
    if (!filters.checkIn || !filters.checkOut) return 0;
    const diffTime = Math.abs(filters.checkOut - filters.checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-20">
            <Link href="/" className="absolute left-4 flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-light">Swiss Alpine Journey</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/stay" className="text-black font-medium">Stay</Link>
              <Link href="/explore" className="text-gray-700 hover:text-black">Explore</Link>
              <Link href="/services" className="text-gray-700 hover:text-black">Services</Link>
              <Link href="/about" className="text-gray-700 hover:text-black">About</Link>
            </nav>
            
            {/* Plan Your Journey button - Hidden for now, may use later */}
            <Link href="/stay" className="hidden">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                Plan Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-4">
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
                value={totalGuests}
                onChange={(value) => setFilters({...filters, adults: value, children: 0, infants: 0})}
              />
              
              <BedroomsSelect
                value={filters.bedrooms}
                onChange={(value) => setFilters({...filters, bedrooms: value})}
              />
              
              <AmenitiesMultiSelect
                value={filters.amenities}
                onChange={(value) => setFilters({...filters, amenities: value})}
              />
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <p className="text-gray-600">{filteredProperties.length} listings found</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
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

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-6 h-6" />
                <span className="text-xl font-light">Swiss Alpine Journey</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Where authentic stays meet modern comfort and local adventure.
              </p>
              <p className="text-gray-600 text-sm">@swissalpinejourney</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Services</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/services/cleaning">Cleaning Services</Link></li>
                <li><Link href="/services/rental">Rental Management</Link></li>
                <li><Link href="/about">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>+1 (555) 123-4567</li>
                <li>hello@swissalpinejourney.com</li>
                <li>Available worldwide</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
                <li><Link href="/gdpr">GDPR Information</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-600 text-sm">
            © 2024 Swiss Alpine Journey. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
