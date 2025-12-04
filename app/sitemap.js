/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml with all static and dynamic pages
 */

import { getAllBlogPostSlugs } from '@/lib/sanity';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://swissalpinejourney.com';
  
  // Fetch properties for dynamic URLs
  let propertyUrls = [];
  try {
    // During build time, skip fetching properties (they'll be added at runtime)
    // This prevents "Dynamic server usage" errors during static generation
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'production') {
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/properties`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (res.ok) {
        const data = await res.json();
        propertyUrls = (data.properties || []).map(property => ({
          url: `${baseUrl}/property/${property.id}`,
          lastModified: property.updated_at || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  // Fetch blog posts for dynamic URLs
  let blogUrls = [];
  try {
    const posts = await getAllBlogPostSlugs();
    blogUrls = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Static pages with their priorities and update frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stay`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cleaning-services`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/rental-services`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/explore/graechen`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/explore/other-locations`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/explore/travel-tips`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/explore/behind-the-scenes`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date('2024-11-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Combine static and dynamic pages
  return [...staticPages, ...propertyUrls, ...blogUrls];
}
