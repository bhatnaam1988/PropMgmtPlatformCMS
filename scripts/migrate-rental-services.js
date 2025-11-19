const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const rentalContent = {
  _type: 'rentalServicesSettingsHybrid',
  heroSection: {
    heading: 'Property Management Services',
    description: 'Maximize your rental income while we handle everything. Full-service property management for vacation rentals in Grächen.',
    backgroundImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-4381f85d976dd4bf0287fc3a7fc390e3a03cce11-1920x1442-jpg'
      },
      alt: 'Beautiful Swiss Alpine chalet managed as vacation rental'
    }
  },
  servicesGrid: {
    services: [
      {
        title: 'Listing Optimization',
        description: 'Professional photography, compelling descriptions, and strategic pricing to maximize bookings and revenue.'
      },
      {
        title: 'Guest Communication',
        description: '24/7 guest support handling inquiries, bookings, check-ins, and any issues during stays.'
      },
      {
        title: 'Cleaning & Maintenance',
        description: 'Coordinated professional cleaning and preventive maintenance to keep your property in top condition.'
      },
      {
        title: 'Revenue Management',
        description: 'Dynamic pricing strategies and calendar management to optimize occupancy and maximize income.'
      },
      {
        title: 'Marketing',
        description: 'Multi-platform listing across Airbnb, Booking.com, and direct channels for maximum exposure.'
      },
      {
        title: 'Financial Reporting',
        description: 'Detailed monthly reports on bookings, revenue, expenses, and performance analytics.'
      }
    ]
  },
  benefitsSection: {
    heading: 'Benefits of Professional Management',
    benefits: [
      {
        title: 'Hands-Free Operation',
        description: 'We handle everything while you enjoy passive income from your property investment.'
      },
      {
        title: 'Higher Occupancy',
        description: 'Professional management typically increases bookings by 30-50% compared to self-management.'
      },
      {
        title: 'Better Guest Reviews',
        description: 'Professional service leads to 5-star reviews, improving your listing ranking and bookability.'
      },
      {
        title: 'Property Care',
        description: 'Regular inspections and immediate maintenance prevent small issues from becoming costly repairs.'
      }
    ]
  },
  formSection: {
    heading: 'Partner With Us',
    description: 'Interested in professional management for your Grächen property? Let\'s discuss how we can maximize your rental income.'
  },
  seo: {
    metaTitle: 'Property Management Services | Swiss Alpine Journey Grächen Rentals',
    metaDescription: 'Full-service vacation rental management in Grächen. Maximize your rental income with professional property management, guest services, and marketing.',
    keywords: ['vacation rental management Grächen', 'property management Switzerland', 'Airbnb management Grächen', 'rental income optimization', 'Swiss Alps property management']
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting rental services migration...');

    const existing = await client.fetch(`*[_type == "rentalServicesSettingsHybrid"][0]`);
    
    if (existing) {
      console.log('✅ Rental services content already exists. Updating...');
      const result = await client
        .patch(existing._id)
        .set(rentalContent)
        .commit();
      console.log('✅ Rental services updated successfully!');
    } else {
      console.log('📝 Creating new rental services content...');
      const result = await client.create(rentalContent);
      console.log('✅ Rental services created successfully!');
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
