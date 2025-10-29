'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  Home, ChevronLeft, MapPin, Users, Bed, Bath, Star, 
  Wifi, PawPrint, Tv, Coffee, Wind, CheckCircle, Calendar,
  Minus, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingData, setPricingData] = useState(null);
  
  // Booking widget state
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  // Fetch pricing when dates change
  useEffect(() => {
    if (checkIn && checkOut && property) {
      fetchPricing();
    }
  }, [checkIn, checkOut, property]);

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
      const from = checkIn.toISOString().split('T')[0];
      const to = checkOut.toISOString().split('T')[0];
      
      const res = await fetch(`/api/availability/${params.id}?from=${from}&to=${to}`);
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

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    // Navigate to checkout with booking details
    const params = new URLSearchParams({
      propertyId: property.id,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
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
  
  // Get cleaning fee from property fees (fallback to 50 if not in API)
  const cleaningFee = property?.fees?.find(f => 
    f.attributes?.name?.toLowerCase().includes('cleaning')
  )?.attributes?.amount || 50;
  
  // Get tax rate from property taxes
  const taxRate = property?.taxes?.reduce((sum, tax) => 
    sum + (parseFloat(tax.attributes?.percentage) || 0), 0
  ) || 0;
  
  const subtotal = totalAccommodation + cleaningFee;
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const totalPrice = subtotal + taxAmount;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-light">Swiss Alpine Journey</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/stay" className="text-gray-700 hover:text-black">Stay</Link>
              <Link href="/explore" className="text-gray-700 hover:text-black">Explore</Link>
              <Link href="/services" className="text-gray-700 hover:text-black">Services</Link>
              <Link href="/about" className="text-gray-700 hover:text-black">About</Link>
            </nav>
            
            <Link href="/stay">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                Plan Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/stay" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to listings
          </Link>

          {/* Image Gallery */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="col-span-4 md:col-span-3">
              <img
                src={property.photos[selectedImage]?.url || '/placeholder.jpg'}
                alt={property.name}
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </div>
            <div className="col-span-4 md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4">
              {property.photos.slice(0, 4).map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`${property.name} ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-black' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
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
                    4.9
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
              <div className="sticky top-28 border border-gray-200 rounded-2xl p-6 shadow-lg">
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
                          <span className="text-3xl font-medium">{currency} {basePrice}</span>
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
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                    <DatePicker
                      selected={checkIn}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        setCheckIn(start);
                        setCheckOut(end);
                      }}
                      startDate={checkIn}
                      endDate={checkOut}
                      selectsRange
                      placeholderText="Select dates"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                      dateFormat="MMM dd"
                      minDate={new Date()}
                      popperClassName="z-[9999]"
                    />
                  </div>
                </div>

                {/* Guest Selection */}
                <div className="mb-6 relative">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Guests</label>
                  <button
                    onClick={() => setShowGuestPicker(!showGuestPicker)}
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
                          onClick={() => setShowGuestPicker(false)}
                          className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
                        >
                          Save
                        </Button>
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
                    <div className="flex justify-between">
                      <span className="text-gray-700">{currency} {basePrice} x {nights} night{nights > 1 ? 's' : ''}</span>
                      <span className="font-medium">{currency} {Math.round(totalAccommodation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Cleaning fee</span>
                      <span className="font-medium">{currency} {cleaningFee}</span>
                    </div>
                    {taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Taxes ({taxRate}%)</span>
                        <span className="font-medium">{currency} {taxAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">{currency} {totalPrice}</span>
                    </div>
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

      {/* Footer */}
      <footer className="bg-gray-100 py-16 mt-20">
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
