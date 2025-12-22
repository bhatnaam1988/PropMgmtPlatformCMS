import { getFooterContent } from '@/lib/sanity';
import { FooterClient } from './FooterClient';

export async function Footer() {
  // Fetch footer content from Sanity
  const sanityFooter = await getFooterContent();

  // Hardcoded fallback data (maintains current implementation)
  const fallbackBrand = {
    name: 'Swiss Alpine Journey',
    tagline: 'Where authentic stays meet modern comfort and local adventure. Discover perfectly located homes for your next adventure.'
  };

  const fallbackSections = [
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
  ];

  const fallbackSocialMedia = [
    {
      platform: 'instagram',
      url: 'https://instagram.com/swissalpinejourney',
      handle: '@swissalpinejourney'
    }
  ];

  const fallbackCopyright = '© 2025 Swiss Alpine Journey. All Rights Reserved.';

  // Use Sanity data if available, otherwise use fallback
  const brandSection = fallbackBrand; // Keep brand hardcoded for safety
  const footerSections = sanityFooter?.sections || fallbackSections;
  const socialMedia = sanityFooter?.socialLinks || fallbackSocialMedia;
  const copyrightText = sanityFooter?.copyrightText || fallbackCopyright;

  return (
    <FooterClient 
      brandSection={brandSection}
      footerSections={footerSections}
      socialMedia={socialMedia}
      copyrightText={copyrightText}
    />
  );
}
