import { getJobsSettings } from '@/lib/sanity';
import JobsClient from './JobsClient';

export const revalidate = 300;

export default async function Jobs() {
  const content = await getJobsSettings();
  
  const fallbackData = {
    heroSection: {
      heading: 'Join Our Team',
      description: 'Build your career in the heart of the Swiss Alps.',
      backgroundImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920',
      backgroundImageAlt: 'Team meeting'
    },
    valuesSection: {
      values: [
        { title: 'Guest-Focused', description: 'Exceptional hospitality.' },
        { title: 'Team Spirit', description: 'Collaboration matters.' },
        { title: 'Quality Standards', description: 'Excellence in details.' },
        { title: 'Alpine Living', description: 'Work-life balance.' }
      ]
    },
    openPositionsSection: {
      heading: 'Current Openings',
      positions: [
        { title: 'Property Manager', location: 'Grächen', type: 'Full-time', description: 'Oversee operations.' },
        { title: 'Cleaning Team Member', location: 'Grächen', type: 'Part-time', description: 'Join our team.' },
        { title: 'Guest Services', location: 'Remote', type: 'Full-time', description: 'Manage communications.' }
      ]
    },
    applicationSection: {
      heading: 'Apply Now',
      description: 'Send us your CV.',
      footerText: 'We\'ll respond within 5 business days.'
    }
  };
  
  const data = content || fallbackData;
  return <JobsClient content={data} />;
}
