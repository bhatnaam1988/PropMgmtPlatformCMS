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

// Helper to get homepage settings
export async function getHomeSettings() {
  try {
    const query = `*[_type == "homeSettings"][0]{
      title,
      heroSection,
      featuredSection,
      seo
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching home settings:', error);
    return null;
  }
}

// Helper to get about page settings (hybrid)
export async function getAboutSettingsHybrid() {
  try {
    const query = `*[_type == "aboutSettingsHybrid"][0]{
      heroSection{
        heading,
        subheading,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      welcomeStory{
        heading,
        paragraphs,
        image{
          asset->{
            _id,
            url
          },
          alt
        },
        ctaText,
        ctaLink
      },
      valuesSection{
        heading,
        description,
        values[]{
          icon,
          title,
          description
        }
      },
      statsSection{
        stats[]{
          number,
          label
        }
      },
      whyChooseSection{
        heading,
        image{
          asset->{
            _id,
            url
          },
          alt
        },
        points[]{
          title,
          description
        },
        links[]{
          text,
          url
        }
      },
      finalCTA{
        heading,
        description,
        buttonText,
        buttonLink
      },
      seo
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching about settings:', error);
    return null;
  }
}

// Helper to get about page settings (old)
export async function getAboutSettings() {
  try {
    const query = `*[_type == "aboutSettings"][0]{
      title,
      heroSection{
        heading,
        subheading,
        image{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      content,
      seo
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching about settings:', error);
    return null;
  }
}

// Helper to get contact page settings
export async function getContactSettings() {
  try {
    const query = `*[_type == "contactSettings"][0]{
      title,
      heroSection,
      contactInfo,
      formSettings,
      seo
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return null;
  }
}

// Helper to get service page settings by type
export async function getServicePageSettings(pageType) {
  try {
    const query = `*[_type == "servicePageSettings" && pageType == $pageType][0]{
      title,
      slug,
      heroSection{
        heading,
        subheading,
        image{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      content,
      features,
      formSettings,
      seo
    }`;
    return await sanityClient.fetch(query, { pageType });
  } catch (error) {
    console.error('Error fetching service page settings:', error);
    return null;
  }
}

// Helper to get explore page settings by type
export async function getExplorePageSettings(pageType) {
  try {
    const query = `*[_type == "explorePageSettings" && pageType == $pageType][0]{
      title,
      slug,
      heroSection{
        heading,
        subheading,
        image{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      content,
      seo
    }`;
    return await sanityClient.fetch(query, { pageType });
  } catch (error) {
    console.error('Error fetching explore page settings:', error);
    return null;
  }
}

// Helper to get jobs page settings
export async function getJobsSettings() {
  try {
    const query = `*[_type == "jobsSettings"][0]{
      title,
      heroSection,
      content,
      jobOpenings,
      applicationFormSettings,
      seo
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching jobs settings:', error);
    return null;
  }
}

// Helper to get legal page settings
export async function getLegalSettings() {
  try {
    const query = `*[_type == "legalSettings"][0]{
      title,
      sections,
      lastUpdated,
      seo
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching legal settings:', error);
    return null;
  }
}
