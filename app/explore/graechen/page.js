'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mountain, Snowflake, Sun, Sparkles, ArrowRight, Calendar } from 'lucide-react';

export default function Graechen() {
  const highlights = [
    {
      icon: <Mountain className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Car-Free Village",
      description: "Enjoy fresh mountain air and peaceful surroundings in this charming car-free Alpine village"
    },
    {
      icon: <Snowflake className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Family-Friendly Skiing",
      description: "Excellent slopes for all skill levels with stunning views of the Matterhorn and surrounding peaks"
    },
    {
      icon: <Sun className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Sunny Location",
      description: "Known as the 'Sunny Village,' Grächen enjoys exceptional sunshine hours throughout the year"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Authentic Alpine Life",
      description: "Experience genuine Swiss mountain culture away from crowded tourist resorts"
    }
  ];

  const activities = {
    winter: [
      {
        title: "Skiing & Snowboarding",
        description: "42km of perfectly groomed slopes with stunning Matterhorn views"
      },
      {
        title: "Winter Hiking",
        description: "20km of maintained winter trails through pristine snow landscapes"
      },
      {
        title: "Sledding",
        description: "Family-friendly sledding runs with equipment rentals available"
      }
    ],
    summer: [
      {
        title: "Mountain Hiking",
        description: "Over 200km of marked hiking trails for all experience levels"
      },
      {
        title: "Mountain Biking",
        description: "Challenging trails and scenic routes through Alpine meadows"
      },
      {
        title: "Via Ferrata",
        description: "Exciting climbing routes with secured cables for adventurers"
      }
    ]
  };

  const practicalInfo = [
    {
      title: "Getting There",
      details: [
        "2.5 hours from Zürich",
        "2 hours from Geneva",
        "Free parking at village entrance",
        "Regular bus service from valley"
      ]
    },
    {
      title: "Village Amenities",
      details: [
        "Supermarket & bakery",
        "Sports equipment rentals",
        "Restaurants & cafes",
        "Medical center"
      ]
    },
    {
      title: "Best Times to Visit",
      details: [
        "Winter: December - April",
        "Summer: June - September",
        "Shoulder seasons for fewer crowds",
        "Book early for peak periods"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px]" aria-labelledby="hero-heading">
        <Image
          src="https://images.unsplash.com/photo-1656746618448-944c18bb4bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHcmFjaGVuJTIwU3dpdHplcmxhbmQlMjB0b3duJTIwYWxwaW5lJTIwdmlsbGFnZXxlbnwxfHx8fDE3NTkxMTk0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Panoramic view of Grächen village in Valais, Switzerland with traditional alpine chalets and mountain backdrop"
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
              <span>Valais, Switzerland</span>
            </div>
            <h1 id="hero-heading" className="text-4xl md:text-5xl mb-4">Grächen</h1>
            <p className="text-xl md:text-2xl opacity-90">
              The Sunny Village of the Matter Valley
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-background" aria-labelledby="intro-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="intro-heading" className="mb-6">Why We Love Grächen</h2>
            <p className="text-muted-foreground mb-6">
              Nestled at 1,619 meters in the Matter Valley, Grächen is a charming car-free Alpine village 
              that combines authentic Swiss mountain culture with modern comfort. Known for its sunny climate, 
              family-friendly atmosphere, and stunning Matterhorn views, it's the perfect base for your 
              Swiss Alpine adventure.
            </p>
            <p className="text-muted-foreground">
              Unlike the more famous resorts, Grächen offers a genuine Alpine experience where locals 
              still outnumber tourists, prices remain reasonable, and the pace of life reflects the 
              peaceful mountain setting.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-muted/50" aria-labelledby="highlights-heading">
        <div className="container mx-auto px-4">
          <h2 id="highlights-heading" className="mb-12 text-center">Village Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{highlight.icon}</div>
                  <h3 className="mb-3">{highlight.title}</h3>
                  <p className="text-muted-foreground text-sm">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 bg-background" aria-labelledby="activities-heading">
        <div className="container mx-auto px-4">
          <h2 id="activities-heading" className="mb-12 text-center">Year-Round Activities</h2>
          
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
                    {activities.winter.map((activity, index) => (
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
                    {activities.summer.map((activity, index) => (
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
          <h2 id="practical-heading" className="mb-12 text-center">Practical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practicalInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-4">{info.title}</h3>
                  <ul className="space-y-2" role="list">
                    {info.details.map((detail, detailIndex) => (
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

      {/* Matterhorn Views */}
      <section className="py-16 bg-background" aria-labelledby="views-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1700643612355-f6ef344c7b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBtb3VudGFpbiUyMGhpa2luZyUyMHN3aXR6ZXJsYW5kfGVufDF8fHx8MTc1NzgzOTk5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Spectacular Matterhorn mountain views from Grächen hiking trails in autumn"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 id="views-heading" className="mb-6">Stunning Mountain Views</h2>
              <p className="text-muted-foreground mb-4">
                One of Grächen's most spectacular features is the panoramic views of the Matterhorn 
                and surrounding 4,000-meter peaks. On clear days, you can see over 20 alpine summits 
                from various viewpoints around the village.
              </p>
              <p className="text-muted-foreground mb-6">
                The village's south-facing position on the sunny slope of the Matter Valley means 
                you'll enjoy these views bathed in natural light throughout most of the day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  <Link href="/stay">
                    Book Your Stay
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  <Link href="/explore/travel-tips">
                    <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                    Travel Tips
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
            <h2 id="culture-heading" className="mb-6 text-center">Authentic Alpine Culture</h2>
            <p className="text-muted-foreground text-center mb-8">
              Grächen has preserved its authentic Alpine character while welcoming visitors. 
              Traditional wooden chalets line the streets, and the village maintains customs 
              that date back centuries. You'll experience genuine Swiss hospitality from locals 
              who take pride in sharing their mountain home with guests.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="bg-background p-6 rounded-lg border border-border">
                <h3 className="mb-3">Local Traditions</h3>
                <p className="text-sm text-muted-foreground">
                  Experience authentic Swiss culture through village festivals, traditional cuisine, 
                  and the warm hospitality of local residents.
                </p>
              </article>
              <article className="bg-background p-6 rounded-lg border border-border">
                <h3 className="mb-3">Community Spirit</h3>
                <p className="text-sm text-muted-foreground">
                  Despite welcoming visitors year-round, Grächen remains a living village where 
                  families have resided for generations.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="mb-4">Ready to Experience Grächen?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our carefully selected properties in Grächen and start planning 
            your authentic Swiss Alpine adventure today.
          </p>
          <Button size="lg" asChild className="focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <Link href="/stay">
              View Available Properties
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}