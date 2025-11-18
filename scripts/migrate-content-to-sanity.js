/**
 * Content Migration Script
 * Migrates existing hardcoded content into Sanity CMS
 * 
 * Run with: node scripts/migrate-content-to-sanity.js
 */

import { createClient } from '@sanity/client';

// Read env variables directly
const SANITY_API_TOKEN = 'skZRlQ73VpCchEOureYWpV6yjWGwZ5d4DieEDCT1AA7z1uB0qfR31rI5StaW65WOWhl9xkcfx5RB7wA4rWfH1rvtIexqmF1A6n9tC57VfvxggJkpAQvnIpMrF5xWm98NQ9im4w1VpesYZX2PFFwrX1cPiOe9ve22gMCi1g2ux7I6PbKhjA3b';

const client = createClient({
  projectId: 'vrhdu6hl',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

// Homepage Content
const homeSettings = {
  _type: 'homeSettings',
  _id: 'homeSettings',
  title: 'Swiss Alpine Journey - Vacation Rentals in Grächen',
  heroSection: {
    heading: 'Swiss Alpine Journey',
    subheading: 'Where authentic stays meet modern comfort and local adventure',
  },
  featuredSection: {
    heading: 'Our listings',
    description: 'Discover our handpicked collection of vacation rentals in the heart of the Swiss Alps',
  },
  seo: {
    metaTitle: 'Swiss Alpine Journey | Vacation Rentals in Grächen',
    metaDescription: 'Discover authentic Swiss Alpine vacation rentals in Grächen. Quality properties with modern comfort, stunning mountain views, and convenient locations.',
    keywords: ['Grächen vacation rentals', 'Swiss Alps accommodation', 'mountain chalet rental', 'Valais holiday homes', 'ski chalet Grächen'],
  },
};

// About Page Content
const aboutSettings = {
  _type: 'aboutSettings',
  _id: 'aboutSettings',
  title: 'About Us',
  heroSection: {
    heading: 'About Swiss Alpine Journey',
    subheading: 'Your trusted partner for authentic Alpine experiences in Grächen',
  },
  content: [
    {
      _key: 'text1',
      _type: 'textBlock',
      heading: 'Our Story',
      text: [
        {
          _key: 'p1',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'span1',
              _type: 'span',
              text: 'Swiss Alpine Journey was born from a passion for the Swiss Alps and a desire to share the magic of Grächen with travelers from around the world. As a family-owned business, we understand the importance of creating memorable experiences and providing a home away from home.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: 'text2',
      _type: 'textBlock',
      heading: 'Our Mission',
      text: [
        {
          _key: 'p2',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'span2',
              _type: 'span',
              text: 'We are committed to providing exceptional vacation rental experiences that combine authentic Alpine charm with modern comfort. Every property in our collection is carefully selected and maintained to ensure your stay exceeds expectations.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: 'features1',
      _type: 'featureGrid',
      heading: 'Why Choose Us',
      columns: 3,
      features: [
        {
          _key: 'f1',
          icon: 'Home',
          title: 'Quality Properties',
          description: 'Handpicked vacation rentals with modern amenities and Alpine character',
        },
        {
          _key: 'f2',
          icon: 'Users',
          title: 'Local Expertise',
          description: 'In-depth knowledge of Grächen and personalized recommendations',
        },
        {
          _key: 'f3',
          icon: 'Heart',
          title: 'Personal Touch',
          description: 'Family-owned business dedicated to your comfort and satisfaction',
        },
      ],
    },
  ],
  seo: {
    metaTitle: 'About Us | Swiss Alpine Journey',
    metaDescription: 'Learn about Swiss Alpine Journey. Family-owned vacation rental company in Grächen offering quality properties with authentic Swiss alpine hospitality.',
    keywords: ['Swiss Alpine Journey', 'vacation rental company', 'Grächen property management', 'alpine hospitality'],
  },
};

// Contact Page Content
const contactSettings = {
  _type: 'contactSettings',
  _id: 'contactSettings',
  title: 'Contact Us',
  heroSection: {
    heading: 'Get in Touch',
    subheading: "We're here to help plan your perfect Alpine getaway",
  },
  contactInfo: {
    email: 'info@swissalpinejourney.com',
    phone: '+41 XX XXX XX XX',
    address: 'Grächen\nValais, Switzerland',
    hoursOfOperation: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
  },
  formSettings: {
    heading: 'Send Us a Message',
    description: "Have questions about our properties or planning your stay? Fill out the form below and we'll get back to you within 24 hours.",
    submitButtonText: 'Send Message',
  },
  seo: {
    metaTitle: 'Contact Us | Swiss Alpine Journey',
    metaDescription: "Get in touch with Swiss Alpine Journey. Whether you're planning your stay or interested in property management services, we're here to help.",
    keywords: ['contact Swiss Alpine Journey', 'vacation rental inquiry', 'booking assistance', 'property management'],
  },
};

// Cleaning Services Content
const cleaningServicesSettings = {
  _type: 'servicePageSettings',
  _id: 'cleaning-services',
  pageType: 'cleaning',
  title: 'Professional Cleaning Services',
  slug: {
    _type: 'slug',
    current: 'cleaning-services',
  },
  heroSection: {
    heading: 'Professional Cleaning Services',
    subheading: 'Maintaining the highest standards for vacation rentals in Grächen',
  },
  content: [
    {
      _key: 'text1',
      _type: 'textBlock',
      heading: 'Excellence in Vacation Rental Cleaning',
      text: [
        {
          _key: 'p1',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'span1',
              _type: 'span',
              text: "Our professional cleaning services ensure your vacation rental is always guest-ready. We understand the importance of cleanliness in creating exceptional guest experiences and maintaining your property's reputation.",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
  features: [
    {
      _key: 'f1',
      title: 'Turnover Cleaning',
      description: 'Complete cleaning between guests including all rooms, bathrooms, kitchen, and common areas',
      icon: 'Sparkles',
    },
    {
      _key: 'f2',
      title: 'Deep Cleaning',
      description: 'Thorough seasonal cleaning covering every detail of your property',
      icon: 'CheckCircle',
    },
    {
      _key: 'f3',
      title: 'Eco-Friendly Products',
      description: 'Professional-grade, environmentally friendly cleaning solutions',
      icon: 'Leaf',
    },
    {
      _key: 'f4',
      title: 'Quality Inspection',
      description: 'Every cleaning is inspected to ensure our high standards are met',
      icon: 'Shield',
    },
  ],
  formSettings: {
    heading: 'Request Cleaning Services',
    description: "Let us know your cleaning needs and we'll provide a customized quote",
  },
  seo: {
    metaTitle: 'Professional Cleaning Services | Swiss Alpine Journey',
    metaDescription: 'Professional cleaning services for vacation rentals in Grächen. Turnover cleaning, deep cleaning, and recurring services. Reliable, quality service.',
    keywords: ['vacation rental cleaning', 'professional cleaning Grächen', 'turnover cleaning', 'property cleaning services'],
  },
};

// Rental Services Content
const rentalServicesSettings = {
  _type: 'servicePageSettings',
  _id: 'rental-services',
  pageType: 'rental',
  title: 'Rental Property Management',
  slug: {
    _type: 'slug',
    current: 'rental-services',
  },
  heroSection: {
    heading: 'Rental Property Management',
    subheading: 'Maximize your rental income with professional property management services',
  },
  content: [
    {
      _key: 'text1',
      _type: 'textBlock',
      heading: 'Full-Service Property Management',
      text: [
        {
          _key: 'p1',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'span1',
              _type: 'span',
              text: "Let us handle every aspect of your vacation rental while you enjoy consistent income and peace of mind. Our comprehensive management services are designed to maximize your property's potential.",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
  features: [
    {
      _key: 'f1',
      title: 'Listing Management',
      description: 'Professional photos, compelling descriptions, and optimization across all major booking platforms',
      icon: 'Image',
    },
    {
      _key: 'f2',
      title: 'Guest Communication',
      description: '24/7 guest support, booking management, and coordination of check-ins',
      icon: 'MessageSquare',
    },
    {
      _key: 'f3',
      title: 'Cleaning Coordination',
      description: 'Scheduled professional cleaning between each guest stay',
      icon: 'Calendar',
    },
    {
      _key: 'f4',
      title: 'Maintenance Support',
      description: 'Regular property inspections and coordination of repairs and maintenance',
      icon: 'Wrench',
    },
  ],
  formSettings: {
    heading: 'List Your Property',
    description: "Interested in listing your property with us? Share your details and we'll be in touch",
  },
  seo: {
    metaTitle: 'Rental Property Management | Swiss Alpine Journey',
    metaDescription: 'Professional vacation rental management services in Grächen. Listing optimization, cleaning coordination, and booking management for property owners.',
    keywords: ['property management Grächen', 'vacation rental management', 'Airbnb management', 'rental listing services'],
  },
};

// Jobs Page Content
const jobsSettings = {
  _type: 'jobsSettings',
  _id: 'jobsSettings',
  title: 'Careers at Swiss Alpine Journey',
  heroSection: {
    heading: 'Join Our Team',
    subheading: 'Help us create unforgettable Alpine experiences',
  },
  content: [
    {
      _key: 'text1',
      _type: 'textBlock',
      heading: 'Work With Us',
      text: [
        {
          _key: 'p1',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'span1',
              _type: 'span',
              text: "Join a passionate team dedicated to providing exceptional vacation rental experiences in the Swiss Alps. We're always looking for talented individuals who share our values of quality, hospitality, and authenticity.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: 'features1',
      _type: 'featureGrid',
      heading: 'Why Work With Us',
      columns: 3,
      features: [
        {
          _key: 'f1',
          icon: 'Mountain',
          title: 'Alpine Lifestyle',
          description: "Live and work in one of Switzerland's most beautiful mountain villages",
        },
        {
          _key: 'f2',
          icon: 'Users',
          title: 'Great Team',
          description: 'Join a supportive, friendly team that values collaboration',
        },
        {
          _key: 'f3',
          icon: 'TrendingUp',
          title: 'Growth Opportunities',
          description: 'Develop your skills and advance your career with us',
        },
      ],
    },
  ],
  jobOpenings: [
    {
      _key: 'job1',
      title: 'Property Manager',
      department: 'Operations',
      location: 'Grächen, Switzerland',
      type: 'full-time',
      description: 'Oversee property maintenance, guest relations, and ensure high standards across our vacation rental portfolio. Ideal candidate has hospitality experience and excellent organizational skills.',
    },
    {
      _key: 'job2',
      title: 'Cleaning Specialist',
      department: 'Housekeeping',
      location: 'Grächen, Switzerland',
      type: 'part-time',
      description: 'Join our professional cleaning team ensuring vacation rentals meet our high standards. Attention to detail and reliability are essential.',
    },
  ],
  applicationFormSettings: {
    heading: 'Apply Now',
    description: 'Interested in joining our team? Fill out the application form below or email your CV to careers@swissalpinejourney.com',
  },
  seo: {
    metaTitle: 'Careers | Swiss Alpine Journey',
    metaDescription: 'Join the Swiss Alpine Journey team. Explore career opportunities in vacation rental management, cleaning services, and guest services in Grächen.',
    keywords: ['vacation rental jobs', 'careers Grächen', 'hospitality jobs Switzerland', 'property management careers'],
  },
};

// Migration function
async function migrateContent() {
  console.log('🚀 Starting content migration to Sanity...\n');

  try {
    // Create Homepage Settings
    console.log('📄 Creating Homepage Settings...');
    await client.createOrReplace(homeSettings);
    console.log('✅ Homepage Settings created\n');

    // Create About Page Settings
    console.log('📄 Creating About Page Settings...');
    await client.createOrReplace(aboutSettings);
    console.log('✅ About Page Settings created\n');

    // Create Contact Page Settings
    console.log('📄 Creating Contact Page Settings...');
    await client.createOrReplace(contactSettings);
    console.log('✅ Contact Page Settings created\n');

    // Create Cleaning Services
    console.log('📄 Creating Cleaning Services...');
    await client.createOrReplace(cleaningServicesSettings);
    console.log('✅ Cleaning Services created\n');

    // Create Rental Services
    console.log('📄 Creating Rental Services...');
    await client.createOrReplace(rentalServicesSettings);
    console.log('✅ Rental Services created\n');

    // Create Jobs Page
    console.log('📄 Creating Jobs Page Settings...');
    await client.createOrReplace(jobsSettings);
    console.log('✅ Jobs Page Settings created\n');

    console.log('🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Login to Sanity Studio');
    console.log('2. Review and edit the content');
    console.log('3. Upload images for hero sections');
    console.log('4. Create remaining explore pages manually');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateContent();
