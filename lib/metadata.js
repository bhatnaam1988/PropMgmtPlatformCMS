/**
 * SEO Metadata Utility
 * Generates consistent metadata across all pages
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://swissalpinejourney.com';
const siteName = 'Swiss Alpine Journey';
const defaultDescription = 'Discover authentic Swiss Alpine vacation rentals in Grächen. Quality properties with modern comfort, stunning mountain views, and convenient locations.';
const defaultImage = '/og-images/homepage.jpg';

/**
 * Generate complete metadata object for a page
 */
export function generateMetadata({
  title,
  description = defaultDescription,
  path = '/',
  image = defaultImage,
  type = 'website',
  noindex = false,
  keywords = []
}) {
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = `${baseUrl}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const metadata = {
    title: fullTitle,
    description,
    ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteName,
        }
      ],
      locale: 'en_US',
      type,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@swissalpinejourney',
    },
    
    // Additional
    alternates: {
      canonical: url,
    },
  };

  // Add noindex if specified (for checkout, booking pages)
  if (noindex) {
    metadata.robots = {
      index: false,
      follow: true,
    };
  }

  return metadata;
}

/**
 * Generate metadata for property detail pages
 */
export function generatePropertyMetadata(property) {
  if (!property) return generateMetadata({ title: 'Property Not Found' });

  const title = property.title || property.name;
  const description = property.description 
    ? property.description.substring(0, 160) 
    : `${property.bedrooms} bedroom property in ${property.address?.city || 'Grächen'}. ${property.maximum_capacity} guests. Book your Swiss Alpine vacation rental.`;
  
  const image = property.images?.[0]?.url || property.pictures?.[0]?.url || defaultImage;
  
  const keywords = [
    'Grächen',
    'Swiss Alps',
    'vacation rental',
    `${property.bedrooms} bedroom`,
    property.address?.city,
    'mountain chalet',
    'alpine accommodation'
  ].filter(Boolean);

  return generateMetadata({
    title,
    description,
    path: `/property/${property.id}`,
    image,
    type: 'product',
    keywords,
  });
}

/**
 * Predefined metadata for common pages
 */
export const pageMetadata = {
  home: {
    title: 'Vacation Rentals in Grächen',
    description: 'Discover authentic Swiss Alpine vacation rentals in Grächen. Quality properties with modern comfort, stunning mountain views, and convenient locations near skiing and hiking.',
    keywords: ['Grächen vacation rentals', 'Swiss Alps accommodation', 'mountain chalet rental', 'Valais holiday homes', 'ski chalet Grächen'],
    path: '/',
  },
  
  stay: {
    title: 'Browse Vacation Rentals',
    description: 'Browse our collection of vacation rentals in Grächen, Switzerland. Find apartments, chalets, and studios perfect for your alpine adventure. Book direct for the best rates.',
    keywords: ['book vacation rental', 'Grächen properties', 'alpine apartments', 'ski accommodation', 'holiday rentals Switzerland'],
    path: '/stay',
  },
  
  about: {
    title: 'About Us',
    description: 'Learn about Swiss Alpine Journey. Family-owned vacation rental company in Grächen offering quality properties with authentic Swiss alpine hospitality since 2024.',
    keywords: ['Swiss Alpine Journey', 'vacation rental company', 'Grächen property management', 'alpine hospitality'],
    path: '/about',
  },
  
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with Swiss Alpine Journey. Whether you\'re planning your stay or interested in property management services, we\'re here to help.',
    keywords: ['contact Swiss Alpine Journey', 'vacation rental inquiry', 'booking assistance', 'property management'],
    path: '/contact',
  },
  
  legal: {
    title: 'Legal Information',
    description: 'Terms & Conditions, Privacy Policy, and GDPR information for Swiss Alpine Journey vacation rentals.',
    keywords: ['terms and conditions', 'privacy policy', 'GDPR', 'legal information'],
    path: '/legal',
    noindex: true,
  },
  
  jobs: {
    title: 'Careers',
    description: 'Join the Swiss Alpine Journey team. Explore career opportunities in vacation rental management, cleaning services, and guest services in Grächen.',
    keywords: ['vacation rental jobs', 'careers Grächen', 'hospitality jobs Switzerland', 'property management careers'],
    path: '/jobs',
  },
  
  cleaningServices: {
    title: 'Professional Cleaning Services',
    description: 'Professional cleaning services for vacation rentals in Grächen. Turnover cleaning, deep cleaning, and recurring services. Reliable, quality service.',
    keywords: ['vacation rental cleaning', 'professional cleaning Grächen', 'turnover cleaning', 'property cleaning services'],
    path: '/cleaning-services',
  },
  
  rentalServices: {
    title: 'Rental Property Management',
    description: 'Professional vacation rental management services in Grächen. Listing optimization, cleaning coordination, and booking management for property owners.',
    keywords: ['property management Grächen', 'vacation rental management', 'Airbnb management', 'rental listing services'],
    path: '/rental-services',
  },
  
  travelTips: {
    title: 'Travel Tips for Swiss Alps',
    description: 'Essential travel tips for your Swiss Alps vacation. Hiking advice, winter sports tips, packing essentials, and money-saving recommendations for Grächen.',
    keywords: ['Swiss Alps travel tips', 'Grächen travel guide', 'mountain vacation advice', 'skiing tips', 'hiking Switzerland'],
    path: '/explore/travel-tips',
  },
  
  behindTheScenes: {
    title: 'Behind the Scenes',
    description: 'Discover the story behind Swiss Alpine Journey. Our values, team, quality standards, and commitment to authentic alpine hospitality.',
    keywords: ['Swiss Alpine Journey story', 'vacation rental philosophy', 'quality standards', 'hospitality values'],
    path: '/explore/behind-the-scenes',
  },
  
  otherLocations: {
    title: 'Explore Swiss Alpine Destinations',
    description: 'Discover other stunning Swiss Alpine destinations in Valais. Explore Zermatt, Saas-Fee, Crans-Montana, Verbier, and Leukerbad.',
    keywords: ['Valais destinations', 'Swiss Alps locations', 'Zermatt', 'Saas-Fee', 'mountain resorts Switzerland'],
    path: '/explore/other-locations',
  },
  
  graechen: {
    title: 'Grächen - The Sunny Village',
    description: 'Discover Grächen, a charming car-free village in the Swiss Alps. Year-round activities, stunning Matterhorn views, and authentic alpine culture.',
    keywords: ['Grächen Switzerland', 'car-free village', 'Valais tourism', 'Matterhorn views', 'alpine village'],
    path: '/explore/graechen',
  },
  
  bookingSuccess: {
    title: 'Booking Confirmed',
    description: 'Your booking has been confirmed! Thank you for choosing Swiss Alpine Journey.',
    path: '/booking/success',
    noindex: true,
  },
  
  bookingFailure: {
    title: 'Booking Issue',
    description: 'There was an issue with your booking. Please contact us for assistance.',
    path: '/booking/failure',
    noindex: true,
  },
  
  checkout: {
    title: 'Secure Checkout',
    description: 'Complete your vacation rental booking securely with Swiss Alpine Journey.',
    path: '/checkout',
    noindex: true,
  },
};

/**
 * Helper to get metadata for a specific page
 */
export function getPageMetadata(pageKey) {
  const page = pageMetadata[pageKey];
  if (!page) return generateMetadata({});
  
  return generateMetadata(page);
}
