import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'temp-project',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
};

export const sanityClient = createClient(config);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

// Helper to get page content by slug
export async function getPageBySlug(slug) {
  try {
    const query = `*[_type == "page" && slug.current == $slug][0]{
      title,
      slug,
      content,
      seo
    }`;
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Helper to get all pages
export async function getAllPages() {
  try {
    const query = `*[_type == "page"]{
      title,
      slug,
      _id
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}
