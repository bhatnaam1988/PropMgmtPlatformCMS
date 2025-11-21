import { getCleaningServicesSettings } from '@/lib/sanity';
import CleaningServicesClient from './CleaningServicesClient';

export const revalidate = 300;

export default async function CleaningServices() {
  const content = await getCleaningServicesSettings();
  
  const fallbackData = {
    heroSection: {
      heading: 'Professional Cleaning Services',
      description: 'Maintain your vacation rental to the highest standards with our comprehensive cleaning services.',
      backgroundImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920',
      backgroundImageAlt: 'Professional cleaning'
    },
    servicesGrid: {
      services: [
        { title: 'Turnover Cleaning', description: 'Complete cleaning between guest stays (will not be displayed).' },
        { title: 'Deep Cleaning', description: 'Comprehensive seasonal cleaning including windows, appliances, and detailed sanitization' },
        { title: 'Linen Service', description: 'Professional laundering, ironing, and fresh linen setup for each guest arrival' },
        { title: 'Quality Inspections', description: 'Post-cleaning inspection to ensure everything meets our high standards before guest check-in' }
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
