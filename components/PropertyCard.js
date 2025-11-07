'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Users, Bed, Bath, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateLocal } from '@/lib/uplisting';
import { optimizeUplistingImage, IMAGE_SIZES, getImageSizes } from '@/lib/image-optimizer';

export default function PropertyCard({ property, priceDisplay, showFallbackWarning, isUnavailable, filters, nights }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract constraint information
  const minStay = property.minimum_length_of_stay || 1;
  const maxCapacity = property.maximum_capacity || 10;
  const checkInTime = property.check_in_time || 15;
  const checkOutTime = property.check_out_time || 11;
  
  // Find cleaning fee - match by property ID to get correct fee
  const cleaningFee = property.fees?.find(
    f => f.attributes?.label === 'cleaning_fee' && 
         f.attributes?.enabled && 
         f.id?.startsWith(property.id)
  )?.attributes?.amount || 0;
  
  // Find extra guest fee - match by property ID
  const extraGuestFee = property.fees?.find(
    f => f.attributes?.label === 'extra_guest_charge' && 
         f.attributes?.enabled &&
         f.id?.startsWith(property.id)
  );
  
  // Calculate constraint badges to show (max 3 for clean display)
  const constraintBadges = [];
  
  if (minStay > 1) {
    constraintBadges.push({
      icon: Calendar,
      text: `Min ${minStay} nights`,
      tooltip: `Minimum stay requirement: ${minStay} nights`
    });
  }
  
  constraintBadges.push({
    icon: Users,
    text: `Max ${maxCapacity} guests`,
    tooltip: `Maximum capacity: ${maxCapacity} guests`
  });
  
  if (cleaningFee > 0) {
    constraintBadges.push({
      icon: Sparkles,
      text: `CHF ${cleaningFee} cleaning`,
      tooltip: `One-time cleaning fee: CHF ${cleaningFee}`
    });
  }

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

          {/* Property Image - Optimized with Next.js Image */}
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

        {/* Constraint Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {constraintBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
              title={badge.tooltip}
            >
              <badge.icon className="w-3.5 h-3.5" />
              <span>{badge.text}</span>
            </div>
          ))}
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
        
        {/* Extra Guest Fee Info */}
        {extraGuestFee && (
          <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Extra guest fee: CHF {extraGuestFee.attributes.amount} per guest after {extraGuestFee.attributes.guests_included}
          </p>
        )}
        
        {/* Check-in/Check-out Times */}
        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Check-in: {checkInTime}:00 | Check-out: {checkOutTime}:00
        </p>

        {showFallbackWarning && (
          <p className="text-xs text-yellow-700 mb-2">
            ⚠️ Price subject to confirmation
          </p>
        )}

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
