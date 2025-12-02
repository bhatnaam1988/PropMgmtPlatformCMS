import { getHeaderNavigation } from '@/lib/sanity';
import { HeaderClient } from './HeaderClient';

export async function Header() {
  // Fetch navigation from Sanity
  const sanityNav = await getHeaderNavigation();

  // Hardcoded fallback data (maintains current implementation)
  const fallbackNavigation = [
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
  ];

  // Use Sanity data if available, otherwise use fallback
  const navigationItems = sanityNav?.items || fallbackNavigation;
  const brandName = 'Swiss Alpine Journey';

  return <HeaderClient brandName={brandName} navigationItems={navigationItems} />;
}
