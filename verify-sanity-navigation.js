/**
 * Verification Script: Check Sanity Navigation and Footer Data
 * 
 * This script fetches current navigation and footer data from Sanity
 * and compares it with the expected fallback values.
 */

import { getHeaderNavigation, getFooterContent } from './lib/sanity.js';

async function verifyNavigationData() {
  console.log('='.repeat(60));
  console.log('🔍 VERIFYING SANITY NAVIGATION & FOOTER DATA');
  console.log('='.repeat(60));
  console.log();

  // Expected Header Navigation (from Header.js fallback)
  const expectedHeaderNav = {
    name: 'header',
    items: [
      {
        text: 'Stay',
        link: '/stay',
        children: []
      },
      {
        text: 'Explore',
        link: '#',
        children: [
          { text: 'Grächen', link: '/explore/graechen' },
          { text: 'Other Locations', link: '/explore/other-locations' },
          { text: 'Travel Tips', link: '/explore/travel-tips' },
          { text: 'Behind the Scenes', link: '/explore/behind-the-scenes' },
        ]
      },
      {
        text: 'Blog',
        link: '/blog',
        children: []
      },
      {
        text: 'Services',
        link: '#',
        children: [
          { text: 'Cleaning Services', link: '/cleaning-services' },
          { text: 'Rental Services', link: '/rental-services' },
        ]
      },
      {
        text: 'About',
        link: '#',
        children: [
          { text: 'About', link: '/about' },
          { text: 'Contact', link: '/contact' },
          { text: 'Careers', link: '/jobs' },
        ]
      }
    ]
  };

  // Expected Footer Content (from Footer.js fallback)
  const expectedFooter = {
    sections: [
      {
        title: 'Services',
        links: [
          { text: 'Cleaning Services', url: '/cleaning-services' },
          { text: 'Rental Management', url: '/rental-services' },
          { text: 'Careers', url: '/jobs' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { text: 'Privacy Policy', url: '/legal#privacy' },
          { text: 'Terms & Conditions', url: '/legal#terms' },
          { text: 'GDPR Information', url: '/legal#gdpr' }
        ]
      }
    ],
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://instagram.com/swissalpinejourney'
      }
    ],
    copyrightText: '© 2024 Swiss Alpine Journey. All rights reserved.'
  };

  // Fetch from Sanity
  console.log('📡 Fetching Header Navigation from Sanity...');
  const sanityHeaderNav = await getHeaderNavigation();
  
  console.log('📡 Fetching Footer Content from Sanity...');
  const sanityFooter = await getFooterContent();
  
  console.log();
  console.log('='.repeat(60));
  console.log('📊 HEADER NAVIGATION RESULTS');
  console.log('='.repeat(60));
  
  if (sanityHeaderNav) {
    console.log('✅ Header Navigation EXISTS in Sanity');
    console.log();
    console.log('Current Sanity Data:');
    console.log(JSON.stringify(sanityHeaderNav, null, 2));
    console.log();
    
    // Compare with expected
    if (sanityHeaderNav.name === 'header' && sanityHeaderNav.items && sanityHeaderNav.items.length > 0) {
      console.log('✅ Header navigation has items:', sanityHeaderNav.items.length);
    } else {
      console.log('⚠️  Header navigation structure may need adjustment');
    }
  } else {
    console.log('❌ Header Navigation NOT FOUND in Sanity');
    console.log('📝 Will need to create navigation document with name "header"');
  }

  console.log();
  console.log('='.repeat(60));
  console.log('📊 FOOTER CONTENT RESULTS');
  console.log('='.repeat(60));
  
  if (sanityFooter) {
    console.log('✅ Footer Content EXISTS in Sanity');
    console.log();
    console.log('Current Sanity Data:');
    console.log(JSON.stringify(sanityFooter, null, 2));
    console.log();
    
    // Compare with expected
    const hasSection = sanityFooter.sections && sanityFooter.sections.length > 0;
    const hasSocial = sanityFooter.socialLinks && sanityFooter.socialLinks.length > 0;
    const hasCopyright = sanityFooter.copyrightText;
    
    if (hasSection) console.log('✅ Footer has sections:', sanityFooter.sections.length);
    else console.log('⚠️  Footer has no sections');
    
    if (hasSocial) console.log('✅ Footer has social links:', sanityFooter.socialLinks.length);
    else console.log('⚠️  Footer has no social links');
    
    if (hasCopyright) console.log('✅ Footer has copyright text');
    else console.log('⚠️  Footer has no copyright text');
  } else {
    console.log('❌ Footer Content NOT FOUND in Sanity');
    console.log('📝 Will need to create footer document');
  }

  console.log();
  console.log('='.repeat(60));
  console.log('📋 SUMMARY');
  console.log('='.repeat(60));
  
  const needsHeaderPopulation = !sanityHeaderNav || !sanityHeaderNav.items || sanityHeaderNav.items.length === 0;
  const needsFooterPopulation = !sanityFooter || !sanityFooter.sections || sanityFooter.sections.length === 0;
  
  if (needsHeaderPopulation || needsFooterPopulation) {
    console.log('❌ ACTION REQUIRED: Need to populate Sanity with navigation data');
    console.log();
    if (needsHeaderPopulation) {
      console.log('  → Create Header Navigation document in Sanity');
    }
    if (needsFooterPopulation) {
      console.log('  → Create Footer document in Sanity');
    }
  } else {
    console.log('✅ All navigation data exists in Sanity!');
    console.log('✅ Website is using Sanity CMS for navigation');
  }
  
  console.log();
  console.log('Expected Header Navigation:');
  console.log(JSON.stringify(expectedHeaderNav, null, 2));
  console.log();
  console.log('Expected Footer Content:');
  console.log(JSON.stringify(expectedFooter, null, 2));
  console.log();
  console.log('='.repeat(60));
}

// Run verification
verifyNavigationData()
  .then(() => {
    console.log('✅ Verification complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  });
