import { getContactSettings } from '@/lib/sanity';
import ContactForm from './ContactForm';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Contact() {
  const content = await getContactSettings();
  
  // Fallback data
  const fallbackData = {
    heroSection: {
      heading: 'Get in Touch',
      description: "Whether you're planning your next stay or interested in listing a property with us, our team is here to assist. We welcome guest and partner inquiries alike."
    },
    contactInfo: {
      phone: '+41 27 956 XX XX',
      email: 'info@swissalpinejourney.com',
      responseTime: 'We typically respond within 24 hours'
    },
    formSection: {
      heading: 'Send us a message'
    }
  };
  
  // Fix: Check if content has valid data, not just if it exists
  // Sanity returns empty object {} when document exists but has no content
  const hasValidContent = content && 
                          content.heroSection && 
                          content.heroSection.heading;
  
  const data = hasValidContent ? content : fallbackData;
  
  return <ContactForm content={data} />;
}
