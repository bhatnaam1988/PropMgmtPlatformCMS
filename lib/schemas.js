/**
 * Schema.org Structured Data Generators
 * Creates JSON-LD schemas for rich search results
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://swissalpinejourney.com';

/**
 * Organization Schema - Global company information
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Swiss Alpine Journey',
    alternateName: 'SAJ Vacation Rentals',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Premium vacation rental management in Grächen, Switzerland. Quality properties with authentic Swiss alpine hospitality.',
    email: 'hello@swissalpinejourney.com',
    telephone: '+41279560000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Grächen',
      addressRegion: 'Valais',
      addressCountry: 'CH',
    },
    sameAs: [
      'https://www.instagram.com/swissalpinejourney',
    ],
    founder: {
      '@type': 'Person',
      name: 'Swiss Alpine Journey Founder',
    },
    foundingDate: '2024',
  };
}

/**
 * LocalBusiness Schema - Vacation rental business
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: 'Swiss Alpine Journey',
    image: `${baseUrl}/og-images/homepage.jpg`,
    url: baseUrl,
    telephone: '+41279560000',
    email: 'hello@swissalpinejourney.com',
    priceRange: 'CHF 100-500',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Grächen',
      addressRegion: 'Valais',
      postalCode: '3925',
      addressCountry: 'CH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '46.1976',
      longitude: '7.8359',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '46.1976',
        longitude: '7.8359',
      },
      geoRadius: '5000',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '100',
    },
  };
}

/**
 * Property/Product Schema - For individual property listings
 */
export function getPropertySchema(property) {
  if (!property) return null;

  const images = property.images?.map(img => img.url) || 
                 property.pictures?.map(img => img.url) || 
                 [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/property/${property.id}`,
    name: property.title || property.name,
    description: property.description || `${property.bedrooms} bedroom vacation rental in ${property.address?.city || 'Grächen'}`,
    image: images,
    brand: {
      '@type': 'Brand',
      name: 'Swiss Alpine Journey',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/property/${property.id}`,
      priceCurrency: 'CHF',
      price: property.nightly_rate || '150',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Swiss Alpine Journey',
      },
    },
    aggregateRating: property.rating ? {
      '@type': 'AggregateRating',
      ratingValue: property.rating,
      reviewCount: property.review_count || '10',
    } : undefined,
  };
}

/**
 * Vacation Rental Schema - More specific for properties
 */
export function getVacationRentalSchema(property) {
  if (!property) return null;

  const images = property.images?.map(img => img.url) || 
                 property.pictures?.map(img => img.url) || 
                 [];

  const amenities = property.amenities?.map(a => a.name) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: property.title || property.name,
    description: property.description,
    url: `${baseUrl}/property/${property.id}`,
    image: images,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.address?.city || 'Grächen',
      addressRegion: property.address?.state || 'Valais',
      postalCode: property.address?.postal_code || '3925',
      addressCountry: 'CH',
    },
    numberOfRooms: property.bedrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: property.maximum_capacity,
    },
    amenityFeature: amenities.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.size,
      unitCode: 'MTK',
    },
  };
}

/**
 * BreadcrumbList Schema - Navigation breadcrumbs
 */
export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * WebPage Schema - For individual pages
 */
export function getWebPageSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}${page.url}`,
    url: `${baseUrl}${page.url}`,
    name: page.title,
    description: page.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Swiss Alpine Journey',
    },
    inLanguage: 'en-US',
    datePublished: page.publishedDate || '2024-11-01',
    dateModified: page.modifiedDate || new Date().toISOString().split('T')[0],
  };
}

/**
 * WebSite Schema - Global website information
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Swiss Alpine Journey',
    description: 'Premium vacation rentals in Grächen, Switzerland',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/stay?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

/**
 * FAQ Schema - For pages with FAQs
 */
export function getFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
