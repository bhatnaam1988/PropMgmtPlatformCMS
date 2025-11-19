import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function populateHomeSettings() {
  console.log('Populating Home Settings...');
  
  const homeData = {
    _type: 'homeSettingsHybrid',
    _id: 'homeSettingsHybrid',
    heroSection: {
      heading: 'Swiss Alpine Journey',
      subheading: 'Where authentic stays meet modern comfort and local adventure',
      backgroundImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-hero-home'
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
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-graechen-home'
        },
        alt: 'Charming traditional Swiss chalet in Grächen village with wooden architecture and Alpine surroundings'
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

  try {
    await client.createOrReplace(homeData);
    console.log('✅ Home Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Home Settings:', error.message);
  }
}

async function populateLegalSettings() {
  console.log('Populating Legal Settings...');
  
  const legalData = {
    _type: 'legalSettingsHybrid',
    _id: 'legalSettingsHybrid',
    pageHeader: {
      heading: 'Legal Information',
      description: 'Important legal documents and policies for Swiss Alpine Journey'
    },
    navigationCards: [
      {
        icon: 'FileText',
        title: 'Terms & Conditions',
        description: 'Booking terms and rental conditions',
        anchor: '#terms'
      },
      {
        icon: 'Shield',
        title: 'Privacy Policy',
        description: 'How we protect your personal data',
        anchor: '#privacy'
      },
      {
        icon: 'Cookie',
        title: 'GDPR Information',
        description: 'Your data rights under GDPR',
        anchor: '#gdpr'
      }
    ],
    termsSection: {
      heading: 'Terms & Conditions',
      lastUpdated: 'November 2024',
      sections: [
        {
          title: '1. Booking and Reservation',
          content: 'By making a reservation with Swiss Alpine Journey, you agree to these terms and conditions. All bookings are subject to availability and confirmation. A booking is only confirmed when you receive written confirmation from us.'
        },
        {
          title: '2. Payment Terms',
          content: 'A deposit of 30% of the total booking value is required to secure your reservation. The remaining balance must be paid 30 days before your arrival date. Payment can be made by bank transfer or major credit cards.'
        },
        {
          title: '3. Cancellation Policy',
          content: 'Free cancellation up to 48 hours before check-in\nCancellations within 48 hours: 50% of booking value retained\nNo-shows: 100% of booking value retained\nDifferent policies may apply during peak seasons'
        },
        {
          title: '4. Check-in and Check-out',
          content: 'Check-in time is between 15:00 and 19:00. Check-out time is 10:00. Late check-in or early check-out can be arranged with advance notice and may incur additional charges.'
        },
        {
          title: '5. Property Usage',
          content: 'Properties must be used respectfully and in accordance with local regulations. Smoking is prohibited in all properties. Parties and events are not permitted unless specifically agreed upon. Maximum occupancy must not be exceeded.'
        },
        {
          title: '6. Liability',
          content: 'Guests are responsible for any damage to the property during their stay. We recommend travel insurance. Swiss Alpine Journey cannot be held liable for personal injury, loss, or damage to personal belongings.'
        },
        {
          title: '7. Force Majeure',
          content: 'In cases of events beyond our control (natural disasters, government restrictions, etc.), we will work with guests to find alternative solutions or provide refunds as appropriate.'
        }
      ]
    },
    privacySection: {
      heading: 'Privacy Policy',
      lastUpdated: 'November 2024',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We collect information necessary to provide our accommodation services:\nPersonal details (name, address, contact information)\nBooking preferences and special requirements\nPayment information (processed securely through third parties)\nCommunication records for customer service'
        },
        {
          title: '2. How We Use Your Information',
          content: 'Your information is used solely for:\nProcessing and managing your booking\nProviding customer support\nSending booking confirmations and important updates\nImproving our services (with anonymized data)'
        },
        {
          title: '3. Information Sharing',
          content: 'We do not sell or share your personal information with third parties, except as required for service delivery (payment processing, cleaning services) or as required by law.'
        },
        {
          title: '4. Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          title: '5. Your Rights',
          content: 'Under GDPR, you have the right to:\nAccess your personal data\nCorrect inaccurate data\nRequest deletion of your data\nObject to data processing\nData portability'
        },
        {
          title: '6. Contact Information',
          content: 'For any privacy-related questions, contact us at: privacy@swissalpinejourney.com'
        }
      ]
    },
    gdprSection: {
      heading: 'GDPR Information',
      description: 'Your rights under the General Data Protection Regulation',
      sections: [
        {
          title: 'Your Data Protection Rights',
          content: 'As a data subject under GDPR, you have several rights regarding your personal data. We are committed to facilitating the exercise of these rights.'
        },
        {
          title: 'Right to Access',
          content: 'You can request a copy of all personal data we hold about you. We will provide this information within 30 days of your request.'
        },
        {
          title: 'Right to Rectification',
          content: 'If any of your personal data is inaccurate or incomplete, you have the right to have it corrected or completed.'
        },
        {
          title: "Right to Erasure ('Right to be Forgotten')",
          content: 'You can request the deletion of your personal data, subject to certain conditions such as legal obligations to retain records.'
        },
        {
          title: 'Right to Restrict Processing',
          content: 'You can request that we limit the processing of your personal data in certain circumstances.'
        },
        {
          title: 'Right to Data Portability',
          content: 'You can request that we transfer your data to another service provider in a structured, commonly used format.'
        },
        {
          title: 'Right to Object',
          content: 'You can object to the processing of your personal data for marketing purposes at any time.'
        },
        {
          title: 'How to Exercise Your Rights',
          content: 'To exercise any of these rights, please contact us at: gdpr@swissalpinejourney.com\n\nWe will respond to your request within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC).'
        }
      ]
    },
    footerText: {
      text: 'If you have any questions about these legal documents, please',
      linkText: 'contact us',
      linkUrl: '/contact'
    }
  };

  try {
    await client.createOrReplace(legalData);
    console.log('✅ Legal Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Legal Settings:', error.message);
  }
}

