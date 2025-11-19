import { getOtherLocationsSettings } from '@/lib/sanity';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mountain, Snowflake, Utensils, ArrowRight } from 'lucide-react';

export const revalidate = 300;

export default async function OtherLocations() {
  const settings = await getOtherLocationsSettings();
  
  const fallback = {
    pageHeader: {
      heading: 'Discover Other Locations',
      description: 'While our properties are based in Grächen, explore other stunning Swiss Alpine destinations in the Valais region.'
    },
    locationsSection: {
      heading: 'Featured Locations',
      locations: [
        {
          slug: 'zermatt',
          name: 'Zermatt',
          region: 'Valais, Switzerland',
          excerpt: 'Home to the iconic Matterhorn with world-class skiing.',
          highlights: ['Matterhorn views', 'World-class skiing']
        }
      ]
    },
    graechenCTA: {
      heading: 'Our Home Base: Grächen',
      description: 'All of our properties are located in the charming village of Grächen.',
      buttonText: 'Explore Grächen',
      buttonLink: '/explore/graechen'
    },
    activitiesOverview: {
      activities: [
        { icon: 'Mountain', title: 'Summer Adventures', description: 'Hiking and mountain biking' },
        { icon: 'Snowflake', title: 'Winter Sports', description: 'Skiing and snowboarding' },
        { icon: 'Utensils', title: 'Local Cuisine', description: 'Swiss specialties' }
      ]
    }
  };
  
  const data = settings || fallback;

  return (
    <div className="page-no-hero min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">{data.pageHeader?.heading}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{data.pageHeader?.description}</p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {data.locationsSection?.locations?.map((location, index) => (
            <Card key={location.slug || index} className="overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1700643612355-f6ef344c7b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBtb3VudGFpbiUyMGhpa2luZyUyMHN3aXR6ZXJsYW5kfGVufDF8fHx8MTc1NzgzOTk5MHww&ixlib=rb-4.1.0&q=80&w=1080"
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
                  {location.highlights?.slice(0, 4).map((highlight, hIndex) => (
                    <div key={hIndex} className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
              <h2 className="mb-4">{data.graechenCTA?.heading}</h2>
              <p className="text-muted-foreground mb-6">{data.graechenCTA?.description}</p>
              <Button asChild>
                <Link href={data.graechenCTA?.buttonLink || '/explore/graechen'}>
                  {data.graechenCTA?.buttonText || 'Explore Grächen'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Activities Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.activitiesOverview?.activities?.map((activity, index) => {
            const Icon = index === 0 ? Mountain : index === 1 ? Snowflake : Utensils;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="mb-2">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm">{activity.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
