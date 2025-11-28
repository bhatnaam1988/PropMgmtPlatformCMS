import { getAboutSettingsHybrid } from '@/lib/sanity';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Users, Star } from 'lucide-react';
import * as Icons from 'lucide-react';

export const revalidate = 300; // Revalidate every 5 minutes

export async function generateMetadata() {
  const settings = await getAboutSettingsHybrid();
  
  if (!settings?.seo) {
    return {
      title: 'About Us | Swiss Alpine Journey',
    };
  }
  
  return {
    title: settings.seo.metaTitle || 'About Us | Swiss Alpine Journey',
    description: settings.seo.metaDescription || 'Learn about Swiss Alpine Journey',
    keywords: settings.seo.keywords || [],
  };
}

export default async function About() {
  const settings = await getAboutSettingsHybrid();
  
  // Fallback data if Sanity is unavailable
  const fallback = {
    heroSection: {
      heading: 'Our Story',
      subheading: 'Where authentic stays meet modern comfort and local adventure',
    },
    welcomeStory: {
      heading: 'Welcome to Swiss Alpine Journey',
      paragraphs: [
        "Our story begins in Grächen, where my grandfather built the first family apartments many years ago.",
        "Having spent much of my life in these alps, I continue that tradition today.",
        "For me, hosting is about reliability, thoughtful design, and ease."
      ],
      ctaText: 'Browse Our Properties →',
      ctaLink: '/stay',
    },
    valuesSection: {
      heading: 'Our Values',
      description: 'The principles that guide everything we do',
      values: [
        { icon: 'Heart', title: 'Prime Locations', description: 'Proximity to village centers' },
        { icon: 'Award', title: 'Quality Standards', description: 'Carefully maintained' },
        { icon: 'Users', title: 'Local Expertise', description: 'Personalized recommendations' },
      ],
    },
    statsSection: {
      stats: [
        { number: '100+', label: 'Happy Families Hosted' },
        { number: 'Airbnb Superhost', label: 'Since 2024' },
        { number: '4.9', label: 'Average Rating' },
      ],
    },
    whyChooseSection: {
      heading: 'Why Choose Swiss Alpine Journey?',
      points: [
        { title: 'Strategic Selection', description: 'Prime locations' },
        { title: 'Quality Maintenance', description: 'High standards' },
        { title: 'Always Here for You', description: 'Dedicated support' },
      ],
      links: [
        { text: 'Get in Touch →', url: '/contact' },
        { text: 'Explore Grächen →', url: '/explore/graechen' },
      ],
    },
    finalCTA: {
      heading: 'Ready to Plan Your Journey?',
      description: 'Let us help you discover your perfect Swiss home base.',
      buttonText: 'Plan Your Journey',
      buttonLink: '/stay',
    },
  };
  
  const data = settings || fallback;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Content from Sanity */}
      <section className="relative py-20" aria-labelledby="hero-heading">
        <div className="absolute inset-0">
          <Image
            src={data.heroSection?.backgroundImage?.asset?.url || "https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"}
            alt={data.heroSection?.backgroundImage?.alt || "Scenic Swiss Alps mountain chalet landscape"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 id="hero-heading" className="text-4xl md:text-5xl mb-6">{data.heroSection?.heading}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {data.heroSection?.subheading}
          </p>
        </div>
      </section>

      {/* Welcome Story - Content from Sanity */}
      <section className="py-16" aria-labelledby="story-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="story-heading" className="mb-6">{data.welcomeStory?.heading}</h2>
              <div className="space-y-4 text-muted-foreground">
                {data.welcomeStory?.paragraphs?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              {/* Internal Link - Content from Sanity */}
              <div className="mt-6">
                <Link href={data.welcomeStory?.ctaLink || '/stay'} className="text-black hover:underline font-medium">
                  {data.welcomeStory?.ctaText || 'Browse Our Properties →'}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={data.welcomeStory?.image?.asset?.url || "https://images.unsplash.com/photo-1628172225866-fbbec7bcbe9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscGluZSUyMGNoYWxldCUyMGludGVyaW9yfGVufDF8fHx8MTc1NzgzOTk4OHww&ixlib=rb-4.1.0&q=80&w=1080"}
                alt={data.welcomeStory?.image?.alt || "Cozy Swiss alpine chalet interior"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values - Content from Sanity - Only render if values exist */}
      {data.valuesSection?.values && data.valuesSection.values.length > 0 && (
        <section className="py-16 bg-muted/50" aria-labelledby="values-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="values-heading" className="mb-4">{data.valuesSection?.heading}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {data.valuesSection?.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.valuesSection.values.map((value, index) => {
                const IconComponent = Icons[value.icon] || Icons.Heart;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-3">
                        <IconComponent className="h-8 w-8 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="mb-3">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats - Content from Sanity - Only render if stats exist */}
      {data.statsSection?.stats && data.statsSection.stats.length > 0 && (
        <section className="py-16" aria-labelledby="stats-heading">
          <div className="container mx-auto px-4">
            <h2 id="stats-heading" className="sr-only">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.statsSection.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-medium text-primary mb-2" aria-label={`${stat.number} ${stat.label}`}>
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us - Content from Sanity */}
      <section className="py-16 bg-muted/50" aria-labelledby="why-choose-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={data.whyChooseSection?.image?.asset?.url || "https://images.unsplash.com/photo-1578416043044-298e3d1da20e?w=1080"}
                alt={data.whyChooseSection?.image?.alt || "Cozy mountain chalet interior"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 id="why-choose-heading" className="mb-6">{data.whyChooseSection?.heading}</h2>
              <div className="space-y-6">
                {data.whyChooseSection?.points?.map((point, index) => (
                  <article key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Star className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="mb-2">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              {/* Internal Links - Content from Sanity */}
              <div className="mt-8 space-y-2">
                {data.whyChooseSection?.links?.map((link, index) => (
                  <Link key={index} href={link.url} className="block text-black hover:underline font-medium">
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Content from Sanity */}
      <section className="py-16" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="mb-4">{data.finalCTA?.heading}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {data.finalCTA?.description}
          </p>
          <Button size="lg" asChild className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <Link href={data.finalCTA?.buttonLink || '/stay'}>{data.finalCTA?.buttonText || 'Plan Your Journey'}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}