import { getLegalSettings } from '@/lib/sanity';
import LegalClient from './LegalClient';

export const revalidate = 300;

export default async function Legal() {
  const settings = await getLegalSettings();
  
  const fallbackData = {
    pageHeader: {
      heading: 'Legal Information',
      description: 'Important legal documents and policies for Swiss Alpine Journey'
    },
    navigationCards: [
      {
        icon: 'FileText',
        title: 'Terms & Conditions',
        description: 'Booking terms and rental conditions',
        anchor: '#terms'
      },
      {
        icon: 'Shield',
        title: 'Privacy Policy',
        description: 'How we protect your personal data',
        anchor: '#privacy'
      },
      {
        icon: 'Cookie',
        title: 'GDPR Information',
        description: 'Your data rights under GDPR',
        anchor: '#gdpr'
      }
    ],
    termsSection: {
      heading: 'Terms & Conditions',
      lastUpdated: 'November 2024',
      sections: [
        {
          title: '1. Booking and Reservation',
          content: 'By making a reservation with Swiss Alpine Journey, you agree to these terms and conditions. All bookings are subject to availability and confirmation. A booking is only confirmed when you receive written confirmation from us.'
        },
        {
          title: '2. Payment Terms',
          content: 'A deposit of 30% of the total booking value is required to secure your reservation. The remaining balance must be paid 30 days before your arrival date. Payment can be made by bank transfer or major credit cards.'
        }
      ]
    },
    privacySection: {
      heading: 'Privacy Policy',
      lastUpdated: 'November 2024',
      sections: []
    },
    gdprSection: {
      heading: 'GDPR Information',
      description: 'Your rights under the General Data Protection Regulation',
      sections: []
    },
    footerText: {
      text: 'If you have any questions about these legal documents, please',
      linkText: 'contact us',
      linkUrl: '/contact'
    }
  };
  
  const data = settings || fallbackData;
  return <LegalClient content={data} />;
}
