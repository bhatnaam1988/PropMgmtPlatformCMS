const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const jobsContent = {
  _type: 'jobsSettingsHybrid',
  heroSection: {
    heading: 'Join Our Team',
    description: 'Build your career in the heart of the Swiss Alps. We\'re always looking for passionate individuals who love hospitality and mountain life.',
    backgroundImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-d18c64bee731b78ce47bc1bb2ee42dbf2a49e900-1920x2879-jpg'
      },
      alt: 'Team meeting in Swiss Alpine office'
    }
  },
  valuesSection: {
    values: [
      {
        title: 'Guest-Focused',
        description: 'We believe exceptional hospitality creates unforgettable experiences and lasting memories.'
      },
      {
        title: 'Team Spirit',
        description: 'Collaboration and mutual support make us stronger and our work more enjoyable.'
      },
      {
        title: 'Quality Standards',
        description: 'We\'re committed to excellence in every detail, from property care to guest communication.'
      },
      {
        title: 'Alpine Living',
        description: 'Work-life balance matters. Enjoy the mountains, fresh air, and outdoor activities year-round.'
      }
    ]
  },
  openPositionsSection: {
    heading: 'Current Openings',
    positions: [
      {
        title: 'Property Manager',
        location: 'Grächen, Switzerland',
        type: 'Full-time',
        description: 'Oversee daily operations of vacation rental portfolio including guest relations, vendor coordination, and quality control.'
      },
      {
        title: 'Cleaning Team Member',
        location: 'Grächen, Switzerland',
        type: 'Part-time / Seasonal',
        description: 'Join our professional cleaning team ensuring properties meet the highest standards for incoming guests.'
      },
      {
        title: 'Guest Services Coordinator',
        location: 'Remote / Grächen',
        type: 'Full-time',
        description: 'Manage guest communications, bookings, and inquiries across multiple platforms with focus on excellent service.'
      }
    ]
  },
  applicationSection: {
    heading: 'Apply Now',
    description: 'Don\'t see the right position? We\'re always interested in meeting talented people. Send us your CV and tell us why you\'d be a great fit.',
    footerText: 'We\'ll review your application and get back to you within 5 business days.'
  },
  seo: {
    metaTitle: 'Careers at Swiss Alpine Journey | Join Our Team in Grächen',
    metaDescription: 'Explore career opportunities with Swiss Alpine Journey. Join our hospitality team in the Swiss Alps. Property management, guest services, and cleaning positions available.',
    keywords: ['jobs Grächen Switzerland', 'hospitality careers Swiss Alps', 'vacation rental jobs', 'property management careers', 'work in Grächen']
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting jobs page migration...');

    const existing = await client.fetch(`*[_type == "jobsSettingsHybrid"][0]`);
    
    if (existing) {
      console.log('✅ Jobs content already exists. Updating...');
      const result = await client
        .patch(existing._id)
        .set(jobsContent)
        .commit();
      console.log('✅ Jobs page updated successfully!');
    } else {
      console.log('📝 Creating new jobs content...');
      const result = await client.create(jobsContent);
      console.log('✅ Jobs page created successfully!');
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
