'use client';

import { useState } from 'react';
import { MapPin, Calendar, Users as UsersIcon, Bed, Sliders, Check } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Location Dropdown
export function LocationSelect({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="location-select" className="text-sm font-medium text-gray-700 mb-2 block">
        Location
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none z-10" aria-hidden="true" />
        <Select 
          value={value || "all"} 
          onValueChange={(val) => onChange(val === "all" ? "" : val)}
          aria-label="Filter by location"
        >
          <SelectTrigger id="location-select" className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg bg-white">
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="all">All locations</SelectItem>
            <SelectItem value="Grächen">Grächen, Wallis</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Date Picker (keeping react-datepicker as it works well)
export function DateRangePicker({ checkIn, checkOut, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="date-picker" className="text-sm font-medium text-gray-700 mb-2 block">
        Dates
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none z-10" aria-hidden="true" />
        <DatePicker
          id="date-picker"
          selected={checkIn}
          onChange={onChange}
          startDate={checkIn}
          endDate={checkOut}
          selectsRange
          placeholderText="Select dates"
          className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 focus:border-black focus:outline-none transition-colors"
          dateFormat="MMM dd"
          minDate={new Date()}
          popperClassName="react-datepicker-popper"
          popperPlacement="bottom-start"
          wrapperClassName="w-full"
          aria-label="Select check-in and check-out dates"
        />
      </div>
    </div>
  );
}

// Guests Dropdown
export function GuestsSelect({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="guests-select" className="text-sm font-medium text-gray-700 mb-2 block">
        Guests
      </label>
      <div className="relative">
        <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none z-10" aria-hidden="true" />
        <Select 
          value={value.toString()} 
          onValueChange={(val) => onChange(parseInt(val))}
          aria-label="Filter by number of guests"
        >
          <SelectTrigger id="guests-select" className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg bg-white">
            <SelectValue placeholder="Select guests" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="1">1 guest</SelectItem>
            <SelectItem value="2">2 guests</SelectItem>
            <SelectItem value="3">3 guests</SelectItem>
            <SelectItem value="4">4 guests</SelectItem>
            <SelectItem value="5">5+ guests</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Bedrooms Dropdown
export function BedroomsSelect({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="bedrooms-select" className="text-sm font-medium text-gray-700 mb-2 block">
        Bedrooms
      </label>
      <div className="relative">
        <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none z-10" aria-hidden="true" />
        <Select 
          value={value} 
          onValueChange={onChange}
          aria-label="Filter by number of bedrooms"
        >
          <SelectTrigger id="bedrooms-select" className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg bg-white">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Multi-select Amenities
export function AmenitiesMultiSelect({ value, onChange, availableAmenities = [] }) {
  const [open, setOpen] = useState(false);
  
  // Create unique amenities list and remove duplicates
  const uniqueAmenitiesMap = new Map();
  
  if (availableAmenities.length > 0) {
    availableAmenities.forEach(amenity => {
      const valueKey = amenity.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
      // Only add if not already in map (prevents duplicates)
      if (!uniqueAmenitiesMap.has(valueKey)) {
        uniqueAmenitiesMap.set(valueKey, amenity);
      }
    });
  }
  
  // Convert map to sorted array of options
  const amenitiesOptions = uniqueAmenitiesMap.size > 0
    ? Array.from(uniqueAmenitiesMap.entries())
        .map(([valueKey, label]) => ({ value: valueKey, label }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [
        { value: 'parking', label: 'Parking' },
        { value: 'kitchen', label: 'Kitchen' },
        { value: 'wifi', label: 'WiFi' },
        { value: 'balcony', label: 'Balcony' },
        { value: 'washer', label: 'Washer' },
      ];

  const toggleAmenity = (amenity) => {
    const newValue = value.includes(amenity)
      ? value.filter(v => v !== amenity)
      : [...value, amenity];
    onChange(newValue);
  };

  const displayValue = () => {
    if (value.length === 0) return 'Any';
    if (value.length === 1) {
      const selected = amenitiesOptions.find(opt => opt.value === value[0]);
      return selected ? selected.label : 'Any';
    }
    return `${value.length} selected`;
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Amenities
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Filter by amenities"
            aria-haspopup="listbox"
            className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg bg-white justify-start font-normal hover:bg-white hover:border-gray-300"
          >
            <Sliders className="absolute left-3 w-5 h-5 text-gray-400" aria-hidden="true" />
            <span className={cn(
              value.length === 0 ? 'text-gray-500' : 'text-gray-900'
            )}>
              {displayValue()}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-3 z-[9999]" align="start" role="listbox">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Select Amenities</p>
              {value.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs"
                  onClick={() => onChange([])}
                  aria-label="Clear all amenity filters"
                >
                  Clear all
                </Button>
              )}
            </div>
            {/* Scrollable container with max height - shows ~8 items initially */}
            <div 
              className="max-h-[320px] overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollable-region"
              role="list"
              tabIndex={0}
              aria-label="Amenities list"
            >
              {amenitiesOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  onClick={() => toggleAmenity(option.value)}
                  role="listitem"
                >
                  <Checkbox
                    id={option.value}
                    checked={value.includes(option.value)}
                    onCheckedChange={() => toggleAmenity(option.value)}
                    aria-label={`Filter by ${option.label}`}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {option.label}
                  </label>
                  {value.includes(option.value) && (
                    <Check className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}