import { getTravelTipsSettings } from '@/lib/sanity';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import * as Icons from 'lucide-react';

export const revalidate = 300;

export default async function TravelTips() {
  const settings = await getTravelTipsSettings();
  
  const fallback = {
    pageHeader: {
      heading: 'Travel Tips & Advice',
      description: 'Make the most of your Swiss Alpine adventure with insider tips and practical advice from locals and experienced travelers.'
    },
    quickTips: {
      heading: 'Quick Tips to Know',
      tips: [
        'Swiss trains are incredibly punctual and efficient',
        'Shops close early on Saturdays',
        'Credit cards are widely accepted'
      ]
    },
    detailedTipsSection: {
      heading: 'Detailed Travel Tips',
      categories: [
        {
          icon: 'Mountain',
          title: 'Hiking & Outdoor',
          tips: ['Layer your clothing', 'Start hikes early', 'Bring plenty of water']
        }
      ]
    },
    moneySavingSection: {
      heading: 'Money-Saving Tips',
      tips: ['Cook some meals in your accommodation', 'Visit in shoulder season']
    },
    sustainabilitySection: {
      heading: 'Sustainable Travel in the Alps',
      description: 'Help preserve the natural beauty of the Swiss Alps.',
      tips: ['Use public transport', 'Stay on marked trails', 'Pack out all trash']
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
            src="https://images.unsplash.com/photo-1700643612355-f6ef344c7b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBtb3VudGFpbiUyMGhpa2luZyUyMHN3aXR6ZXJsYW5kfGVufDF8fHx8MTc1NzgzOTk5MHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Swiss Alps Travel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quick Tips */}
        <div className="mb-12">
          <h2 className="mb-6 text-center">{data.quickTips?.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.quickTips?.tips?.map((tip, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex gap-3">
                  <div className="text-primary flex-shrink-0 mt-1">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Tips by Category */}
        <div className="space-y-8">
          <h2 className="text-center mb-8">{data.detailedTipsSection?.heading}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data.detailedTipsSection?.categories?.map((category, index) => {
              const IconComponent = Icons[category.icon] || Icons.Mountain;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                      <h3>{category.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {category.tips?.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Money-Saving Tips */}
        <div className="mt-12">
          <Card className="bg-muted/50">
            <CardContent className="p-8">
              <h2 className="mb-6 text-center">{data.moneySavingSection?.heading}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.moneySavingSection?.tips?.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                    <p className="text-muted-foreground text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sustainability Tips */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6 text-center">{data.sustainabilitySection?.heading}</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
                {data.sustainabilitySection?.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.sustainabilitySection?.tips?.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                    <p className="text-muted-foreground text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
