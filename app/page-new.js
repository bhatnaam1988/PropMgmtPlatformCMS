import { getHomeSettings } from '@/lib/sanity';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import HomeProperties from '@/components/HomeProperties';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

export const revalidate = 300;

export default async function HomePage() {
  const settings = await getHomeSettings();
  
  // Fallback data
  const fallback = {
    heroSection: {
      heading: 'Swiss Alpine Journey',
      subheading: 'Where authentic stays meet modern comfort and local adventure',
      backgroundImage: {
        asset: {
          url: 'https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwwfHx8fDE3NjE2NjA4MTR8MA&ixlib=rb-4.1.0&q=85'
        },
        alt: 'Scenic view of Swiss Alpine village with traditional chalets and snow-capped mountains'
      }
    },
    ourListingsSection: {
      heading: 'Our listings',
      ctaText: 'View All Properties',
      ctaLink: '/stay'
    },
    homeBaseSection: {
      heading: 'Our Home Base: Grächen',
      description: 'All of our properties are located in the charming village of Grächen. Discover why we chose this car-free Alpine gem as the perfect location for your Swiss mountain getaway.',
      ctaText: 'Explore Grächen',
      ctaLink: '/explore/graechen',
      backgroundImage: {
        asset: {
          url: 'https://images.unsplash.com/photo-1629114472586-19096663e723?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwwfHx8fDE3NjE2NjA4MTR8MA&ixlib=rb-4.1.0&q=85'
        },
        alt: 'Charming traditional Swiss chalet in Grächen village'
      }
    },
    activitiesSection: {
      activities: [
        {
          title: 'Summer Adventures',
          description: 'Hiking, mountain biking, and exploring Alpine trails with stunning panoramic views',
          link: '/explore/travel-tips'
        },
        {
          title: 'Winter Sports',
          description: 'Skiing, snowboarding, and winter hiking across world-class slopes and trails',
          link: '/explore/travel-tips'
        },
        {
          title: 'Local Cuisine',
          description: 'Traditional Swiss specialties, fine dining, and cozy mountain restaurants',
          link: '/explore/graechen'
        }
      ]
    },
    newsletterSection: {
      heading: 'Stay Connected',
      description: 'Join our community and be the first to discover new listings and special offers'
    }
  };
  
  const data = settings || fallback;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px]" aria-labelledby="hero-heading">
        <div className="absolute inset-0">
          <Image
            src={data.heroSection?.backgroundImage?.asset?.url || fallback.heroSection.backgroundImage.asset.url}
            alt={data.heroSection?.backgroundImage?.alt || fallback.heroSection.backgroundImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-light text-white mb-4">
            {data.heroSection?.heading}
          </h1>
          <p className="text-xl text-white/90 mb-12">
            {data.heroSection?.subheading}
          </p>
          
          <SearchBar className="max-w-4xl w-full" />
        </div>
      </section>

      {/* Our Listings Section - Client Component */}
      <HomeProperties 
        sectionHeading={data.ourListingsSection?.heading}
        ctaText={data.ourListingsSection?.ctaText}
        ctaLink={data.ourListingsSection?.ctaLink}
      />

      {/* Our Home Base Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="home-base-heading">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={data.homeBaseSection?.backgroundImage?.asset?.url || fallback.homeBaseSection.backgroundImage.asset.url}
                alt={data.homeBaseSection?.backgroundImage?.alt || fallback.homeBaseSection.backgroundImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 id="home-base-heading" className="text-3xl font-light mb-6">
                {data.homeBaseSection?.heading}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {data.homeBaseSection?.description}
              </p>
              <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-8 focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <Link href={data.homeBaseSection?.ctaLink || '/explore/graechen'}>
                  {data.homeBaseSection?.ctaText || 'Explore Grächen'} <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20" aria-labelledby="activities-heading">
        <div className="container mx-auto px-4">
          <h2 id="activities-heading" className="sr-only">Activities and Experiences</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {data.activitiesSection?.activities?.map((activity, index) => (
              <article key={index} className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  {index === 0 ? (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path d="M3 18l6-6 4 4 8-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : index === 1 ? (
                    <Sparkles className="w-12 h-12" aria-hidden="true" />
                  ) : (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-medium mb-4">{activity.title}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <Link href={activity.link} className="text-black hover:underline font-medium">
                  Learn More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Client Component */}
      <Newsletter 
        heading={data.newsletterSection?.heading}
        description={data.newsletterSection?.description}
      />
    </div>
  );
}
