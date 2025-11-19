const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const legalContent = {
  _type: 'legalSettingsHybrid',
  headerSection: {
    heading: 'Legal Information',
    description: 'Important terms, policies, and information about Swiss Alpine Journey services.'
  },
  termsSection: {
    lastUpdated: 'November 2024',
    content: [
      {
        _type: 'block',
        _key: 'terms1',
        style: 'h3',
        children: [{ _type: 'span', text: '1. Booking Terms' }]
      },
      {
        _type: 'block',
        _key: 'terms2',
        style: 'normal',
        children: [{ _type: 'span', text: 'All bookings are subject to availability and confirmation. Payment in full is required to secure your reservation.' }]
      },
      {
        _type: 'block',
        _key: 'terms3',
        style: 'h3',
        children: [{ _type: 'span', text: '2. Cancellation Policy' }]
      },
      {
        _type: 'block',
        _key: 'terms4',
        style: 'normal',
        children: [{ _type: 'span', text: 'Cancellations made 30+ days before check-in receive full refund. Cancellations within 30 days are subject to our standard cancellation fees.' }]
      },
      {
        _type: 'block',
        _key: 'terms5',
        style: 'h3',
        children: [{ _type: 'span', text: '3. Guest Responsibilities' }]
      },
      {
        _type: 'block',
        _key: 'terms6',
        style: 'normal',
        children: [{ _type: 'span', text: 'Guests are responsible for the property during their stay and must follow house rules. Any damages beyond normal wear will be charged.' }]
      }
    ]
  },
  privacySection: {
    lastUpdated: 'November 2024',
    content: [
      {
        _type: 'block',
        _key: 'privacy1',
        style: 'h3',
        children: [{ _type: 'span', text: 'Data Collection' }]
      },
      {
        _type: 'block',
        _key: 'privacy2',
        style: 'normal',
        children: [{ _type: 'span', text: 'We collect personal information necessary for bookings including name, email, phone number, and payment details. This information is used solely for reservation management and guest services.' }]
      },
      {
        _type: 'block',
        _key: 'privacy3',
        style: 'h3',
        children: [{ _type: 'span', text: 'Data Protection' }]
      },
      {
        _type: 'block',
        _key: 'privacy4',
        style: 'normal',
        children: [{ _type: 'span', text: 'We implement industry-standard security measures to protect your personal information. Your data is stored securely and never sold to third parties.' }]
      },
      {
        _type: 'block',
        _key: 'privacy5',
        style: 'h3',
        children: [{ _type: 'span', text: 'Cookie Usage' }]
      },
      {
        _type: 'block',
        _key: 'privacy6',
        style: 'normal',
        children: [{ _type: 'span', text: 'Our website uses cookies to improve user experience and analytics. You can control cookie preferences through your browser settings.' }]
      }
    ]
  },
  gdprSection: {
    content: [
      {
        _type: 'block',
        _key: 'gdpr1',
        style: 'h3',
        children: [{ _type: 'span', text: 'Your Rights Under GDPR' }]
      },
      {
        _type: 'block',
        _key: 'gdpr2',
        style: 'normal',
        children: [{ _type: 'span', text: 'You have the right to access, correct, or delete your personal data. Contact us at hello@swissalpinejourney.com to exercise these rights.' }]
      },
      {
        _type: 'block',
        _key: 'gdpr3',
        style: 'normal',
        children: [{ _type: 'span', text: 'We comply with GDPR requirements for EU residents and maintain data processing agreements with all service providers.' }]
      }
    ]
  },
  footerText: 'If you have questions about our legal policies, please contact us at hello@swissalpinejourney.com',
  seo: {
    metaTitle: 'Terms & Conditions, Privacy Policy | Swiss Alpine Journey',
    metaDescription: 'Read our terms and conditions, privacy policy, and GDPR information for Swiss Alpine Journey vacation rentals in Grächen, Switzerland.',
    keywords: ['terms and conditions', 'privacy policy', 'GDPR compliance', 'vacation rental policies', 'Swiss Alpine Journey legal']
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting legal page migration...');

    const existing = await client.fetch(`*[_type == "legalSettingsHybrid"][0]`);
    
    if (existing) {
      console.log('✅ Legal content already exists. Updating...');
      const result = await client
        .patch(existing._id)
        .set(legalContent)
        .commit();
      console.log('✅ Legal page updated successfully!');
    } else {
      console.log('📝 Creating new legal content...');
      const result = await client.create(legalContent);
      console.log('✅ Legal page created successfully!');
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
