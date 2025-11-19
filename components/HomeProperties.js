'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCardSimple from '@/components/PropertyCardSimple';

export default function HomeProperties({ sectionHeading = 'Our listings', ctaText = 'View All Properties', ctaLink = '/stay' }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="py-20 px-4" aria-labelledby="listings-heading">
      <div className="container mx-auto">
        <h2 id="listings-heading" className="text-3xl font-light mb-12">{sectionHeading}</h2>
        
        {loading ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <span>Loading properties...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.slice(0, 3).map((property) => (
              <PropertyCardSimple key={property.id} property={property} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <Link href={ctaLink}>
              {ctaText} <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
