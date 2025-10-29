'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Home, MapPin, Calendar, Users as UsersIcon, Bed, Bath, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StayPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null,
    checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    infants: parseInt(searchParams.get('infants') || '0'),
    bedrooms: 'any',
    amenities: 'any'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

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

  const totalGuests = filters.adults + filters.children + filters.infants;
  
  const filteredProperties = properties.filter(property => {
    // Filter by guest capacity
    if (totalGuests && property.maximum_capacity < totalGuests) return false;
    
    // Filter by bedrooms
    if (filters.bedrooms !== 'any' && property.bedrooms < parseInt(filters.bedrooms)) return false;
    
    // Filter by location (if Grächen is selected, show all since all properties are in Grächen)
    if (filters.location && !filters.location.toLowerCase().includes('grächen') && 
        !property.address?.city?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    return true;
  });

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
              <Link href="/stay" className="text-black font-medium">Stay</Link>
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

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-light mb-4">Book your Stay</h1>
          <p className="text-gray-600 mb-12">
            Find a home that fits your journey. Our listings are chosen for their comfort, character,
            and proximity to the best of local life – from mountain adventures to peaceful relaxation.
          </p>

          {/* Filters - Fixed z-index */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-12 relative z-50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  >
                    <option value="">All locations</option>
                    <option value="Grächen">Grächen, Wallis</option>
                  </select>
                </div>
              </div>
              
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Dates</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <DatePicker
                    selected={filters.checkIn}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setFilters({...filters, checkIn: start, checkOut: end});
                    }}
                    startDate={filters.checkIn}
                    endDate={filters.checkOut}
                    selectsRange
                    placeholderText="Select dates"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                    dateFormat="MMM dd"
                    minDate={new Date()}
                    popperClassName="z-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Guests</label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white"
                    value={totalGuests}
                    onChange={(e) => setFilters({...filters, adults: parseInt(e.target.value), children: 0, infants: 0})}
                  >
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4">4 guests</option>
                    <option value="5">5+ guests</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                  >
                    <option value="any">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>
              
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
                <div className="relative">
                  <Sliders className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white relative z-50"
                    value={filters.amenities}
                    onChange={(e) => setFilters({...filters, amenities: e.target.value})}
                    style={{ position: 'relative', zIndex: 50 }}
                  >
                    <option value="any">Any</option>
                    <option value="parking">Parking</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="wifi">WiFi</option>
                  </select>
                </div>
              </div>
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
              {filteredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                      <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-sm font-medium z-10">
                        {property.currency} {Math.round(100)}/night
                      </div>
                      <img
                        src={property.photos[0]?.url || '/placeholder.jpg'}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Carousel dots */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {property.photos.slice(0, 5).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-white/70" />
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-2">{property.name}</h3>
                    <p className="text-gray-600 mb-2">
                      {property.address?.city}, {property.address?.state}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {property.description?.substring(0, 100)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" /> Sleeps {property.maximum_capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {property.bathrooms} Bath
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {property.address?.street || 'Central location'}
                    </p>
                    
                    <Button variant="outline" className="w-full rounded-full mt-4">
                      View Details
                    </Button>
                  </div>
                </Link>
              ))}
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