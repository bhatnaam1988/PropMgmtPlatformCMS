import { getCleaningServicesSettings } from '@/lib/sanity';
import CleaningServicesClient from './CleaningServicesClient';

export const revalidate = 300;

export default async function CleaningServices() {
  const content = await getCleaningServicesSettings();
  
  const fallbackData = {
    heroSection: {
      heading: 'Professional Cleaning Services',
      description: 'Maintain your vacation rental to the highest standards with our comprehensive cleaning services tailored for the hospitality industry.',
      backgroundImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920',
      backgroundImageAlt: 'Professional cleaning service'
    },
    servicesGrid: {
      services: [
        { title: 'Turnover Cleaning', description: 'Complete cleaning between guest stays.' },
        { title: 'Deep Cleaning', description: 'Thorough seasonal deep cleaning.' },
        { title: 'Laundry Service', description: 'Professional washing and folding.' },
        { title: 'Inspection Reports', description: 'Detailed post-cleaning reports.' },
        { title: 'Restocking', description: 'Replenishment of supplies.' },
        { title: 'Emergency Cleaning', description: 'Same-day emergency services.' }
      ]
    },
    whyChooseSection: {
      heading: 'Why Choose Our Cleaning Services',
      reasons: [
        { title: 'Hospitality Expertise', description: 'Specialized in vacation rentals.' },
        { title: 'Reliable & Consistent', description: 'Same high standards every time.' },
        { title: 'Eco-Friendly Products', description: 'Safe for guests and environment.' },
        { title: 'Flexible Scheduling', description: 'Quick turnarounds available.' }
      ]
    },
    formSection: {
      heading: 'Request a Quote',
      description: 'Get a custom quote for your cleaning needs.'
    }
  };
  
  const data = content || fallbackData;
  return <CleaningServicesClient content={data} />;
}
