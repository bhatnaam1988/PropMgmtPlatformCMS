'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Users, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { optimizeUplistingImage, IMAGE_SIZES, getImageSizes } from '@/lib/image-optimizer';

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
    <Link href={`/property/${property.id}`} className="block group cursor-pointer">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <Image
          src={optimizeUplistingImage(
            property.photos[currentImageIndex]?.url || property.photos[0]?.url || '/placeholder.jpg',
            IMAGE_SIZES.CARD
          )}
          alt={`${property.name} - Photo ${currentImageIndex + 1}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={getImageSizes('card')}
          quality={75}
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

      <h3 className="text-xl font-medium mb-2">{property.name}</h3>
      <p className="text-gray-600 mb-2">
        {property.address?.city}, {property.address?.state}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> Sleeps {property.maximum_capacity}
        </span>
        <span className="flex items-center gap-1">
          <Bed className="w-4 h-4" /> {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <Bed className="w-4 h-4" /> {property.beds} Bed{property.beds > 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <Bath className="w-4 h-4" /> {property.bathrooms} Bath
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {property.address?.street || 'Central location'}
      </p>
      <Button variant="outline" className="w-full rounded-full pointer-events-none">
        View Details
      </Button>
    </Link>
  );
}
