const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const cleaningContent = {
  _type: 'cleaningServicesSettingsHybrid',
  heroSection: {
    heading: 'Professional Cleaning Services',
    description: 'Maintain your vacation rental to the highest standards with our comprehensive cleaning services tailored for the hospitality industry.',
    backgroundImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-220f806ce2bd85a334b765641cdba1227563b1c0-1920x1280-jpg'
      },
      alt: 'Professional cleaning service in modern vacation rental'
    }
  },
  servicesGrid: {
    services: [
      {
        title: 'Turnover Cleaning',
        description: 'Complete cleaning between guest stays including linens, kitchen, bathrooms, and all living spaces. Ready for your next guests.'
      },
      {
        title: 'Deep Cleaning',
        description: 'Thorough seasonal deep cleaning covering all areas including hard-to-reach spots, appliances, and detailed sanitization.'
      },
      {
        title: 'Laundry Service',
        description: 'Professional washing, drying, and folding of all linens, towels, and bedding with eco-friendly detergents.'
      },
      {
        title: 'Inspection Reports',
        description: 'Detailed post-cleaning inspection reports with photos, noting any maintenance needs or damages.'
      },
      {
        title: 'Restocking',
        description: 'Replenishment of essential supplies including toiletries, kitchen basics, and cleaning products.'
      },
      {
        title: 'Emergency Cleaning',
        description: 'Same-day emergency cleaning services for unexpected situations or last-minute bookings.'
      }
    ]
  },
  whyChooseSection: {
    heading: 'Why Choose Our Cleaning Services',
    reasons: [
      {
        title: 'Hospitality Expertise',
        description: 'Specialized in vacation rental cleaning with understanding of guest expectations and host requirements.'
      },
      {
        title: 'Reliable & Consistent',
        description: 'Professional team committed to the same high standards for every clean, every time.'
      },
      {
        title: 'Eco-Friendly Products',
        description: 'Using environmentally responsible cleaning products safe for guests and the Alpine environment.'
      },
      {
        title: 'Flexible Scheduling',
        description: 'Work around your booking calendar with quick turnarounds and last-minute availability.'
      }
    ]
  },
  formSection: {
    heading: 'Request a Quote',
    description: 'Get a custom quote for your vacation rental cleaning needs. We\'ll respond within 24 hours.'
  },
  seo: {
    metaTitle: 'Professional Cleaning Services | Swiss Alpine Journey Vacation Rentals',
    metaDescription: 'Expert vacation rental cleaning services in Grächen. Professional turnover cleaning, deep cleaning, laundry, and restocking for hospitality properties.',
    keywords: ['vacation rental cleaning Grächen', 'professional property cleaning', 'turnover cleaning service', 'hospitality cleaning Switzerland', 'Airbnb cleaning Grächen']
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting cleaning services migration...');

    const existing = await client.fetch(`*[_type == "cleaningServicesSettingsHybrid"][0]`);
    
    if (existing) {
      console.log('✅ Cleaning services content already exists. Updating...');
      const result = await client
        .patch(existing._id)
        .set(cleaningContent)
        .commit();
      console.log('✅ Cleaning services updated successfully!');
    } else {
      console.log('📝 Creating new cleaning services content...');
      const result = await client.create(cleaningContent);
      console.log('✅ Cleaning services created successfully!');
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
