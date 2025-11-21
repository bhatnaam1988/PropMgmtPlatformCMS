// Simple script to create Rental Services document in Sanity
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const documentData = {
  _type: 'rentalServicesSettingsHybrid',
  heroSection: {
    heading: 'Full-Service Rental Management',
    description: 'Maximize your rental income while we handle everything. Professional management for vacation properties in Grächen and the Swiss Alps.'
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

async function createDocument() {
  try {
    console.log('Creating Rental Services document in Sanity...');
    
    // Check if document already exists
    const existing = await client.fetch('*[_type == "rentalServicesSettingsHybrid"][0]');
    
    if (existing) {
      console.log('Document already exists! Updating instead...');
      const result = await client.patch(existing._id).set(documentData).commit();
      console.log('✅ Document updated successfully!');
      console.log('Document ID:', result._id);
      return;
    }
    
    // Create new document
    const result = await client.create(documentData);
    console.log('✅ Document created successfully!');
    console.log('Document ID:', result._id);
    console.log('Services count:', result.servicesGrid.services.length);
    console.log('Benefits count:', result.benefitsSection.benefits.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

createDocument();
