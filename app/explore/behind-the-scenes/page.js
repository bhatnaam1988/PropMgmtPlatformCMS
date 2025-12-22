import { getBehindTheScenesSettings } from '@/lib/sanity';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export const revalidate = 300;

export default async function BehindTheScenes() {
  const settings = await getBehindTheScenesSettings();
  
  const fallback = {
    pageHeader: {
      heading: 'Behind the Scenes',
      description: 'Discover the story behind Swiss Alpine Journey and the dedication that goes into creating your perfect alpine getaway.'
    },
    storySection: {
      heading: 'Our Story',
      paragraphs: [
        'Swiss Alpine Journey was born from a simple belief: the best vacation experiences happen when quality accommodations meet convenient locations and thoughtful service.',
        'We chose Grächen as our home base because it embodies everything we love about the Swiss Alps.'
      ]
    },
    valuesSection: {
      heading: 'What Drives Us',
      values: [
        { icon: 'Heart', title: 'Passion for the Alps', description: 'Our love for the Swiss alps drives everything we do.' },
        { icon: 'Home', title: 'Quality First', description: 'We carefully select and maintain each property.' }
      ]
    },
    teamSection: {
      heading: 'Our Team',
      roles: [
        { role: 'Property Care', description: 'Dedicated cleaning and maintenance team' },
        { role: 'Guest Services', description: 'Available to answer questions' }
      ]
    },
    processSection: {
      heading: 'How We Prepare Your Stay',
      steps: [
        { title: 'Property Selection', description: 'Handpicked based on location and quality' },
        { title: 'Renovation & Setup', description: 'Thoughtful renovations blend charm with comfort' }
      ]
    },
    qualityStandardsSection: {
      heading: 'Our Quality Standards',
      standards: [
        'Properties within walking distance of village centers',
        'Professional cleaning after every stay'
      ]
    },
    communitySection: {
      heading: 'Community & Sustainability',
      paragraph1: 'We\'re committed to being responsible members of the Grächen community.',
      paragraph2: 'When you stay with us, you\'re supporting a local business that cares.'
    },
    finalCTA: {
      heading: 'Experience the Difference',
      description: 'Ready to experience Swiss Alpine Journey hospitality?',
      primaryButtonText: 'View Listings',
      primaryButtonLink: '/stay',
      secondaryButtonText: 'Contact Us',
      secondaryButtonLink: '/contact'
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

        {/* Hero Image */}
        <div className="aspect-[21/9] md:aspect-[21/7] relative mb-12 rounded-lg overflow-hidden">
          <img
            src={data.heroSection?.backgroundImage?.asset?.url || "https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Swiss Alpine Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <p className="text-white text-lg max-w-2xl">
                "Where authentic stays meet modern comfort and local adventure"
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6 text-center">{data.storySection?.heading}</h2>
            <div className="space-y-4 text-muted-foreground">
              {data.storySection?.paragraphs?.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-center">{data.valuesSection?.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.valuesSection?.values?.map((value, index) => {
              const IconComponent = Icons[value.icon] || Icons.Heart;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* The Team */}
        <div className="mb-16">
          <h2 className="mb-8 text-center">{data.teamSection?.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.teamSection?.roles?.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-3">{member.role}</h3>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Process */}
        <div className="mb-16">
          <h2 className="mb-8 text-center">{data.processSection?.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.processSection?.steps?.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {index + 1}
                    </div>
                    <h3 className="text-sm">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quality Standards */}
        <div className="mb-16">
          <Card className="bg-muted/50">
            <CardContent className="p-8">
              <h2 className="mb-6 text-center">{data.qualityStandardsSection?.heading}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {data.qualityStandardsSection?.standards?.map((standard, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{standard}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Involvement */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">{data.communitySection?.heading}</h2>
            <p className="text-muted-foreground mb-6">{data.communitySection?.paragraph1}</p>
            <p className="text-muted-foreground">{data.communitySection?.paragraph2}</p>
          </div>
        </div>

        {/* CTA */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="mb-4">{data.finalCTA?.heading}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{data.finalCTA?.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={data.finalCTA?.primaryButtonLink || '/stay'}>
                  {data.finalCTA?.primaryButtonText || 'View Listings'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={data.finalCTA?.secondaryButtonLink || '/contact'}>
                  {data.finalCTA?.secondaryButtonText || 'Contact Us'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
