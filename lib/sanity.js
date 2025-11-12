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

// Helper to get all blog posts
export async function getAllBlogPosts() {
  try {
    const query = `*[_type == "blogPost"] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      },
      author->{
        name,
        slug
      },
      categories[]->{
        title,
        slug
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Helper to get blog post by slug
export async function getBlogPostBySlug(slug) {
  try {
    const query = `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      },
      author->{
        name,
        slug,
        image{
          asset->{
            url
          }
        },
        bio
      },
      categories[]->{
        title,
        slug
      },
      body,
      seo
    }`;
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Helper to get all blog post slugs (for static generation)
export async function getAllBlogPostSlugs() {
  try {
    const query = `*[_type == "blogPost" && defined(slug.current)]{
      "slug": slug.current
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching blog post slugs:', error);
    return [];
  }
}
