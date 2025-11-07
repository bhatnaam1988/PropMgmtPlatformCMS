import { generatePropertyMetadata } from '@/lib/metadata';

// Generate metadata dynamically based on property ID
export async function generateMetadata({ params }) {
  try {
    // Fetch property data for metadata
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/properties/${params.id}`, {
      cache: 'no-store' // Always fetch fresh data for metadata
    });
    
    if (!res.ok) {
      return {
        title: 'Property Not Found | Swiss Alpine Journey',
        description: 'The property you are looking for could not be found.',
      };
    }
    
    const data = await res.json();
    return generatePropertyMetadata(data.property);
  } catch (error) {
    console.error('Error generating property metadata:', error);
    return {
      title: 'Property | Swiss Alpine Journey',
      description: 'Vacation rental property in Grächen, Switzerland.',
    };
  }
}

export default function PropertyLayout({ children }) {
  return children;
}
