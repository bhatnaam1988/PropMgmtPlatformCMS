'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyCardSimple({ property }) {
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

  return (
    <div className="group">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
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
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
          {property.photos.slice(0, 5).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-medium mb-2">{property.name}</h3>
      <p className="text-gray-600 mb-2">
        {property.address?.city}, {property.address?.state}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> Sleeps {property.maximum_capacity}
        </span>
        <span>{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
        <span>{property.beds} Bed{property.beds > 1 ? 's' : ''}</span>
        <span>{property.bathrooms} Bath</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {property.address?.street || 'Central location'}
      </p>
      <Link href={`/property/${property.id}`}>
        <Button variant="outline" className="w-full rounded-full">
          View Details
        </Button>
      </Link>
    </div>
  );
}
