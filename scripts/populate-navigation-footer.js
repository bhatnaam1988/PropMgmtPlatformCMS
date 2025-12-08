import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

// Navigation document (Header)
const navigationDoc = {
  _type: 'navigation',
  _id: 'navigation-header', // Fixed ID to avoid duplicates
  name: 'header',
  items: [
    {
      _key: 'stay',
      text: 'Stay',
      link: '/stay',
      children: []
    },
    {
      _key: 'explore',
      text: 'Explore',
      link: '#',
      children: [
        {
          _key: 'graechen',
          text: 'Grächen',
          link: '/explore/graechen'
        },
        {
          _key: 'other-locations',
          text: 'Other Locations',
          link: '/explore/other-locations'
        },
        {
          _key: 'travel-tips',
          text: 'Travel Tips',
          link: '/explore/travel-tips'
        },
        {
          _key: 'behind-scenes',
          text: 'Behind the Scenes',
          link: '/explore/behind-the-scenes'
        }
      ]
    },
    {
      _key: 'blog',
      text: 'Blog',
      link: '/blog',
      children: []
    },
    {
      _key: 'services',
      text: 'Services',
      link: '#',
      children: [
        {
          _key: 'cleaning-services',
          text: 'Cleaning Services',
          link: '/cleaning-services'
        },
        {
          _key: 'rental-services',
          text: 'Rental Services',
          link: '/rental-services'
        }
      ]
    },
    {
      _key: 'about',
      text: 'About',
      link: '#',
      children: [
        {
          _key: 'about-page',
          text: 'About',
          link: '/about'
        },
        {
          _key: 'contact',
          text: 'Contact',
          link: '/contact'
        },
        {
          _key: 'careers',
          text: 'Careers',
          link: '/jobs'
        }
      ]
    }
  ]
};

// Footer document
const footerDoc = {
  _type: 'footer',
  _id: 'footer-main', // Fixed ID to avoid duplicates
  sections: [
    {
      _key: 'services-section',
      title: 'Services',
      links: [
        {
          _key: 'cleaning-services',
          text: 'Cleaning Services',
          url: '/cleaning-services'
        },
        {
          _key: 'rental-management',
          text: 'Rental Management',
          url: '/rental-services'
        },
        {
          _key: 'careers',
          text: 'Careers',
          url: '/jobs'
        }
      ]
    },
    {
      _key: 'legal-section',
      title: 'Legal',
      links: [
        {
          _key: 'privacy',
          text: 'Privacy Policy',
          url: '/legal#privacy'
        },
        {
          _key: 'terms',
          text: 'Terms & Conditions',
          url: '/legal#terms'
        },
        {
          _key: 'gdpr',
          text: 'GDPR Information',
          url: '/legal#gdpr'
        }
      ]
    }
  ],
  socialLinks: [
    {
      _key: 'instagram',
      platform: 'instagram',
      url: 'https://instagram.com/swissalpinejourney'
    }
  ],
  copyrightText: '© 2024 Swiss Alpine Journey. All rights reserved.'
};

async function populateDocuments() {
  try {
    console.log('🚀 Starting Sanity document population...\n');

    // Create or update Navigation document
    console.log('📝 Creating/updating Navigation document...');
    const navResult = await client.createOrReplace(navigationDoc);
    console.log('✅ Navigation document created/updated successfully!');
    console.log(`   Document ID: ${navResult._id}`);
    console.log(`   Navigation name: ${navResult.name}`);
    console.log(`   Number of items: ${navResult.items.length}\n`);

    // Create or update Footer document
    console.log('📝 Creating/updating Footer document...');
    const footerResult = await client.createOrReplace(footerDoc);
    console.log('✅ Footer document created/updated successfully!');
    console.log(`   Document ID: ${footerResult._id}`);
    console.log(`   Number of sections: ${footerResult.sections.length}`);
    console.log(`   Social links: ${footerResult.socialLinks.length}\n`);

    console.log('🎉 All documents populated successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Navigation (Header): 5 main menu items with dropdowns');
    console.log('   - Footer: 2 sections (Services, Legal) + Instagram link');
    console.log('\n✨ You can now edit these documents in Sanity Studio!');
    console.log('   Navigate to: https://secure-forms-2.preview.emergentagent.com/studio');

  } catch (error) {
    console.error('❌ Error populating documents:', error);
    throw error;
  }
}

// Run the population script
populateDocuments()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
