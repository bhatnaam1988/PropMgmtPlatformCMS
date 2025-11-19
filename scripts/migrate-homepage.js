const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const homeContent = {
  _type: 'homeSettingsHybrid',
  heroSection: {
    heading: 'Swiss Alpine Journey',
    subheading: 'Where authentic stays meet modern comfort and local adventure',
    backgroundImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-19b8bb52a717234d62a3d023b951d6f2158562c1-4979x2801-jpg'
      },
      alt: 'Scenic view of Swiss Alpine village with traditional chalets and snow-capped mountains'
    }
  },
  listingsSection: {
    heading: 'Our listings',
    buttonText: 'View All Properties'
  },
  homeBaseSection: {
    heading: 'Our Home Base: Grächen',
    description: 'All of our properties are located in the charming village of Grächen. Discover why we chose this car-free Alpine gem as the perfect location for your Swiss mountain getaway.',
    buttonText: 'Explore Grächen',
    buttonLink: '/explore/graechen'
  },
  activitiesSection: {
    activities: [
      {
        title: 'Summer Adventures',
        description: 'Hiking, mountain biking, and exploring Alpine trails with stunning panoramic views',
        linkText: 'Learn More →',
        linkUrl: '/explore/travel-tips'
      },
      {
        title: 'Winter Sports',
        description: 'Skiing, snowboarding, and winter hiking across world-class slopes and trails',
        linkText: 'Explore Winter Activities →',
        linkUrl: '/explore/travel-tips'
      },
      {
        title: 'Local Cuisine',
        description: 'Traditional Swiss specialties, fine dining, and cozy mountain restaurants',
        linkText: 'Discover Local Life →',
        linkUrl: '/explore/graechen'
      }
    ]
  },
  newsletterSection: {
    heading: 'Stay Connected',
    description: 'Join our community and be the first to discover new listings and special offers',
    buttonText: 'Join Us'
  },
  seo: {
    metaTitle: 'Swiss Alpine Journey | Vacation Rentals in Grächen, Switzerland',
    metaDescription: 'Discover authentic vacation rentals in Grächen, Switzerland. Experience the Swiss Alps with professionally managed chalets and apartments. Book your mountain getaway today.',
    keywords: ['Grächen vacation rentals', 'Swiss Alps accommodation', 'Grächen chalets', 'Switzerland mountain rentals', 'Alpine vacation homes', 'Grächen apartments']
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting homepage migration...');

    // Check if content already exists
    const existing = await client.fetch(`*[_type == "homeSettingsHybrid"][0]`);
    
    if (existing) {
      console.log('✅ Homepage content already exists. Updating...');
      const result = await client
        .patch(existing._id)
        .set(homeContent)
        .commit();
      console.log('✅ Homepage updated successfully!');
      console.log('Document ID:', result._id);
    } else {
      console.log('📝 Creating new homepage content...');
      const result = await client.create(homeContent);
      console.log('✅ Homepage created successfully!');
      console.log('Document ID:', result._id);
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
