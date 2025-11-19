import { getRentalServicesSettings } from '@/lib/sanity';
import RentalServicesClient from './RentalServicesClient';

export const revalidate = 300;

export default async function RentalServices() {
  const content = await getRentalServicesSettings();
  
  const fallbackData = {
    heroSection: {
      heading: 'Property Management Services',
      description: 'Maximize your rental income while we handle everything.',
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920',
      backgroundImageAlt: 'Property management'
    },
    servicesGrid: {
      services: [
        { title: 'Listing Optimization', description: 'Professional photography and pricing.' },
        { title: 'Guest Communication', description: '24/7 guest support.' },
        { title: 'Cleaning & Maintenance', description: 'Property care coordination.' },
        { title: 'Revenue Management', description: 'Dynamic pricing strategies.' },
        { title: 'Marketing', description: 'Multi-platform listing.' },
        { title: 'Financial Reporting', description: 'Detailed monthly reports.' }
      ]
    },
    benefitsSection: {
      heading: 'Benefits of Professional Management',
      benefits: [
        { title: 'Hands-Free Operation', description: 'We handle everything.' },
        { title: 'Higher Occupancy', description: '30-50% increase in bookings.' },
        { title: 'Better Reviews', description: '5-star service quality.' },
        { title: 'Property Care', description: 'Regular maintenance.' }
      ]
    },
    formSection: {
      heading: 'Partner With Us',
      description: 'Let\'s discuss how we can maximize your rental income.'
    }
  };
  
  const data = content || fallbackData;
  return <RentalServicesClient content={data} />;
}
