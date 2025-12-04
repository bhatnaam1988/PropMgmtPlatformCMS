'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  Home, ChevronLeft, MapPin, Users, Bed, Bath, Star, 
  Wifi, PawPrint, Tv, Coffee, Wind, CheckCircle, Calendar,
  Minus, Plus, AlertCircle, Info, Clock, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateLocal } from '@/lib/uplisting';
import { validateBooking, getPropertyConstraints } from '@/lib/booking-validation';
import { MultipleStructuredData } from '@/components/StructuredData';
import { getPropertySchema, getVacationRentalSchema, getBreadcrumbSchema } from '@/lib/schemas';
import { optimizeUplistingImage, IMAGE_SIZES, getImageSizes } from '@/lib/image-optimizer';
import { formatCurrency, formatPerNightRate } from '@/lib/currency-formatter';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingWidgetRef = useRef(null);
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingData, setPricingData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);
  
  // Availability calendar state
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [calendarDataFetched, setCalendarDataFetched] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [minimumStay, setMinimumStay] = useState(1);
  const [minCheckOutDate, setMinCheckOutDate] = useState(null);
  
  // Initialize booking widget state from URL params if available
  const [checkIn, setCheckIn] = useState(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null
  );
  const [guests, setGuests] = useState({ 
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    infants: parseInt(searchParams.get('infants') || '0')
  });
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guestValidationError, setGuestValidationError] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  // Fetch pricing when dates change
  useEffect(() => {
    if (checkIn && checkOut && property) {
      fetchPricing();
    }
  }, [checkIn, checkOut, property]);

  // Close guest picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bookingWidgetRef.current && !bookingWidgetRef.current.contains(event.target)) {
        setShowGuestPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function fetchProperty() {
    try {
      const res = await fetch(`/api/properties/${params.id}`);
      const data = await res.json();
      setProperty(data.property);
      
      if (data.property?.photos?.length > 0) {
        setSelectedImage(0);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPricing() {
    if (!checkIn || !checkOut) return;
    
    setPricingLoading(true);
    try {
      const from = formatDateLocal(checkIn);
      const to = formatDateLocal(checkOut);
      
      // Use forBooking=true to get accurate accommodation total with Uplisting's date logic
      const res = await fetch(`/api/availability/${params.id}?from=${from}&to=${to}&forBooking=true`);
      const data = await res.json();
      
      setPricingData(data.pricing);
      
      if (!data.pricing.available) {
        alert('Some dates in your selection are not available. Please choose different dates.');
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setPricingLoading(false);
    }
  }

  async function fetchCalendarAvailability() {
    if (calendarDataFetched) return; // Only fetch once
    
    setLoadingAvailability(true);
    setAvailabilityError(null);
    
    try {
      // Calculate 6 months from today
      const today = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(today.getMonth() + 6);
      
      const from = formatDateLocal(today);
      const to = formatDateLocal(sixMonthsLater);
      
      const res = await fetch(`/api/availability/${params.id}?from=${from}&to=${to}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch availability data');
      }
      
      const data = await res.json();
      setAvailabilityData(data);
      
      // Parse calendar data into map for quick lookup
      if (data.calendar?.calendar?.days) {
        const calendarMap = {};
        const unavailable = [];
        
        data.calendar.calendar.days.forEach(day => {
          const dateStr = day.date;
          calendarMap[dateStr] = {
            available: day.available,
            minStay: day.minimum_length_of_stay || 1,
            maxStay: day.maximum_available_nights,
            dayRate: day.day_rate,
            closedForArrival: day.closed_for_arrival || false,
            closedForDeparture: day.closed_for_departure || false
          };
          
          // Build unavailable dates array for strikethrough
          if (!day.available) {
            unavailable.push(new Date(day.date));
          }
        });
        
        setAvailabilityMap(calendarMap);
        setUnavailableDates(unavailable);
      }
      
      setCalendarDataFetched(true);
    } catch (error) {
      console.error('Error fetching calendar availability:', error);
      setAvailabilityError('Unable to load availability calendar. Please refresh the page or contact support if the problem persists.');
    } finally {
      setLoadingAvailability(false);
    }
  }

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    // Clear previous validation messages
    setValidationErrors([]);
    setValidationWarnings([]);
    
    // Validate booking against property constraints
    const validation = validateBooking({
      property,
      checkIn: formatDateLocal(checkIn),
      checkOut: formatDateLocal(checkOut),
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
      availabilityData: pricingData
    });
    
    // If there are errors, show them and don't proceed
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // If there are only warnings (no errors), set them but continue
    if (validation.warnings.length > 0) {
      setValidationWarnings(validation.warnings);
    }
    
    // Navigate to checkout with booking details
    const params = new URLSearchParams({
      propertyId: property.id,
      checkIn: formatDateLocal(checkIn),
      checkOut: formatDateLocal(checkOut),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
      infants: guests.infants.toString()
    });
    
    router.push(`/checkout?${params.toString()}`);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalGuests = guests.adults + guests.children + guests.infants;
  const nights = calculateNights();
  
  // ALWAYS use pricing from Uplisting API - no fallbacks
  const basePrice = pricingData?.averageRate || 0;
  const totalAccommodation = pricingData?.total || 0;
  
  const currency = pricingData?.currency || property?.currency || 'CHF';
  
  // Check if we have pricing data from API
  const hasPricingData = pricingData && !pricingData.noCalendarData && pricingData.totalNights > 0;
  const showUnavailableWarning = pricingData && !pricingData.available && hasPricingData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading property...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Property not found</h1>
          <Link href="/stay">
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data schemas for this property
  const propertySchemas = property ? [
    getPropertySchema(property),
    getVacationRentalSchema(property),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Stay', url: '/stay' },
      { name: property.title || property.name, url: `/property/${property.id}` },
    ]),
  ].filter(Boolean) : [];

  return (
    <>
      {property && <MultipleStructuredData schemas={propertySchemas} />}
      <div className="min-h-screen bg-white">
        <div className="pt-0">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/stay" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to listings
          </Link>

          {/* Image Gallery - Airbnb Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 h-[500px]">
            {/* Main large image on the left */}
            <div className="relative h-full rounded-l-xl overflow-hidden cursor-pointer">
              <Image
                src={optimizeUplistingImage(
                  property.photos[selectedImage]?.url || '/placeholder.jpg',
                  IMAGE_SIZES.DETAIL_HERO
                )}
                alt={`${property.name} - Main photo`}
                fill
                className="object-cover"
                sizes={getImageSizes('detail')}
                priority
                quality={80}
                onClick={() => setSelectedImage(selectedImage)}
              />
            </div>
            
            {/* Thumbnail grid on the right - 2x2 grid with scroll */}
            <div className="grid grid-cols-2 gap-2 h-full overflow-y-auto rounded-r-xl">
              {property.photos.slice(0, 20).map((photo, index) => (
                <div key={index} className="relative h-[245px] overflow-hidden">
                  <Image
                    src={optimizeUplistingImage(photo.url, IMAGE_SIZES.THUMBNAIL)}
                    alt={`${property.name} - Photo ${index + 1}`}
                    fill
                    className={`object-cover cursor-pointer hover:brightness-90 transition ${
                      selectedImage === index ? 'ring-4 ring-black' : ''
                    }`}
                    sizes={getImageSizes('thumbnail')}
                    quality={75}
                    onClick={() => setSelectedImage(index)}
                  />
                  {/* Show +X photos overlay on last thumbnail if there are more */}
                  {index === 19 && property.photos.length > 20 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium cursor-pointer">
                      +{property.photos.length - 20} photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl font-light mb-2">{property.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.address?.city}, {property.address?.state}
                  </span>
                  <span className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    4.9 by verified Airbnb guests
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-gray-700 mb-6">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Sleeps {property.maximum_capacity}
                  </span>
                  <span className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    {property.beds} Bed{property.beds > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    {property.bathrooms} Bath
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-light mb-4">About this space</h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || property.name}
                </p>
              </div>

              {/* Sleeping Arrangements */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-light mb-4">Where you'll sleep</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({ length: property.bedrooms }).map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-2xl p-6">
                      <Bed className="w-8 h-8 mb-3" />
                      <h3 className="font-medium mb-1">Bedroom {i + 1}</h3>
                      <p className="text-gray-600 text-sm">
                        {i === 0 ? '1 queen bed' : '1 double bed'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-light mb-4">What this place offers</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {property.amenities?.slice(0, 10).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5" />
                        <span>WiFi</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tv className="w-5 h-5" />
                        <span>TV</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Coffee className="w-5 h-5" />
                        <span>Kitchen</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Wind className="w-5 h-5" />
                        <span>Heating</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div ref={bookingWidgetRef} className="sticky top-28 border border-gray-200 rounded-2xl p-6 shadow-lg">
                
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 mb-2">Cannot proceed with booking:</p>
                        <ul className="space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="text-sm text-red-700">• {error.message}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Warnings */}
                {validationWarnings.length > 0 && validationErrors.length === 0 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {validationWarnings.map((warning, index) => (
                          <p key={index} className="text-sm text-yellow-700">{warning.message}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {pricingLoading ? (
                      <span className="text-xl text-gray-500">Loading pricing...</span>
                    ) : pricingData?.noCalendarData ? (
                      <div className="text-center w-full">
                        <span className="text-red-600 text-sm">Unable to fetch pricing from Uplisting</span>
                        <p className="text-xs text-gray-500 mt-1">Please refresh or contact administrator</p>
                      </div>
                    ) : basePrice > 0 ? (
                      <div className="w-full">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-medium">{currency} {formatPerNightRate(basePrice)}</span>
                          <span className="text-gray-600">/ night</span>
                        </div>
                        {pricingData?.useFallback && (
                          <p className="text-xs text-yellow-700 mt-2">
                            ⚠️ Price subject to confirmation
                          </p>
                        )}
                      </div>
                    ) : checkIn && checkOut ? (
                      <div className="text-center w-full">
                        <span className="text-red-600 text-sm">No rates available for selected dates</span>
                        <p className="text-xs text-gray-500 mt-1">Please try different dates</p>
                      </div>
                    ) : (
                      <>
                        <span className="text-xl text-gray-500">Select dates</span>
                        <span className="text-gray-500 text-sm">to see pricing</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Check-in / Check-out</label>
                  
                  {availabilityError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Availability Error</p>
                          <p className="mt-1">{availabilityError}</p>
                          <p className="mt-2 text-xs">
                            Contact: <a href="mailto:admin@example.com" className="underline">admin@example.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                    <DatePicker
                      selected={checkIn}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        
                        // When check-in is selected (start exists but end doesn't yet)
                        if (start && !end && start !== checkIn) {
                          const dateStr = formatDateLocal(start);
                          const dayData = availabilityMap[dateStr];
                          const minStay = dayData?.minStay || 1;
                          
                          // Calculate minimum check-out date
                          const minCheckOut = new Date(start);
                          minCheckOut.setDate(minCheckOut.getDate() + minStay);
                          
                          setMinimumStay(minStay);
                          setMinCheckOutDate(minCheckOut);
                        }
                        
                        setCheckIn(start);
                        setCheckOut(end);
                        
                        // Reset minimum stay when both dates are cleared
                        if (!start && !end) {
                          setMinimumStay(1);
                          setMinCheckOutDate(null);
                        }
                      }}
                      startDate={checkIn}
                      endDate={checkOut}
                      selectsRange
                      placeholderText={loadingAvailability ? "Loading calendar..." : "Select dates"}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                      dateFormat="MMM dd"
                      minDate={new Date()}
                      excludeDates={unavailableDates}
                      filterDate={(date) => {
                        // Always exclude unavailable dates
                        const isUnavailable = unavailableDates.some(
                          unavailableDate => 
                            unavailableDate.getDate() === date.getDate() &&
                            unavailableDate.getMonth() === date.getMonth() &&
                            unavailableDate.getFullYear() === date.getFullYear()
                        );
                        if (isUnavailable) return false;
                        
                        // If check-in is selected, apply minimum stay rule for check-out
                        if (checkIn && !checkOut && minCheckOutDate) {
                          // Disable dates before minimum check-out date
                          if (date < minCheckOutDate) return false;
                          
                          // Check if date is closed for departure
                          const dateStr = formatDateLocal(date);
                          const dayData = availabilityMap[dateStr];
                          if (dayData?.closedForDeparture) return false;
                        }
                        
                        // If selecting check-in, check if closed for arrival
                        if (!checkIn) {
                          const dateStr = formatDateLocal(date);
                          const dayData = availabilityMap[dateStr];
                          if (dayData?.closedForArrival) return false;
                        }
                        
                        return true;
                      }}
                      onCalendarOpen={fetchCalendarAvailability}
                      disabled={loadingAvailability}
                      dayClassName={(date) => {
                        const isUnavailable = unavailableDates.some(
                          unavailableDate => 
                            unavailableDate.getDate() === date.getDate() &&
                            unavailableDate.getMonth() === date.getMonth() &&
                            unavailableDate.getFullYear() === date.getFullYear()
                        );
                        
                        if (isUnavailable) return 'unavailable-date';
                        
                        // Mark dates below minimum stay when check-in is selected
                        if (checkIn && !checkOut && minCheckOutDate && date < minCheckOutDate) {
                          return 'below-minimum-stay';
                        }
                        
                        return undefined;
                      }}
                      popperClassName="z-[9999]"
                    />
                  </div>
                  
                  {/* Minimum Stay Info */}
                  {checkIn && !checkOut && minimumStay > 1 && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Minimum stay: {minimumStay} night{minimumStay > 1 ? 's' : ''} from this check-in date</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Selection */}
                <div className="mb-6 relative">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Guests</label>
                  <button
                    onClick={() => {
                      setShowGuestPicker(!showGuestPicker);
                      // Clear error when opening picker
                      if (!showGuestPicker) {
                        setGuestValidationError(null);
                      }
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-left"
                  >
                    <span>{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</span>
                    <Users className="w-5 h-5 text-gray-400" />
                  </button>

                  {showGuestPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Adults</div>
                            <div className="text-sm text-gray-500">Age 13+</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setGuests({...guests, adults: Math.max(1, guests.adults - 1)})}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{guests.adults}</span>
                            <button
                              onClick={() => setGuests({...guests, adults: guests.adults + 1})}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Children</div>
                            <div className="text-sm text-gray-500">Ages 2-12</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setGuests({...guests, children: Math.max(0, guests.children - 1)})}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{guests.children}</span>
                            <button
                              onClick={() => setGuests({...guests, children: guests.children + 1})}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Infants</div>
                            <div className="text-sm text-gray-500">Under 2</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setGuests({...guests, infants: Math.max(0, guests.infants - 1)})}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{guests.infants}</span>
                            <button
                              onClick={() => setGuests({...guests, infants: guests.infants + 1})}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            const totalGuests = guests.adults + guests.children + guests.infants;
                            const maxCapacity = property?.maximum_capacity || 0;
                            
                            // Validate guest count
                            if (totalGuests > maxCapacity) {
                              setGuestValidationError(`This property can accommodate a maximum of ${maxCapacity} guests. You have selected ${totalGuests} guests.`);
                            } else {
                              setGuestValidationError(null);
                              setShowGuestPicker(false);
                            }
                          }}
                          className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Guest Validation Error */}
                  {guestValidationError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{guestValidationError}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || pricingLoading || !hasPricingData || (showUnavailableWarning)}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {pricingLoading ? 'Checking availability...' : showUnavailableWarning ? 'Dates Not Available' : 'Reserve'}
                </Button>

                <p className="text-center text-sm text-gray-600 mb-4">
                  You won't be charged yet
                </p>

                {hasPricingData && nights > 0 && basePrice > 0 && (
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    {/* Daily Rate Breakdown */}
                    {pricingData?.calendar?.days && pricingData.calendar.days.length > 0 && pricingData.calendar.days.length <= 14 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Rate Breakdown</h4>
                        <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
                          {pricingData.calendar.days.map((day, index) => {
                            const dayRate = parseFloat(day.day_rate || day.rate || 0);
                            const dayDate = new Date(day.date);
                            const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
                            const dayMonth = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
                            return (
                              <div key={index} className="flex justify-between items-center py-1">
                                <span className="text-gray-600">
                                  {dayName}, {dayMonth}
                                  {!day.available && <span className="text-red-600 ml-1">(unavailable)</span>}
                                </span>
                                <span className={`font-medium ${!day.available ? 'text-gray-400' : 'text-gray-700'}`}>
                                  {currency} {Math.round(dayRate)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2"></div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {currency} {formatCurrency(basePrice)} x {pricingData.totalNights} night{pricingData.totalNights > 1 ? 's' : ''}
                        {pricingData.totalNights !== nights && (
                          <span className="text-xs text-yellow-700 ml-1">({nights} nights selected)</span>
                        )}
                      </span>
                      <span className="font-medium">{currency} {formatCurrency(totalAccommodation)}</span>
                    </div>
                    {pricingData.totalNights !== nights && (
                      <p className="text-xs text-yellow-700">
                        ⚠️ Rate data only available for {pricingData.totalNights} of {nights} nights
                      </p>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">{currency} {formatCurrency(totalAccommodation)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Service fees and taxes will be added at checkout
                    </p>
                  </div>
                )}

                {/* Property Constraints Info */}
                {property && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Booking Requirements
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      {pricingData?.calendar?.days?.[0]?.minimum_length_of_stay > 1 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Minimum stay: {pricingData.calendar.days[0].minimum_length_of_stay} nights</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Maximum guests: {property.maximum_capacity || 10}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Check-in: {property.check_in_time || 15}:00 | Check-out: {property.check_out_time || 11}:00</span>
                      </div>
                      
                      {property.fees?.find(f => f.attributes?.label === 'extra_guest_charge' && f.attributes?.enabled) && (
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5" />
                          <span>
                            Extra guest fee: CHF {formatCurrency(property.fees.find(f => f.attributes?.label === 'extra_guest_charge').attributes.amount)} 
                            {' '}per guest beyond {property.fees.find(f => f.attributes?.label === 'extra_guest_charge').attributes.guests_included}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fees & Taxes */}
                {property && (property.fees?.length > 0 || property.taxes?.length > 0) && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Fees & Taxes
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      {/* Cleaning Fee */}
                      {property.fees?.find(f => f.attributes?.label === 'cleaning_fee' && f.attributes?.enabled) && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium">Cleaning Fee:</span>
                          <span>CHF {formatCurrency(property.fees.find(f => f.attributes?.label === 'cleaning_fee').attributes.amount)}</span>
                        </div>
                      )}
                      
                      {/* VAT */}
                      {property.taxes?.find(t => t.attributes?.label === 'per_booking_percentage' && t.attributes?.amount > 0) && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium">VAT:</span>
                          <span>{property.taxes.find(t => t.attributes?.label === 'per_booking_percentage').attributes.amount}%</span>
                        </div>
                      )}
                      
                      {/* Tourist Tax */}
                      {property.taxes?.find(t => t.attributes?.label === 'per_person_per_night' && t.attributes?.amount > 0) && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium">Tourist Tax:</span>
                          <span>CHF {formatCurrency(property.taxes.find(t => t.attributes?.label === 'per_person_per_night').attributes.amount)} per guest per night</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      All fees and taxes will be calculated at checkout.
                    </p>
                  </div>
                )}

                {showUnavailableWarning && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Selected dates are not available for booking
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Please select different dates to proceed with your reservation.
                    </p>
                  </div>
                )}

                {pricingData?.noCalendarData && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      ❌ Unable to load pricing
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Please refresh the page or contact administrator if the issue persists.
                    </p>
                  </div>
                )}

                {!showUnavailableWarning && !pricingData?.noCalendarData && hasPricingData && (
                  <p className="text-sm text-gray-600 mt-4">
                    <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                    Free cancellation within 48 hours
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
