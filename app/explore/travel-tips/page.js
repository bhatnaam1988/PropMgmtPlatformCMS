'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Mountain, Snowflake, Backpack, Camera, Utensils, Shield, Calendar } from 'lucide-react';

export default function TravelTips() {
  const tipCategories = [
    {
      icon: <Mountain className="h-8 w-8 text-primary" />,
      title: 'Hiking & Outdoor',
      tips: [
        'Layer your clothing - mountain weather can change quickly',
        'Start hikes early in the morning for the best weather and fewer crowds',
        'Always bring more water than you think you\'ll need (1L per 2 hours minimum)',
        'Wear sturdy hiking boots with good ankle support and grip',
        'Download offline maps before heading into the mountains',
        'Check mountain weather forecasts before each hike'
      ]
    },
    {
      icon: <Snowflake className="h-8 w-8 text-primary" />,
      title: 'Winter Sports',
      tips: [
        'Book ski equipment rentals in advance during peak season',
        'Take a lesson even if you have some experience - Swiss instructors are excellent',
        'Apply sunscreen generously - UV rays are stronger at high altitude',
        'Start on easier slopes to acclimate to the altitude and conditions',
        'Ski insurance is highly recommended for peace of mind',
        'Check avalanche warnings and stay on marked trails'
      ]
    },
    {
      icon: <Backpack className="h-8 w-8 text-primary" />,
      title: 'Packing Essentials',
      tips: [
        'Bring a universal power adapter (Switzerland uses Type J plugs)',
        'Pack a reusable water bottle - tap water is excellent and free',
        'Don\'t forget sunglasses and sunscreen year-round',
        'A small daypack is essential for excursions',
        'Bring both casual and slightly dressy clothes for restaurants',
        'A lightweight rain jacket is useful any season'
      ]
    },
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: 'Photography',
      tips: [
        'Golden hour (sunrise/sunset) offers the most dramatic mountain lighting',
        'Bring extra batteries - cold weather drains them quickly',
        'Use a polarizing filter to reduce glare from snow and enhance blue skies',
        'Capture the Matterhorn early morning before clouds roll in',
        'Don\'t forget to photograph the charming village details and architecture',
        'Respect private property and ask before photographing people'
      ]
    },
    {
      icon: <Utensils className="h-8 w-8 text-primary" />,
      title: 'Dining & Cuisine',
      tips: [
        'Make restaurant reservations, especially for dinner in peak season',
        'Try local specialties: raclette, fondue, and Valais wines',
        'Tipping is included in prices, but rounding up is appreciated',
        'Many mountain restaurants are cash-only - carry Swiss Francs',
        'Lunch deals at restaurants offer better value than dinner',
        'Visit local bakeries for breakfast - pastries are fresh and affordable'
      ]
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Safety & Health',
      tips: [
        'Allow time to acclimate to altitude - take it easy the first day',
        'Stay hydrated - drink more water than usual at high elevation',
        'Know the international distress signal: 6 signals per minute',
        'Save emergency numbers: 112 (general), 1414 (mountain rescue)',
        'Travel insurance with mountain sports coverage is essential',
        'Inform someone of your plans when heading into the mountains'
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: 'Best Times to Visit',
      tips: [
        'Winter season: December to April for skiing and snow activities',
        'Summer season: June to September for hiking and warm weather',
        'Shoulder seasons (May, October) offer fewer crowds and lower prices',
        'Book 3-6 months in advance for peak season (Christmas, February, August)',
        'Midweek stays are often more affordable than weekends',
        'Check local event calendars - festivals can be highlights or cause crowds'
      ]
    }
  ];

  const quickTips = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: 'Swiss trains are incredibly punctual and efficient - the Swiss Travel Pass can save money'
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: 'Shops close early on Saturdays and are generally closed on Sundays except in tourist areas'
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: 'Swiss German sounds very different from standard German - learning a few phrases helps'
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: 'Credit cards are widely accepted, but small mountain huts may be cash-only'
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: 'Recycling is taken seriously - separate your waste according to local guidelines'
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: 'Many villages are car-free or car-restricted - embrace the tranquility!'
    }
  ];

  return (
    <div className="page-no-hero min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Travel Tips & Advice</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Make the most of your Swiss Alpine adventure with insider tips and practical advice 
            from locals and experienced travelers. Plan smarter, travel better.
          </p>
        </div>

        {/* Hero Image */}
        <div className="aspect-[21/9] md:aspect-[21/7] relative mb-12 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1700643612355-f6ef344c7b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBtb3VudGFpbiUyMGhpa2luZyUyMHN3aXR6ZXJsYW5kfGVufDF8fHx8MTc1NzgzOTk5MHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Swiss Alps Travel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quick Tips */}
        <div className="mb-12">
          <h2 className="mb-6 text-center">Quick Tips to Know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTips.map((tip, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex gap-3">
                  <div className="text-primary flex-shrink-0 mt-1">
                    {tip.icon}
                  </div>
                  <p className="text-sm text-muted-foreground">{tip.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Tips by Category */}
        <div className="space-y-8">
          <h2 className="text-center mb-8">Detailed Travel Tips</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tipCategories.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h3>{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Money-Saving Tips */}
        <div className="mt-12">
          <Card className="bg-muted/50">
            <CardContent className="p-8">
              <h2 className="mb-6 text-center">Money-Saving Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Cook some meals in your accommodation - Swiss groceries are reasonable compared to restaurants
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Buy multi-day ski passes for better value if staying a week
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Visit in shoulder season (May, June, September, October) for lower prices
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Free activities abound: hiking trails, village walks, and stunning viewpoints
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Drink tap water - it's excellent quality and saves on bottled water costs
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Take advantage of guest cards provided by accommodations for discounts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sustainability Tips */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6 text-center">Sustainable Travel in the Alps</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
                Help preserve the natural beauty of the Swiss Alps for future generations with these eco-friendly practices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Use public transport - Switzerland's network is world-class
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Stay on marked trails to protect fragile Alpine ecosystems
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Pack out all trash and dispose of waste properly
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Support local businesses and buy regional products
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Respect wildlife - observe from a distance and never feed animals
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Choose accommodations with environmental certifications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
