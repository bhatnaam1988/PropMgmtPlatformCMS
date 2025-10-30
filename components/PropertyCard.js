'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateLocal } from '@/lib/uplisting';

export default function PropertyCard({ property, priceDisplay, showFallbackWarning, isUnavailable, filters, nights }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.photos.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.photos.length - 1 ? 0 : prev + 1
    );
  };

  // Build URL with filters
  const buildPropertyUrl = () => {
    const params = new URLSearchParams();
    if (filters.checkIn) params.set('checkIn', formatDateLocal(filters.checkIn));
    if (filters.checkOut) params.set('checkOut', formatDateLocal(filters.checkOut));
    params.set('adults', filters.adults.toString());
    params.set('children', filters.children.toString());
    params.set('infants', filters.infants.toString());
    
    return `/property/${property.id}?${params.toString()}`;
  };

  return (
    <Link href={buildPropertyUrl()}>
      <div className={`group cursor-pointer ${isUnavailable ? 'opacity-60' : ''}`}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-sm font-medium z-10 shadow-md">
            {priceDisplay}
          </div>

          {/* Property Image */}
          <img
            src={property.photos[currentImageIndex]?.url || property.photos[0]?.url || '/placeholder.jpg'}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Navigation Arrows */}
          {property.photos.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 max-w-[90%] overflow-x-auto px-2">
            {property.photos.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full flex-shrink-0 ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Unavailable Message */}
        {isUnavailable && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Property unavailable on selected dates
            </p>
          </div>
        )}

        <h3 className="text-xl font-medium mb-2">{property.name}</h3>
        <p className="text-gray-600 mb-2">
          {property.address?.city}, {property.address?.state}
        </p>

        <p className="text-sm text-gray-600 mb-2">
          {property.description?.substring(0, 100)}...
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> Sleeps {property.maximum_capacity}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {property.bathrooms} Bath
          </span>
        </div>

        {showFallbackWarning && (
          <p className="text-xs text-yellow-700 mb-2">
            ⚠️ Price subject to confirmation
          </p>
        )}

        <p className="text-sm text-gray-600">
          {property.address?.street || 'Central location'}
        </p>

        <Button 
          variant="outline" 
          className="w-full rounded-full mt-4"
          disabled={isUnavailable}
        >
          {isUnavailable ? 'Unavailable' : 'View Details'}
        </Button>
      </div>
    </Link>
  );
}
