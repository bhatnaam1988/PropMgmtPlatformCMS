'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Users, Star } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Prime Locations",
      description: "We select properties based on their proximity to village centers, ski areas, and outdoor activities for maximum convenience."
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Quality Standards",
      description: "Every property in our collection is carefully maintained and equipped with thoughtful amenities for a comfortable stay."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Local Expertise",
      description: "We're dedicated to helping you make the most of your Alpine experience with insider knowledge and personalized recommendations."
    }
  ];

  const stats = [
    { number: "100+", label: "Happy Families Hosted" },
    { number: "Airbnb Superhost", label: "Since 2024" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)`
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Where authentic stays meet modern comfort and local adventure
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Welcome to Swiss Alpine Journey</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our story begins in Grächen, where my grandfather built the first family apartments many years ago. What started as a place for our own family holidays has grown into a lasting commitment to share the beauty and comfort of the Swiss Alps with others.
                </p>
                <p>
                  Having spent much of my life in these alps – hiking, working, and appreciating their rhythm through every season – I continue that tradition today by welcoming guests not only to my grandfather's original apartment, which I now own, but also to other carefully maintained homes I've acquired or help manage for local owners.
                </p>
                <p>
                  For me, hosting is about reliability, thoughtful design, and ease. Each property is equipped with everything you need to settle in quickly and feel at home, so you can focus on what truly matters – whether that's relaxing in the alpine calm or setting out for new adventures on the trails and slopes.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1628172225866-fbbec7bcbe9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscGluZSUyMGNoYWxldCUyMGludGVyaW9yfGVufDF8fHx8MTc1NzgzOTk4OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Peaceful home interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do, from selecting properties to caring for our guests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3">
                    {value.icon}
                  </div>
                  <h3 className="mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-medium text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578416043044-298e3d1da20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbW91bnRhaW4lMjBjaGFsZXQlMjBmaXJlcGxhY2V8ZW58MXx8fHwxNzU3ODM5OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cozy chalet interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="mb-6">Why Choose Swiss Alpine Journey?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2">Strategic Selection</h3>
                    <p className="text-muted-foreground">Every property is carefully chosen for its prime location near skiing, activities, and village amenities.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2">Quality Maintenance</h3>
                    <p className="text-muted-foreground">We personally visit and maintain every property, ensuring it meets our high standards for comfort and convenience.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2">Always Here for You</h3>
                    <p className="text-muted-foreground">Our dedicated support team is always available to ensure your stay is worry-free and everything runs smoothly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Plan Your Journey?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let us help you discover your perfect Swiss home base. Browse our collection of thoughtfully located homes and start planning your next journey in Switzerland.
          </p>
          <Button size="lg" asChild>
            <Link href="/stay">Plan Your Journey</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
