/**
 * Robots.txt Generation
 * Guides search engine crawlers on what to index
 */

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://swissalpinejourney.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout',
          '/booking/success',
          '/booking/failure',
          '/studio/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
