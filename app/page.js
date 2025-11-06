'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, Home, Users as UsersIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/SearchBar';
import PropertyCardSimple from '@/components/PropertyCardSimple';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwwfHx8fDE3NjE2NjA4MTR8MA&ixlib=rb-4.1.0&q=85"
            alt="Swiss Alpine Village"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
            Swiss Alpine Journey
          </h1>
          <p className="text-xl text-white/90 mb-12">
            Where authentic stays meet modern comfort and local adventure
          </p>
          
          {/* Search Bar Component */}
          <SearchBar className="max-w-4xl w-full" />
        </div>
      </section>

      {/* Our Listings Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-light mb-12">Our listings</h2>
          
          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((property) => (
                <PropertyCardSimple key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Home Base Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1629114472586-19096663e723?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwwfHx8fDE3NjE2NjA4MTR8MA&ixlib=rb-4.1.0&q=85"
                alt="Grächen"
                className="rounded-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-light mb-6">Our Home Base: Grächen</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                All of our properties are located in the charming village of Grächen. Discover
                why we chose this car-free Alpine gem as the perfect location for your Swiss
                mountain getaway.
              </p>
              <Link href="/explore/graechen">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                  Explore Grächen <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 18l6-6 4 4 8-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Summer Adventures</h3>
              <p className="text-gray-600">
                Hiking, mountain biking, and exploring Alpine trails with stunning panoramic views
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium mb-4">Winter Sports</h3>
              <p className="text-gray-600">
                Skiing, snowboarding, and winter hiking across world-class slopes and trails
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Local Cuisine</h3>
              <p className="text-gray-600">
                Traditional Swiss specialties, fine dining, and cozy mountain restaurants
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Stay Connected</h2>
          <p className="text-gray-600 mb-8">
            Join our community and be the first to discover new listings and special offers
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full"
            />
            <Button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
              Join Us
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
}