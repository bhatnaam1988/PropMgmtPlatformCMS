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
      <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? "" : val)}>
          <SelectTrigger className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg bg-white">
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
      <label className="text-sm font-medium text-gray-700 mb-2 block">Dates</label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <DatePicker
          selected={checkIn}
          onChange={onChange}
          startDate={checkIn}
          endDate={checkOut}
          selectsRange
          placeholderText="Select dates"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 focus:border-black focus:outline-none transition-colors"
          dateFormat="MMM dd"
          minDate={new Date()}
          popperClassName="react-datepicker-popper"
          popperPlacement="bottom-start"
          wrapperClassName="w-full"
        />
      </div>
    </div>
  );
}

// Guests Dropdown
export function GuestsSelect({ value, onChange }) {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-2 block">Guests</label>
      <div className="relative">
        <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <Select value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
          <SelectTrigger className="w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-lg bg-white">
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
      <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
      <div className="relative">
        <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white">
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
export function AmenitiesMultiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  
  const amenitiesOptions = [
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
      <label className="text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full pl-10 pr-4 py-3 h-auto border border-gray-200 rounded-lg bg-white justify-start font-normal hover:bg-white hover:border-gray-300"
          >
            <Sliders className="absolute left-3 w-5 h-5 text-gray-400" />
            <span className={cn(
              value.length === 0 ? 'text-gray-500' : 'text-gray-900'
            )}>
              {displayValue()}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-3 z-[9999]" align="start">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Select Amenities</p>
              {value.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs"
                  onClick={() => onChange([])}
                >
                  Clear all
                </Button>
              )}
            </div>
            {amenitiesOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                onClick={() => toggleAmenity(option.value)}
              >
                <Checkbox
                  id={option.value}
                  checked={value.includes(option.value)}
                  onCheckedChange={() => toggleAmenity(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                </label>
                {value.includes(option.value) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
