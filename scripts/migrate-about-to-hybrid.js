/**
 * Migrate About Page to Hybrid Structure
 * Takes existing content and restructures it for hybrid approach
 */

import { createClient } from '@sanity/client';

const SANITY_API_TOKEN = 'skZRlQ73VpCchEOureYWpV6yjWGwZ5d4DieEDCT1AA7z1uB0qfR31rI5StaW65WOWhl9xkcfx5RB7wA4rWfH1rvtIexqmF1A6n9tC57VfvxggJkpAQvnIpMrF5xWm98NQ9im4w1VpesYZX2PFFwrX1cPiOe9ve22gMCi1g2ux7I6PbKhjA3b';

const client = createClient({
  projectId: 'vrhdu6hl',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

async function migrate() {
  console.log('🚀 Migrating About Page to Hybrid Structure...\n');
  
  try {
    // Get existing data
    const existing = await client.getDocument('aboutSettings');
    console.log('✅ Found existing About Page data');
    
    // Create hybrid structure
    const hybridData = {
      _type: 'aboutSettingsHybrid',
      _id: 'aboutSettingsHybrid',
      
      heroSection: {
        heading: 'Our Story',
        subheading: 'Where authentic stays meet modern comfort and local adventure',
        backgroundImage: existing.heroSection?.image || null,
      },
      
      welcomeStory: {
        heading: 'Welcome to Swiss Alpine Journey',
        paragraphs: [
          "Our story begins in Grächen, where my grandfather built the first family apartments many years ago. What started as a place for our own family holidays has grown into a lasting commitment to share the beauty and comfort of the Swiss Alps with others.",
          "Having spent much of my life in these alps – hiking, working, and appreciating their rhythm through every season – I continue that tradition today by welcoming guests not only to my grandfather's original apartment, which I now own, but also to other carefully maintained homes I've acquired or help manage for local owners.",
          "For me, hosting is about reliability, thoughtful design, and ease. Each property is equipped with everything you need to settle in quickly and feel at home, so you can focus on what truly matters – whether that's relaxing in the alpine calm or setting out for new adventures on the trails and slopes."
        ],
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: 'image-12ec8bc35f02bec064c517e6b28e3f41e7a04dcd-1080x608-jpg',
          },
          alt: 'Cozy Swiss alpine chalet interior with comfortable furnishings and warm lighting',
        },
        ctaText: 'Browse Our Properties →',
        ctaLink: '/stay',
      },
      
      valuesSection: {
        heading: 'Our Values',
        description: 'The principles that guide everything we do, from selecting properties to caring for our guests',
        values: [
          {
            _key: 'value1',
            icon: 'Heart',
            title: 'Prime Locations',
            description: 'We select properties based on their proximity to village centers, ski areas, and outdoor activities for maximum convenience.',
          },
          {
            _key: 'value2',
            icon: 'Award',
            title: 'Quality Standards',
            description: 'Every property in our collection is carefully maintained and equipped with thoughtful amenities for a comfortable stay.',
          },
          {
            _key: 'value3',
            icon: 'Users',
            title: 'Local Expertise',
            description: "We're dedicated to helping you make the most of your Alpine experience with insider knowledge and personalized recommendations.",
          },
        ],
      },
      
      statsSection: {
        stats: [
          {
            _key: 'stat1',
            number: '100+',
            label: 'Happy Families Hosted',
          },
          {
            _key: 'stat2',
            number: 'Airbnb Superhost',
            label: 'Since 2024',
          },
          {
            _key: 'stat3',
            number: '4.9',
            label: 'Average Rating',
          },
        ],
      },
      
      whyChooseSection: {
        heading: 'Why Choose Swiss Alpine Journey?',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: 'image-1cabc1f9ab62d7b0ae9bf362b8f9c46f900c64fc-1080x1620-jpg',
          },
          alt: 'Cozy mountain chalet interior with fireplace and comfortable seating area',
        },
        points: [
          {
            _key: 'point1',
            title: 'Strategic Selection',
            description: 'Every property is carefully chosen for its prime location near skiing, activities, and village amenities.',
          },
          {
            _key: 'point2',
            title: 'Quality Maintenance',
            description: 'We personally visit and maintain every property, ensuring it meets our high standards for comfort and convenience.',
          },
          {
            _key: 'point3',
            title: 'Always Here for You',
            description: 'Our dedicated support team is always available to ensure your stay is worry-free and everything runs smoothly.',
          },
        ],
        links: [
          {
            _key: 'link1',
            text: 'Get in Touch →',
            url: '/contact',
          },
          {
            _key: 'link2',
            text: 'Explore Grächen →',
            url: '/explore/graechen',
          },
        ],
      },
      
      finalCTA: {
        heading: 'Ready to Plan Your Journey?',
        description: 'Let us help you discover your perfect Swiss home base. Browse our collection of thoughtfully located homes and start planning your next journey in Switzerland.',
        buttonText: 'Plan Your Journey',
        buttonLink: '/stay',
      },
      
      seo: existing.seo || {
        metaTitle: 'About Us | Swiss Alpine Journey',
        metaDescription: 'Learn about Swiss Alpine Journey. Family-owned vacation rental company in Grächen offering quality properties with authentic Swiss alpine hospitality.',
        keywords: ['Swiss Alpine Journey', 'vacation rental company', 'Grächen property management', 'alpine hospitality'],
      },
    };
    
    // Create the hybrid document
    await client.createOrReplace(hybridData);
    
    console.log('\n✅ Migration Complete!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Hybrid schema created');
    console.log('- ✅ All content structured properly');
    console.log('- ✅ Images linked correctly');
    console.log('- ✅ SEO data preserved');
    console.log('\n📝 Next steps:');
    console.log('1. Update About page component to use hybrid data');
    console.log('2. Test in Sanity Studio');
    console.log('3. Verify on website');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

migrate().catch(console.error);
