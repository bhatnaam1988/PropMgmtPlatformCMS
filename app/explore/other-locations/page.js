'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mountain, Snowflake, Utensils, ArrowRight } from 'lucide-react';

export default function OtherLocations() {
  const locations = [
    {
      id: 1,
      slug: 'zermatt',
      name: 'Zermatt',
      region: 'Valais, Switzerland',
      excerpt: 'Home to the iconic Matterhorn, Zermatt offers world-class skiing, upscale dining, and breathtaking Alpine scenery in a car-free environment.',
      image: "https://images.unsplash.com/photo-1700643612355-f6ef344c7b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBtb3VudGFpbiUyMGhpa2luZyUyMHN3aXR6ZXJsYW5kfGVufDF8fHx8MTc1NzgzOTk5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      highlights: [
        'Iconic Matterhorn views',
        'World-class skiing',
        'Upscale dining & shopping',
        'Glacier Paradise'
      ]
    },
    {
      id: 2,
      slug: 'saas-fee',
      name: 'Saas-Fee',
      region: 'Valais, Switzerland',
      excerpt: 'Known as the "Pearl of the Alps," Saas-Fee features glacier skiing, traditional Alpine charm, and stunning 4,000-meter peaks surrounding the village.',
      image: "https://images.unsplash.com/photo-1564358379816-17144a0e4caa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMHRyYXZlbCUyMGJsb2clMjB3cml0aW5nfGVufDF8fHx8MTc1Nzg0MDE0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      highlights: [
        'Glacier skiing',
        'Traditional Alpine village',
        '4,000m peaks',
        'Ice grotto & pavilion'
      ]
    },
    {
      id: 3,
      slug: 'crans-montana',
      name: 'Crans-Montana',
      region: 'Valais, Switzerland',
      excerpt: 'A cosmopolitan resort with stunning views of the Valais Alps, luxury amenities, championship golf courses, and diverse winter sports.',
      image: "https://images.unsplash.com/photo-1628172225866-fbbec7bcbe9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscGluZSUyMGNoYWxldCUyMGludGVyaW9yfGVufDF8fHx8MTc1NzgzOTk4OHww&ixlib=rb-4.1.0&q=80&w=1080",
      highlights: [
        'Cosmopolitan resort',
        'Championship golf',
        'Luxury amenities',
        'Diverse winter sports'
      ]
    },
    {
      id: 4,
      slug: 'verbier',
      name: 'Verbier',
      region: 'Valais, Switzerland',
      excerpt: 'A premier destination for advanced skiers and après-ski enthusiasts, Verbier offers challenging terrain, vibrant nightlife, and stunning Mont Blanc views.',
      image: "https://images.unsplash.com/photo-1578416043044-298e3d1da20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbW91bnRhaW4lMjBjaGFsZXQlMjBmaXJlcGxhY2V8ZW58MXx8fHwxNzU3ODM5OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      highlights: [
        'Expert skiing terrain',
        'Vibrant après-ski',
        'Mont Blanc views',
        '4 Vallées ski area'
      ]
    },
    {
      id: 5,
      slug: 'leukerbad',
      name: 'Leukerbad',
      region: 'Valais, Switzerland',
      excerpt: 'Europe\'s largest thermal spa resort nestled in the Alps, offering thermal baths, wellness treatments, and family-friendly skiing.',
      image: "https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      highlights: [
        'Thermal spa resort',
        'Wellness & relaxation',
        'Family-friendly skiing',
        'Alpine thermal baths'
      ]
    }
  ];

  return (
    <div className="page-no-hero min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Discover Other Locations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            While our properties are based in Grächen, explore other stunning Swiss Alpine destinations 
            in the Valais region. Each offers unique experiences and unforgettable mountain adventures.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Valais
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2">{location.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{location.excerpt}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {location.highlights.slice(0, 4).map((highlight, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      <span className="line-clamp-1">{highlight}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/explore/locations/${location.slug}`}>
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Grächen CTA */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[4/3] lg:aspect-auto relative">
              <img
                src="https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Grächen"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <h2 className="mb-4">Our Home Base: Grächen</h2>
              <p className="text-muted-foreground mb-6">
                All of our properties are located in the charming village of Grächen. 
                Discover why we chose this car-free Alpine gem as the perfect location for your Swiss mountain getaway.
              </p>
              <Button asChild>
                <Link href="/explore/graechen">
                  Explore Grächen
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Activities Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Mountain className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="mb-2">Summer Adventures</h3>
              <p className="text-muted-foreground text-sm">
                Hiking, mountain biking, and exploring Alpine trails with stunning panoramic views
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Snowflake className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="mb-2">Winter Sports</h3>
              <p className="text-muted-foreground text-sm">
                Skiing, snowboarding, and winter hiking across world-class slopes and trails
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Utensils className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="mb-2">Local Cuisine</h3>
              <p className="text-muted-foreground text-sm">
                Traditional Swiss specialties, fine dining, and cozy mountain restaurants
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