async function populateGraechenSettings() {
  console.log('Populating Grächen Settings...');
  
  const graechenData = {
    _type: 'graechenSettingsHybrid',
    _id: 'graechenSettingsHybrid',
    heroSection: {
      location: 'Valais, Switzerland',
      heading: 'Grächen',
      subheading: 'The Sunny Village of the Matter Valley',
      backgroundImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-graechen-hero'
        },
        alt: 'Panoramic view of Grächen village in Valais, Switzerland with traditional alpine chalets and mountain backdrop'
      }
    },
    introSection: {
      heading: 'Why We Love Grächen',
      paragraph1: 'Nestled at 1,619 meters in the Matter Valley, Grächen is a charming car-free Alpine village that combines authentic Swiss mountain culture with modern comfort. Known for its sunny climate, family-friendly atmosphere, and stunning Matterhorn views, it\'s the perfect base for your Swiss Alpine adventure.',
      paragraph2: 'Unlike the more famous resorts, Grächen offers a genuine Alpine experience where locals still outnumber tourists, prices remain reasonable, and the pace of life reflects the peaceful mountain setting.'
    },
    highlightsSection: {
      heading: 'Village Highlights',
      highlights: [
        {
          icon: 'Mountain',
          title: 'Car-Free Village',
          description: 'Enjoy fresh mountain air and peaceful surroundings in this charming car-free Alpine village'
        },
        {
          icon: 'Snowflake',
          title: 'Family-Friendly Skiing',
          description: 'Excellent slopes for all skill levels with stunning views of the Matterhorn and surrounding peaks'
        },
        {
          icon: 'Sun',
          title: 'Sunny Location',
          description: 'Known as the "Sunny Village," Grächen enjoys exceptional sunshine hours throughout the year'
        },
        {
          icon: 'Sparkles',
          title: 'Authentic Alpine Life',
          description: 'Experience genuine Swiss mountain culture away from crowded tourist resorts'
        }
      ]
    },
    activitiesSection: {
      heading: 'Year-Round Activities',
      winterActivities: [
        {
          title: 'Skiing & Snowboarding',
          description: '42km of perfectly groomed slopes with stunning Matterhorn views'
        },
        {
          title: 'Winter Hiking',
          description: '20km of maintained winter trails through pristine snow landscapes'
        },
        {
          title: 'Sledding',
          description: 'Family-friendly sledding runs with equipment rentals available'
        }
      ],
      summerActivities: [
        {
          title: 'Mountain Hiking',
          description: 'Over 200km of marked hiking trails for all experience levels'
        },
        {
          title: 'Mountain Biking',
          description: 'Challenging trails and scenic routes through Alpine meadows'
        },
        {
          title: 'Via Ferrata',
          description: 'Exciting climbing routes with secured cables for adventurers'
        }
      ]
    },
    practicalInfoSection: {
      heading: 'Practical Information',
      infoBlocks: [
        {
          title: 'Getting There',
          items: [
            '2.5 hours from Zürich',
            '2 hours from Geneva',
            'Free parking at village entrance',
            'Regular bus service from valley'
          ]
        },
        {
          title: 'Village Amenities',
          items: [
            'Supermarket & bakery',
            'Sports equipment rentals',
            'Restaurants & cafes',
            'Medical center'
          ]
        },
        {
          title: 'Best Times to Visit',
          items: [
            'Winter: December - April',
            'Summer: June - September',
            'Shoulder seasons for fewer crowds',
            'Book early for peak periods'
          ]
        }
      ]
    },
    mountainViewsSection: {
      heading: 'Stunning Mountain Views',
      paragraph1: 'One of Grächen\'s most spectacular features is the panoramic views of the Matterhorn and surrounding 4,000-meter peaks. On clear days, you can see over 20 alpine summits from various viewpoints around the village.',
      paragraph2: 'The village\'s south-facing position on the sunny slope of the Matter Valley means you\'ll enjoy these views bathed in natural light throughout most of the day.',
      ctaText: 'Book Your Stay',
      ctaLink: '/stay',
      secondaryCtaText: 'Travel Tips',
      secondaryCtaLink: '/explore/travel-tips'
    },
    cultureSection: {
      heading: 'Authentic Alpine Culture',
      description: 'Grächen has preserved its authentic Alpine character while welcoming visitors. Traditional wooden chalets line the streets, and the village maintains customs that date back centuries. You\'ll experience genuine Swiss hospitality from locals who take pride in sharing their mountain home with guests.',
      points: [
        {
          title: 'Local Traditions',
          description: 'Experience authentic Swiss culture through village festivals, traditional cuisine, and the warm hospitality of local residents.'
        },
        {
          title: 'Community Spirit',
          description: 'Despite welcoming visitors year-round, Grächen remains a living village where families have resided for generations.'
        }
      ]
    },
    finalCTA: {
      heading: 'Ready to Experience Grächen?',
      description: 'Browse our carefully selected properties in Grächen and start planning your authentic Swiss Alpine adventure today.',
      buttonText: 'View Available Properties',
      buttonLink: '/stay'
    }
  };

  try {
    await client.createOrReplace(graechenData);
    console.log('✅ Grächen Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Grächen Settings:', error.message);
  }
}

