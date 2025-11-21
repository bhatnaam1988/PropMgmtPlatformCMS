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
        heading: 'Property Management Services',
        description: 'Maximize your rental income while we handle everything from guest communication to property maintenance.',
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
            _key: 'listing-optimization',
            title: 'Listing Optimization',
            description: 'Professional photography, compelling descriptions, and strategic pricing to maximize visibility and bookings'
          },
          {
            _key: 'guest-communication',
            title: 'Guest Communication',
            description: '24/7 guest support handling inquiries, bookings, and ensuring excellent customer experience'
          },
          {
            _key: 'cleaning-maintenance',
            title: 'Cleaning & Maintenance',
            description: 'Coordinated cleaning services and property care to maintain high standards between guest stays'
          },
          {
            _key: 'revenue-management',
            title: 'Revenue Management',
            description: 'Dynamic pricing strategies based on demand, seasonality, and market trends to maximize income'
          },
          {
            _key: 'marketing',
            title: 'Marketing',
            description: 'Multi-platform listing management across Airbnb, Booking.com, and other major vacation rental platforms'
          },
          {
            _key: 'financial-reporting',
            title: 'Financial Reporting',
            description: 'Detailed monthly reports with income breakdown, expenses, and performance analytics'
          }
        ]
      },
      benefitsSection: {
        heading: 'Benefits of Professional Management',
        benefits: [
          {
            _key: 'hands-free',
            title: 'Hands-Free Operation',
            description: 'We handle all aspects of property management so you can enjoy passive income without the hassle'
          },
          {
            _key: 'higher-occupancy',
            title: 'Higher Occupancy',
            description: 'Professional management typically results in 30-50% increase in bookings and revenue'
          },
          {
            _key: 'better-reviews',
            title: 'Better Reviews',
            description: '5-star service quality ensures excellent guest reviews and improved property reputation'
          },
          {
            _key: 'property-care',
            title: 'Property Care',
            description: 'Regular maintenance and inspections keep your property in top condition and protect your investment'
          }
        ]
      },
      formSection: {
        heading: 'Partner With Us',
        description: "Let's discuss how we can maximize your rental income. Fill out the form below and we'll contact you within 24 hours to schedule a consultation."
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
