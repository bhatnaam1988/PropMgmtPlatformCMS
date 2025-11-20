import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function populateContactSettings() {
  console.log('Populating Contact Settings...');
  
  const contactData = {
    _type: 'contactSettingsHybrid',
    _id: 'contactSettingsHybrid',
    heroSection: {
      heading: 'Get in Touch',
      description: 'Have questions about our properties or services? We\'re here to help make your Alpine getaway perfect.'
    },
    contactInfo: {
      email: 'info@swissalpinejourney.com',
      phone: '+41 XX XXX XX XX',
      address: 'Grächen, Valais, Switzerland'
    },
    hoursSection: {
      heading: 'Office Hours',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed'
    },
    formSection: {
      heading: 'Send Us a Message',
      description: 'Fill out the form below and we\'ll get back to you within 24 hours.'
    }
  };

  try {
    await client.createOrReplace(contactData);
    console.log('✅ Contact Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Contact Settings:', error.message);
  }
}

async function populateCleaningServicesSettings() {
  console.log('Populating Cleaning Services Settings...');
  
  const cleaningData = {
    _type: 'cleaningServicesSettingsHybrid',
    _id: 'cleaningServicesSettingsHybrid',
    heroSection: {
      heading: 'Professional Property Cleaning',
      description: 'Premium cleaning services for vacation rentals in Grächen. Maintain 5-star standards for your guests with our thorough, reliable service.'
    },
    servicesGrid: {
      services: [
        {
          title: 'Turnover Cleaning',
          description: 'Complete cleaning between guest stays including linens, bathrooms, kitchen, and all living areas'
        },
        {
          title: 'Deep Cleaning',
          description: 'Comprehensive seasonal cleaning including windows, appliances, and detailed sanitization'
        },
        {
          title: 'Linen Service',
          description: 'Professional laundering, ironing, and fresh linen setup for each guest arrival'
        },
        {
          title: 'Quality Inspections',
          description: 'Post-cleaning inspection to ensure everything meets our high standards before guest check-in'
        }
      ]
    },
    benefitsSection: {
      heading: 'Why Choose Our Cleaning Service',
      benefits: [
        {
          title: 'Local Team',
          description: 'Experienced cleaners who know Grächen properties and Alpine accommodation standards'
        },
        {
          title: 'Reliable Scheduling',
          description: 'Flexible timing to accommodate back-to-back bookings and tight turnarounds'
        },
        {
          title: 'Eco-Friendly Products',
          description: 'High-quality, environmentally responsible cleaning products safe for guests and properties'
        }
      ]
    },
    pricingSection: {
      heading: 'Transparent Pricing',
      description: 'Competitive rates based on property size and service frequency. Contact us for a customized quote.'
    },
    formSection: {
      heading: 'Request a Quote',
      description: 'Tell us about your property and cleaning needs, and we\'ll provide a detailed quote within 24 hours.'
    }
  };

  try {
    await client.createOrReplace(cleaningData);
    console.log('✅ Cleaning Services Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Cleaning Services Settings:', error.message);
  }
}

async function populateRentalServicesSettings() {
  console.log('Populating Rental Services Settings...');
  
  const rentalData = {
    _type: 'rentalServicesSettingsHybrid',
    _id: 'rentalServicesSettingsHybrid',
    heroSection: {
      heading: 'Full-Service Rental Management',
      description: 'Maximize your rental income while we handle everything. Professional management for vacation properties in Grächen and the Swiss Alps.'
    },
    servicesGrid: {
      services: [
        {
          title: 'Guest Communication',
          description: 'Handle all inquiries, bookings, and guest communication in multiple languages'
        },
        {
          title: 'Property Marketing',
          description: 'Professional photography, compelling listings, and promotion across major booking platforms'
        },
        {
          title: 'Pricing Optimization',
          description: 'Dynamic pricing strategy to maximize occupancy and revenue throughout the year'
        },
        {
          title: 'Maintenance Coordination',
          description: 'Regular inspections, repairs, and maintenance to keep your property in top condition'
        },
        {
          title: 'Cleaning Services',
          description: 'Professional turnover cleaning and linen service between each guest stay'
        },
        {
          title: 'Financial Reporting',
          description: 'Transparent monthly reports with detailed income, expenses, and occupancy analytics'
        }
      ]
    },
    benefitsSection: {
      heading: 'The Swiss Alpine Journey Difference',
      benefits: [
        {
          title: 'Local Expertise',
          description: 'Deep knowledge of Grächen market, local regulations, and what guests expect from Alpine properties'
        },
        {
          title: 'Premium Service',
          description: 'We treat every property like our own, maintaining high standards that drive excellent guest reviews'
        },
        {
          title: 'Transparent Fees',
          description: 'Simple commission-based pricing with no hidden costs. You only pay when you earn'
        },
        {
          title: 'Owner Portal',
          description: 'Real-time access to bookings, earnings, and property status through our owner dashboard'
        }
      ]
    },
    formSection: {
      heading: 'Partner With Us',
      description: 'Interested in our rental management services? Tell us about your property and we\'ll schedule a consultation to discuss how we can help maximize your rental income.'
    }
  };

  try {
    await client.createOrReplace(rentalData);
    console.log('✅ Rental Services Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Rental Services Settings:', error.message);
  }
}

async function populateJobsSettings() {
  console.log('Populating Jobs Settings...');
  
  const jobsData = {
    _type: 'jobsSettingsHybrid',
    _id: 'jobsSettingsHybrid',
    heroSection: {
      heading: 'Join Our Team',
      description: 'Help us create exceptional Alpine experiences for guests from around the world. We\'re always looking for passionate, reliable people to join our growing team in Grächen.'
    },
    valuesSection: {
      values: [
        {
          title: 'Guest-Focused',
          description: 'We believe every guest deserves an exceptional experience, and we empower our team to make that happen'
        },
        {
          title: 'Local Community',
          description: 'As part of the Grächen community, we support local businesses and sustainable Alpine tourism'
        },
        {
          title: 'Growth & Development',
          description: 'We invest in our team with training opportunities and clear paths for career advancement'
        }
      ]
    },
    openPositionsSection: {
      heading: 'Open Positions',
      positions: [
        {
          title: 'Property Cleaner',
          location: 'Grächen',
          type: 'Part-time',
          description: 'Join our cleaning team to maintain our properties to 5-star standards. Flexible hours, competitive pay, and work in beautiful Alpine settings.'
        },
        {
          title: 'Guest Services Coordinator',
          location: 'Grächen / Remote',
          type: 'Full-time',
          description: 'Handle guest communications, coordinate check-ins, and ensure smooth operations. Fluent English required, German or French a plus.'
        }
      ]
    },
    applicationSection: {
      heading: 'How to Apply',
      description: 'Interested in joining our team? Send your CV and a brief introduction to careers@swissalpinejourney.com',
      footerText: 'We review all applications and will contact you if your experience matches our current needs.'
    }
  };

  try {
    await client.createOrReplace(jobsData);
    console.log('✅ Jobs Settings populated successfully');
  } catch (error) {
    console.error('❌ Error populating Jobs Settings:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting population of remaining schemas...\n');
  
  await populateContactSettings();
  await populateCleaningServicesSettings();
  await populateRentalServicesSettings();
  await populateJobsSettings();
  
  console.log('\n✅ All remaining schemas populated successfully!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
