import { getGraechenSettings } from '@/lib/sanity';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mountain, Snowflake, Sun, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';

export const revalidate = 300;

export default async function Graechen() {
  const settings = await getGraechenSettings();
  
  const fallback = {
    heroSection: {
      location: 'Valais, Switzerland',
      heading: 'Grächen',
      subheading: 'The Sunny Village of the Matter Valley'
    },
    introSection: {
      heading: 'Why We Love Grächen',
      paragraph1: 'Nestled at 1,619 meters in the Matter Valley, Grächen is a charming car-free Alpine village that combines authentic Swiss mountain culture with modern comfort.',
      paragraph2: 'Unlike the more famous resorts, Grächen offers a genuine Alpine experience where locals still outnumber tourists, prices remain reasonable, and the pace of life reflects the peaceful mountain setting.'
    },
    highlightsSection: {
      heading: 'Village Highlights',
      highlights: [
        { icon: 'Mountain', title: 'Car-Free Village', description: 'Enjoy fresh mountain air and peaceful surroundings' },
        { icon: 'Snowflake', title: 'Family-Friendly Skiing', description: 'Excellent slopes for all skill levels' },
        { icon: 'Sun', title: 'Sunny Location', description: 'Known as the "Sunny Village"' },
        { icon: 'Sparkles', title: 'Authentic Alpine Life', description: 'Experience genuine Swiss mountain culture' }
      ]
    },
    activitiesSection: {
      heading: 'Year-Round Activities',
      winterActivities: [
        { title: 'Skiing & Snowboarding', description: '42km of perfectly groomed slopes' },
        { title: 'Winter Hiking', description: '20km of maintained winter trails' },
        { title: 'Sledding', description: 'Family-friendly sledding runs' }
      ],
      summerActivities: [
        { title: 'Mountain Hiking', description: 'Over 200km of marked hiking trails' },
        { title: 'Mountain Biking', description: 'Challenging trails and scenic routes' },
        { title: 'Via Ferrata', description: 'Exciting climbing routes' }
      ]
    },
    practicalInfoSection: {
      heading: 'Practical Information',
      infoBlocks: [
        { title: 'Getting There', items: ['2.5 hours from Zürich', '2 hours from Geneva'] },
        { title: 'Village Amenities', items: ['Supermarket & bakery', 'Sports equipment rentals'] },
        { title: 'Best Times to Visit', items: ['Winter: December - April', 'Summer: June - September'] }
      ]
    },
    mountainViewsSection: {
      heading: 'Stunning Mountain Views',
      paragraph1: 'One of Grächen\'s most spectacular features is the panoramic views of the Matterhorn and surrounding 4,000-meter peaks.',
      paragraph2: 'The village\'s south-facing position means you\'ll enjoy these views bathed in natural light.',
      ctaText: 'Book Your Stay',
      ctaLink: '/stay',
      secondaryCtaText: 'Travel Tips',
      secondaryCtaLink: '/explore/travel-tips'
    },
    cultureSection: {
      heading: 'Authentic Alpine Culture',
      description: 'Grächen has preserved its authentic Alpine character while welcoming visitors.',
      points: [
        { title: 'Local Traditions', description: 'Experience authentic Swiss culture' },
        { title: 'Community Spirit', description: 'A living village where families have resided for generations' }
      ]
    },
    finalCTA: {
      heading: 'Ready to Experience Grächen?',
      description: 'Browse our carefully selected properties and start planning your adventure.',
      buttonText: 'View Available Properties',
      buttonLink: '/stay'
    }
  };
  
  const data = settings || fallback;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px]" aria-labelledby="hero-heading">
        <Image
          src="https://images.unsplash.com/photo-1656746618448-944c18bb4bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHcmFjaGVuJTIwU3dpdHplcmxhbmQlMjB0b3duJTIwYWxwaW5lJTIwdmlsbGFnZXxlbnwxfHx8fDE3NTkxMTk0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Panoramic view of Grächen village"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              <span>{data.heroSection?.location || 'Valais, Switzerland'}</span>
            </div>
            <h1 id="hero-heading" className="text-4xl md:text-5xl mb-4">{data.heroSection?.heading || 'Grächen'}</h1>
            <p className="text-xl md:text-2xl opacity-90">
              {data.heroSection?.subheading || 'The Sunny Village of the Matter Valley'}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-background" aria-labelledby="intro-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="intro-heading" className="mb-6">{data.introSection?.heading}</h2>
            <p className="text-muted-foreground mb-6">{data.introSection?.paragraph1}</p>
            <p className="text-muted-foreground">{data.introSection?.paragraph2}</p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-muted/50" aria-labelledby="highlights-heading">
        <div className="container mx-auto px-4">
          <h2 id="highlights-heading" className="mb-12 text-center">{data.highlightsSection?.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.highlightsSection?.highlights?.map((highlight, index) => {
              const IconComponent = Icons[highlight.icon] || Mountain;
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="mb-3">{highlight.title}</h3>
                    <p className="text-muted-foreground text-sm">{highlight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 bg-background" aria-labelledby="activities-heading">
        <div className="container mx-auto px-4">
          <h2 id="activities-heading" className="mb-12 text-center">{data.activitiesSection?.heading}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Winter Activities */}
            <article>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Snowflake className="h-8 w-8 text-primary" aria-hidden="true" />
                    <h3>Winter Season</h3>
                  </div>
                  <div className="space-y-4">
                    {data.activitiesSection?.winterActivities?.map((activity, index) => (
                      <div key={index}>
                        <h4 className="mb-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Summer Activities */}
            <article>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sun className="h-8 w-8 text-primary" aria-hidden="true" />
                    <h3>Summer Season</h3>
                  </div>
                  <div className="space-y-4">
                    {data.activitiesSection?.summerActivities?.map((activity, index) => (
                      <div key={index}>
                        <h4 className="mb-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </article>
          </div>
        </div>
      </section>

      {/* Practical Information */}
      <section className="py-16 bg-muted/50" aria-labelledby="practical-heading">
        <div className="container mx-auto px-4">
          <h2 id="practical-heading" className="mb-12 text-center">{data.practicalInfoSection?.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.practicalInfoSection?.infoBlocks?.map((info, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-4">{info.title}</h3>
                  <ul className="space-y-2" role="list">
                    {info.items?.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" aria-hidden="true"></div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mountain Views */}
      <section className="py-16 bg-background" aria-labelledby="views-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1700643612355-f6ef344c7b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBtb3VudGFpbiUyMGhpa2luZyUyMHN3aXR6ZXJsYW5kfGVufDF8fHx8MTc1NzgzOTk5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Matterhorn views from Grächen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 id="views-heading" className="mb-6">{data.mountainViewsSection?.heading}</h2>
              <p className="text-muted-foreground mb-4">{data.mountainViewsSection?.paragraph1}</p>
              <p className="text-muted-foreground mb-6">{data.mountainViewsSection?.paragraph2}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  <Link href={data.mountainViewsSection?.ctaLink || '/stay'}>
                    {data.mountainViewsSection?.ctaText || 'Book Your Stay'}
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  <Link href={data.mountainViewsSection?.secondaryCtaLink || '/explore/travel-tips'}>
                    <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                    {data.mountainViewsSection?.secondaryCtaText || 'Travel Tips'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Culture */}
      <section className="py-16 bg-muted/50" aria-labelledby="culture-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 id="culture-heading" className="mb-6 text-center">{data.cultureSection?.heading}</h2>
            <p className="text-muted-foreground text-center mb-8">{data.cultureSection?.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.cultureSection?.points?.map((point, index) => (
                <article key={index} className="bg-background p-6 rounded-lg border border-border">
                  <h3 className="mb-3">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="mb-4">{data.finalCTA?.heading}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{data.finalCTA?.description}</p>
          <Button size="lg" asChild className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <Link href={data.finalCTA?.buttonLink || '/stay'}>
              {data.finalCTA?.buttonText || 'View Properties'}
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