async function populateTravelTipsSettings() {
  console.log('Populating Travel Tips Settings...');
  
  const travelTipsData = {
    _type: 'travelTipsSettingsHybrid',
    _id: 'travelTipsSettingsHybrid',
    pageHeader: {
      heading: 'Travel Tips & Advice',
      description: 'Make the most of your Swiss Alpine adventure with insider tips and practical advice from locals and experienced travelers. Plan smarter, travel better.'
    },
    quickTips: {
      heading: 'Quick Tips to Know',
      tips: [
        'Swiss trains are incredibly punctual and efficient - the Swiss Travel Pass can save money',
        'Shops close early on Saturdays and are generally closed on Sundays except in tourist areas',
        'Swiss German sounds very different from standard German - learning a few phrases helps',
        'Credit cards are widely accepted, but small mountain huts may be cash-only',
        'Recycling is taken seriously - separate your waste according to local guidelines',
        'Many villages are car-free or car-restricted - embrace the tranquility!'
      ]
    },
    detailedTipsSection: {
      heading: 'Detailed Travel Tips',
      categories: [
        {
          icon: 'Mountain',
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
          icon: 'Snowflake',
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
          icon: 'Backpack',
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
          icon: 'Camera',
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
          icon: 'Utensils',
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
          icon: 'Shield',
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
          icon: 'Calendar',
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
      ]
    },
    moneySavingSection: {
      heading: 'Money-Saving Tips',
      tips: [
        'Cook some meals in your accommodation - Swiss groceries are reasonable compared to restaurants',
        'Buy multi-day ski passes for better value if staying a week',
        'Visit in shoulder season (May, June, September, October) for lower prices',
        'Free activities abound: hiking trails, village walks, and stunning viewpoints',
        'Drink tap water - it\'s excellent quality and saves on bottled water costs',
        'Take advantage of guest cards provided by accommodations for discounts'
      ]
    },
    sustainabilitySection: {
      heading: 'Sustainable Travel in the Alps',
      description: 'Help preserve the natural beauty of the Swiss Alps for future generations with these eco-friendly practices.',
      tips: [
        'Use public transport - Switzerland\'s network is world-class',
        'Stay on marked trails to protect fragile Alpine ecosystems',
        'Pack out all trash and dispose of waste properly',
        'Support local businesses and buy regional products',
        'Respect wildlife - observe from a distance and never feed animals',
        'Choose accommodations with environmental certifications'
      ]
    }
  };

  try {
    await client.createOrReplace(travelTipsData);
    console.log('✅ Travel Tips Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Travel Tips Settings:', error.message);
  }
}

async function populateBehindTheScenesSettings() {
  console.log('Populating Behind The Scenes Settings...');
  
  const behindTheScenesData = {
    _type: 'behindTheScenesSettingsHybrid',
    _id: 'behindTheScenesSettingsHybrid',
    pageHeader: {
      heading: 'Behind the Scenes',
      description: 'Discover the story behind Swiss Alpine Journey and the dedication that goes into creating your perfect alpine getaway.'
    },
    storySection: {
      heading: 'Our Story',
      paragraphs: [
        'Swiss Alpine Journey was born from a simple belief: the best vacation experiences happen when quality accommodations meet convenient locations and thoughtful service. We saw too many guests staying in properties that were either poorly maintained or inconveniently located far from village centers and activities.',
        'We chose Grächen as our home base because it embodies everything we love about the Swiss Alps - a charming car-free village with authentic Alpine character, excellent skiing and hiking, and the warmth of a genuine alpine community. It\'s not the most famous resort, but that\'s exactly what makes it special.',
        'Today, we\'re proud to offer carefully curated properties that prioritize location, quality, and convenience. Each property is chosen for its proximity to village amenities, outdoor activities, and the experiences that make a Swiss alpine vacation truly memorable.'
      ]
    },
    valuesSection: {
      heading: 'What Drives Us',
      values: [
        {
          icon: 'Heart',
          title: 'Passion for the Alps',
          description: 'Our love for the Swiss alps drives everything we do. We\'re not just property managers - we\'re alpine enthusiasts who want to share the magic of Alpine living with every guest.'
        },
        {
          icon: 'Home',
          title: 'Quality First',
          description: 'We carefully select and maintain each property to ensure it meets our high standards. From location to amenities, every detail matters in creating your perfect alpine retreat.'
        },
        {
          icon: 'Users',
          title: 'Guest-Centered',
          description: 'Your experience is our priority. We provide thoughtful touches, local recommendations, and responsive support to make your stay seamless and memorable.'
        },
        {
          icon: 'Sparkles',
          title: 'Authentic Experiences',
          description: 'We believe in authentic Swiss Alpine experiences. Our properties are located where locals live, close to village centers, activities, and the real charm of alpine life.'
        }
      ]
    },
    teamSection: {
      heading: 'Our Team',
      roles: [
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
      ]
    },
    processSection: {
      heading: 'How We Prepare Your Stay',
      steps: [
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
      ]
    },
    qualityStandardsSection: {
      heading: 'Our Quality Standards',
      standards: [
        'Properties within walking distance of village centers',
        'Close proximity to ski lifts and hiking trails',
        'Professional cleaning after every stay',
        'Regular property inspections and maintenance',
        'Fully equipped kitchens with quality appliances',
        'Comfortable, well-maintained furnishings',
        'Reliable Wi-Fi and modern amenities',
        'Responsive guest support and local expertise'
      ]
    },
    communitySection: {
      heading: 'Community & Sustainability',
      paragraph1: 'We\'re committed to being responsible members of the Grächen community and protecting the Alpine environment we love. We partner with local businesses, support sustainable tourism practices, and educate our guests about respecting the natural beauty of the region.',
      paragraph2: 'When you stay with us, you\'re not just booking accommodation - you\'re supporting a local business that cares about the community and environment.'
    },
    finalCTA: {
      heading: 'Experience the Difference',
      description: 'Ready to experience Swiss Alpine Journey hospitality? Explore our carefully selected properties and start planning your alpine adventure.',
      primaryButtonText: 'View Listings',
      primaryButtonLink: '/stay',
      secondaryButtonText: 'Contact Us',
      secondaryButtonLink: '/contact'
    }
  };

  try {
    await client.createOrReplace(behindTheScenesData);
    console.log('✅ Behind The Scenes Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Behind The Scenes Settings:', error.message);
  }
}

async function populateOtherLocationsSettings() {
  console.log('Populating Other Locations Settings...');
  
  const otherLocationsData = {
    _type: 'otherLocationsSettingsHybrid',
    _id: 'otherLocationsSettingsHybrid',
    pageHeader: {
      heading: 'Discover Other Locations',
      description: 'While our properties are based in Grächen, explore other stunning Swiss Alpine destinations in the Valais region. Each offers unique experiences and unforgettable mountain adventures.'
    },
    locationsSection: {
      heading: 'Featured Locations',
      locations: [
        {
          slug: 'zermatt',
          name: 'Zermatt',
          region: 'Valais, Switzerland',
          excerpt: 'Home to the iconic Matterhorn, Zermatt offers world-class skiing, upscale dining, and breathtaking Alpine scenery in a car-free environment.',
          highlights: [
            'Iconic Matterhorn views',
            'World-class skiing',
            'Upscale dining & shopping',
            'Glacier Paradise'
          ]
        },
        {
          slug: 'saas-fee',
          name: 'Saas-Fee',
          region: 'Valais, Switzerland',
          excerpt: 'Known as the "Pearl of the Alps," Saas-Fee features glacier skiing, traditional Alpine charm, and stunning 4,000-meter peaks surrounding the village.',
          highlights: [
            'Glacier skiing',
            'Traditional Alpine village',
            '4,000m peaks',
            'Ice grotto & pavilion'
          ]
        },
        {
          slug: 'crans-montana',
          name: 'Crans-Montana',
          region: 'Valais, Switzerland',
          excerpt: 'A cosmopolitan resort with stunning views of the Valais Alps, luxury amenities, championship golf courses, and diverse winter sports.',
          highlights: [
            'Cosmopolitan resort',
            'Championship golf',
            'Luxury amenities',
            'Diverse winter sports'
          ]
        },
        {
          slug: 'verbier',
          name: 'Verbier',
          region: 'Valais, Switzerland',
          excerpt: 'A premier destination for advanced skiers and après-ski enthusiasts, Verbier offers challenging terrain, vibrant nightlife, and stunning Mont Blanc views.',
          highlights: [
            'Expert skiing terrain',
            'Vibrant après-ski',
            'Mont Blanc views',
            '4 Vallées ski area'
          ]
        },
        {
          slug: 'leukerbad',
          name: 'Leukerbad',
          region: 'Valais, Switzerland',
          excerpt: 'Europe\'s largest thermal spa resort nestled in the Alps, offering thermal baths, wellness treatments, and family-friendly skiing.',
          highlights: [
            'Thermal spa resort',
            'Wellness & relaxation',
            'Family-friendly skiing',
            'Alpine thermal baths'
          ]
        }
      ]
    },
    graechenCTA: {
      heading: 'Our Home Base: Grächen',
      description: 'All of our properties are located in the charming village of Grächen. Discover why we chose this car-free Alpine gem as the perfect location for your Swiss mountain getaway.',
      buttonText: 'Explore Grächen',
      buttonLink: '/explore/graechen'
    },
    activitiesOverview: {
      activities: [
        {
          icon: 'Mountain',
          title: 'Summer Adventures',
          description: 'Hiking, mountain biking, and exploring Alpine trails with stunning panoramic views'
        },
        {
          icon: 'Snowflake',
          title: 'Winter Sports',
          description: 'Skiing, snowboarding, and winter hiking across world-class slopes and trails'
        },
        {
          icon: 'Utensils',
          title: 'Local Cuisine',
          description: 'Traditional Swiss specialties, fine dining, and cozy mountain restaurants'
        }
      ]
    }
  };

  try {
    await client.createOrReplace(otherLocationsData);
    console.log('✅ Other Locations Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Other Locations Settings:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting schema population...\n');
  
  await populateHomeSettings();
  await populateLegalSettings();
  await populateGraechenSettings();
  await populateTravelTipsSettings();
  await populateBehindTheScenesSettings();
  await populateOtherLocationsSettings();
  
  console.log('\n✅ All schemas populated successfully!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
