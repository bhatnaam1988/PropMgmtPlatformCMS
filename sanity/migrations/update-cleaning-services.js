/**
 * Migration Script: Update Cleaning Services
 * 
 * Purpose: Remove "Turnover Cleaning" and keep only 3 services
 * - Deep Cleaning
 * - Linen Service
 * - Quality Inspections
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function updateCleaningServices() {
  console.log('🔄 Updating Cleaning Services data...\n');

  try {
    // Fetch existing document
    const existingDoc = await client.fetch(
      `*[_type == "cleaningServicesSettingsHybrid"][0]`
    );

    if (!existingDoc) {
      console.log('❌ No cleaning services document found. Creating new one...');
    }

    const updatedData = {
      _type: 'cleaningServicesSettingsHybrid',
      heroSection: {
        heading: 'Professional Cleaning Services',
        description: 'Maintain your vacation rental to the highest standards with our comprehensive cleaning services.',
        backgroundImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: 'image-placeholder' // Will use URL fallback in code
          }
        }
      },
      servicesGrid: {
        services: [
          {
            _key: 'deep-cleaning',
            title: 'Deep Cleaning',
            description: 'Comprehensive seasonal cleaning including windows, appliances, and detailed sanitization'
          },
          {
            _key: 'linen-service',
            title: 'Linen Service',
            description: 'Professional laundering, ironing, and fresh linen setup for each guest arrival'
          },
          {
            _key: 'quality-inspections',
            title: 'Quality Inspections',
            description: 'Post-cleaning inspection to ensure everything meets our high standards before guest check-in'
          }
        ]
      },
      benefitsSection: {
        heading: 'Why Choose Our Cleaning Services',
        benefits: [
          {
            _key: 'expertise',
            title: 'Hospitality Expertise',
            description: 'Specialized in vacation rentals with years of experience'
          },
          {
            _key: 'reliable',
            title: 'Reliable & Consistent',
            description: 'Same high standards maintained every time'
          },
          {
            _key: 'eco-friendly',
            title: 'Eco-Friendly Products',
            description: 'Safe for guests and the environment'
          },
          {
            _key: 'flexible',
            title: 'Flexible Scheduling',
            description: 'Quick turnarounds available for your convenience'
          }
        ]
      },
      pricingSection: {
        heading: 'Transparent Pricing',
        description: 'Get a custom quote tailored to your property size and cleaning needs. Contact us for detailed pricing.'
      },
      formSection: {
        heading: 'Request a Quote',
        description: 'Get a custom quote for your cleaning needs. Fill out the form below and we\'ll get back to you within 24 hours.'
      }
    };

    let result;
    if (existingDoc) {
      // Update existing document
      result = await client
        .patch(existingDoc._id)
        .set(updatedData)
        .commit();
      console.log('✅ Updated existing cleaning services document');
    } else {
      // Create new document
      result = await client.create(updatedData);
      console.log('✅ Created new cleaning services document');
    }

    console.log('\n📊 Updated Services:');
    updatedData.servicesGrid.services.forEach((service, idx) => {
      console.log(`   ${idx + 1}. ${service.title}: ${service.description}`);
    });

    console.log('\n✅ Migration completed successfully!');
    console.log(`Document ID: ${result._id}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
updateCleaningServices()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
