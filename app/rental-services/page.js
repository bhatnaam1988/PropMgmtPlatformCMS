import { getRentalServicesSettings } from '@/lib/sanity';
import RentalServicesClient from './RentalServicesClient';

export const revalidate = 300;

export default async function RentalServices() {
  const content = await getRentalServicesSettings();
  
  const fallbackData = {
    heroSection: {
      heading: 'Full-Service Rental Management',
      description: 'Maximize your rental income while we handle everything. Professional management for vacation properties in Grächen and the Swiss Alps.',
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920',
      backgroundImageAlt: 'Property management'
    },
    servicesGrid: {
      services: [
        { title: 'Guest Communication', description: 'Handle all inquiries, bookings, and guest communication in multiple languages' },
        { title: 'Property Marketing', description: 'Professional photography, compelling listings, and promotion across major booking platforms' },
        { title: 'Pricing Optimization', description: 'Dynamic pricing strategy to maximize occupancy and revenue throughout the year' },
        { title: 'Maintenance Coordination', description: 'Regular inspections, repairs, and maintenance to keep your property in top condition' },
        { title: 'Cleaning Services', description: 'Professional turnover cleaning and linen service between each guest stay' },
        { title: 'Financial Reporting', description: 'Transparent monthly reports with detailed income, expenses, and occupancy analytics' }
      ]
    },
    benefitsSection: {
      heading: 'The Swiss Alpine Journey Difference',
      benefits: [
        { title: 'Local Expertise', description: 'Deep knowledge of Grächen market, local regulations, and what guests expect from Alpine properties' },
        { title: 'Premium Service', description: 'We treat every property like our own, maintaining high standards that drive excellent guest reviews' },
        { title: 'Transparent Fees', description: 'Simple commission-based pricing with no hidden costs. You keep more of your rental income' },
        { title: 'Owner Portal', description: 'Real-time access to bookings, earnings, and property performance through your dedicated dashboard' }
      ]
    },
    formSection: {
      heading: 'Partner With Us',
      description: 'Interested in our rental management services? Tell us about your property and we\'ll schedule a consultation to discuss how we can help maximize your rental income.'
    }
  };
  
  // Fix: Check if content has valid data, not just if it exists
  // Sanity returns empty object {} when document exists but has no content
  const hasValidContent = content && 
                          content.heroSection && 
                          content.heroSection.heading &&
                          content.servicesGrid &&
                          content.servicesGrid.services &&
                          content.servicesGrid.services.length > 0 &&
                          content.benefitsSection &&
                          content.benefitsSection.benefits &&
                          content.benefitsSection.benefits.length > 0 &&
                          content.formSection &&
                          content.formSection.heading;
  
  const data = hasValidContent ? content : fallbackData;
  return <RentalServicesClient content={data} />;
}
