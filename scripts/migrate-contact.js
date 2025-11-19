const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const contactContent = {
  _type: 'contactSettingsHybrid',
  heroSection: {
    heading: 'Get in Touch',
    description: 'Have questions about our properties or services? We\'re here to help make your Swiss Alpine experience unforgettable.'
  },
  contactInfo: {
    phone: '+41 27 956 XX XX',
    email: 'hello@swissalpinejourney.com',
    whatsapp: '+41 79 XXX XX XX',
    responseTime: 'We usually respond within 24 hours'
  },
  formSection: {
    heading: 'Send us a message'
  },
  seo: {
    metaTitle: 'Contact Us | Swiss Alpine Journey - Vacation Rentals in Grächen',
    metaDescription: 'Get in touch with Swiss Alpine Journey for inquiries about vacation rentals, property management, or booking assistance in Grächen, Switzerland.',
    keywords: ['contact Swiss Alpine Journey', 'Grächen vacation rental contact', 'Swiss Alps property inquiry', 'vacation rental support', 'Grächen accommodation help']
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting contact page migration...');

    const existing = await client.fetch(`*[_type == "contactSettingsHybrid"][0]`);
    
    if (existing) {
      console.log('✅ Contact content already exists. Updating...');
      const result = await client
        .patch(existing._id)
        .set(contactContent)
        .commit();
      console.log('✅ Contact page updated successfully!');
    } else {
      console.log('📝 Creating new contact content...');
      const result = await client.create(contactContent);
      console.log('✅ Contact page created successfully!');
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
