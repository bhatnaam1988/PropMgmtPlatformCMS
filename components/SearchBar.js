'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, MapPin, ChevronDown, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateLocal } from '@/lib/uplisting';

export default function SearchBar({ className = '' }) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0
  });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const locations = ['Grächen, Wallis', 'Verbier', 'Zermatt', 'Saas-Fee'];

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location) params.set('location', location);
    if (startDate) params.set('checkIn', formatDateLocal(startDate));
    if (endDate) params.set('checkOut', formatDateLocal(endDate));
    params.set('adults', guests.adults.toString());
    params.set('children', guests.children.toString());
    params.set('infants', guests.infants.toString());
    
    router.push(`/stay?${params.toString()}`);
  };

  const totalGuests = guests.adults + guests.children + guests.infants;
  const guestsText = `${guests.adults} Adult${guests.adults > 1 ? 's' : ''} - ${guests.children} Children - ${guests.infants} Infant${guests.infants !== 1 ? 's' : ''}`;

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4 py-3 border-r border-gray-200">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full outline-none text-gray-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
              />
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {locations
                    .filter(loc => loc.toLowerCase().includes(location.toLowerCase()))
                    .map((loc) => (
                      <button
                        key={loc}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                      >
                        {loc}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Dates */}
        <div className="flex-1">
          <div className="flex items-center gap-3 px-4 py-3 border-r border-gray-200">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <DatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Arrival Date - Departure..."
              className="w-full outline-none text-gray-700"
              dateFormat="MMM dd"
              minDate={new Date()}
            />
          </div>
        </div>
        
        {/* Guests */}
        <div className="flex-1 relative">
          <button
            className="flex items-center gap-3 px-4 py-3 w-full"
            onClick={() => setShowGuestPicker(!showGuestPicker)}
          >
            <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 truncate">{guestsText}</span>
          </button>
          
          {showGuestPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
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
        
        {/* Search Button */}
        <div className="md:self-center">
          <Button 
            onClick={handleSearch}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 w-full md:w-auto"
          >
            Plan Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}