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
        { title: 'Deep Cleaning', description: 'Comprehensive seasonal cleaning including windows, appliances, and detailed sanitization' },
        { title: 'Linen Service', description: 'Professional laundering, ironing, and fresh linen setup for each guest arrival' },
        { title: 'Quality Inspections', description: 'Post-cleaning inspection to ensure everything meets our high standards before guest check-in' }
      ]
    },
    benefitsSection: {
      heading: 'Why Choose Our Cleaning Services',
      benefits: [
        { title: 'Local Team', description: 'Experienced cleaners who know Grächen properties and Alpine accommodation standards' },
        { title: 'Reliable Scheduling', description: 'Flexible timing to accommodate back-to-back bookings and tight turnarounds' },
        { title: 'Eco-Friendly Products', description: 'High-quality, environmentally responsible cleaning products safe for guests and properties' },
        { title: 'Quality Assurance', description: 'Every cleaning is inspected to ensure it meets our high standards' }
      ]
    },
    formSection: {
      heading: 'Request a Quote',
      description: 'Get a custom quote for your cleaning needs. Fill out the form below and we\'ll get back to you within 24 hours.'
    }
  };
  
  // Fix: Check if content has valid data, not just if it exists
  // Sanity returns empty object {} when document exists but has no content
  const hasValidContent = content && 
                          content.heroSection && 
                          content.heroSection.heading &&
                          content.servicesGrid &&
                          content.servicesGrid.services &&
                          content.servicesGrid.services.length > 0;
  
  const data = hasValidContent ? content : fallbackData;
  return <CleaningServicesClient content={data} />;
}
