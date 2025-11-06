'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Home, Users, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function BehindTheScenes() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Passion for the Alps',
      description: 'Our love for the Swiss alps drives everything we do. We\'re not just property managers - we\'re alpine enthusiasts who want to share the magic of Alpine living with every guest.'
    },
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: 'Quality First',
      description: 'We carefully select and maintain each property to ensure it meets our high standards. From location to amenities, every detail matters in creating your perfect alpine retreat.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Guest-Centered',
      description: 'Your experience is our priority. We provide thoughtful touches, local recommendations, and responsive support to make your stay seamless and memorable.'
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'Authentic Experiences',
      description: 'We believe in authentic Swiss Alpine experiences. Our properties are located where locals live, close to village centers, activities, and the real charm of alpine life.'
    }
  ];

  const team = [
    {
      role: 'Property Care',
      description: 'Our dedicated cleaning and maintenance team ensures every property is spotless, well-maintained, and ready for your arrival. They take pride in creating a welcoming environment.'
    },
    {
      role: 'Guest Services',
      description: 'Available to answer questions, provide local tips, and assist with any needs during your stay. We\'re your connection to the best experiences in Grächen and beyond.'
    },
    {
      role: 'Local Partnerships',
      description: 'We work closely with local businesses, ski schools, restaurants, and activity providers to ensure you have access to the best the region has to offer.'
    }
  ];

  const process = [
    {
      title: 'Property Selection',
      description: 'We handpick properties based on location, quality, and potential to provide exceptional guest experiences. Proximity to village centers and activities is essential.'
    },
    {
      title: 'Renovation & Setup',
      description: 'Many properties undergo thoughtful renovations to blend traditional Alpine charm with modern comforts. We furnish them with everything you need for a comfortable stay.'
    },
    {
      title: 'Professional Cleaning',
      description: 'Between each stay, our professional cleaning team thoroughly cleans and inspects every property to our exacting standards.'
    },
    {
      title: 'Guest Welcome',
      description: 'We prepare detailed guides, provide local recommendations, and ensure smooth check-in so you can start enjoying your Alpine adventure immediately.'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Behind the Scenes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the story behind Swiss Alpine Journey and the dedication that goes into 
            creating your perfect alpine getaway.
          </p>
        </div>

        {/* Hero Image */}
        <div className="aspect-[21/9] md:aspect-[21/7] relative mb-12 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
            <h2 className="mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Swiss Alpine Journey was born from a simple belief: the best vacation experiences happen when 
                quality accommodations meet convenient locations and thoughtful service. We saw too many guests 
                staying in properties that were either poorly maintained or inconveniently located far from 
                village centers and activities.
              </p>
              <p>
                We chose Grächen as our home base because it embodies everything we love about the Swiss Alps - 
                a charming car-free village with authentic Alpine character, excellent skiing and hiking, and 
                the warmth of a genuine alpine community. It's not the most famous resort, but that's exactly 
                what makes it special.
              </p>
              <p>
                Today, we're proud to offer carefully curated properties that prioritize location, quality, and 
                convenience. Each property is chosen for its proximity to village amenities, outdoor activities, 
                and the experiences that make a Swiss alpine vacation truly memorable.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-center">What Drives Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* The Team */}
        <div className="mb-16">
          <h2 className="mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
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
          <h2 className="mb-8 text-center">How We Prepare Your Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
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
              <h2 className="mb-6 text-center">Our Quality Standards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  'Properties within walking distance of village centers',
                  'Close proximity to ski lifts and hiking trails',
                  'Professional cleaning after every stay',
                  'Regular property inspections and maintenance',
                  'Fully equipped kitchens with quality appliances',
                  'Comfortable, well-maintained furnishings',
                  'Reliable Wi-Fi and modern amenities',
                  'Responsive guest support and local expertise'
                ].map((standard, index) => (
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
            <h2 className="mb-6">Community & Sustainability</h2>
            <p className="text-muted-foreground mb-6">
              We're committed to being responsible members of the Grächen community and protecting the 
              Alpine environment we love. We partner with local businesses, support sustainable tourism 
              practices, and educate our guests about respecting the natural beauty of the region.
            </p>
            <p className="text-muted-foreground">
              When you stay with us, you're not just booking accommodation - you're supporting a local 
              business that cares about the community and environment.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="mb-4">Experience the Difference</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to experience Swiss Alpine Journey hospitality? Explore our carefully selected 
              properties and start planning your alpine adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/stay">
                  View Listings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
