/**
 * Migration Script: Restore Rental Services Document
 * 
 * This script recreates the rental services document from fallback data
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

async function restoreRentalServices() {
  console.log('🔄 Restoring Rental Services document...\n');

  try {
    // Check if document already exists
    const existing = await client.fetch(
      `*[_type == "rentalServicesSettingsHybrid"][0]`
    );

    if (existing) {
      console.log('⚠️  Document already exists!');
      console.log('Document ID:', existing._id);
      console.log('\nDo you want to update it? (You can modify this script to update)');
      return;
    }

    console.log('📝 Creating new Rental Services document...');

    const documentData = {
      _type: 'rentalServicesSettingsHybrid',
      heroSection: {
        heading: 'Full-Service Rental Management',
        description: 'Maximize your rental income while we handle everything. Professional management for vacation properties in Grächen and the Swiss Alps.',
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
            _key: 'guest-communication',
            title: 'Guest Communication',
            description: 'Handle all inquiries, bookings, and guest communication in multiple languages'
          },
          {
            _key: 'property-marketing',
            title: 'Property Marketing',
            description: 'Professional photography, compelling listings, and promotion across major booking platforms'
          },
          {
            _key: 'pricing-optimization',
            title: 'Pricing Optimization',
            description: 'Dynamic pricing strategy to maximize occupancy and revenue throughout the year'
          },
          {
            _key: 'maintenance-coordination',
            title: 'Maintenance Coordination',
            description: 'Regular inspections, repairs, and maintenance to keep your property in top condition'
          },
          {
            _key: 'cleaning-services',
            title: 'Cleaning Services',
            description: 'Professional turnover cleaning and linen service between each guest stay'
          },
          {
            _key: 'financial-reporting',
            title: 'Financial Reporting',
            description: 'Transparent monthly reports with detailed income, expenses, and occupancy analytics'
          }
        ]
      },
      benefitsSection: {
        heading: 'The Swiss Alpine Journey Difference',
        benefits: [
          {
            _key: 'local-expertise',
            title: 'Local Expertise',
            description: 'Deep knowledge of Grächen market, local regulations, and what guests expect from Alpine properties'
          },
          {
            _key: 'premium-service',
            title: 'Premium Service',
            description: 'We treat every property like our own, maintaining high standards that drive excellent guest reviews'
          },
          {
            _key: 'transparent-fees',
            title: 'Transparent Fees',
            description: 'Simple commission-based pricing with no hidden costs. You keep more of your rental income'
          },
          {
            _key: 'owner-portal',
            title: 'Owner Portal',
            description: 'Real-time access to bookings, earnings, and property performance through your dedicated dashboard'
          }
        ]
      },
      formSection: {
        heading: 'Partner With Us',
        description: 'Interested in our rental management services? Tell us about your property and we\'ll schedule a consultation to discuss how we can help maximize your rental income.'
      }
    };

    const result = await client.create(documentData);

    console.log('✅ Successfully created Rental Services document!');
    console.log('\n📊 Document Details:');
    console.log('   ID:', result._id);
    console.log('   Type:', result._type);
    console.log('   Services count:', result.servicesGrid.services.length);
    console.log('   Benefits count:', result.benefitsSection.benefits.length);

    console.log('\n✅ Migration completed successfully!');
    console.log('Please refresh Sanity Studio to see the restored document.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
restoreRentalServices()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to restore:', error);
    process.exit(1);
  });
