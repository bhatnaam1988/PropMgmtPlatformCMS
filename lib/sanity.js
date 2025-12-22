import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'temp-project',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // Set to false to get fresh data for image updates
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

// ========================================
// Hybrid Settings Helpers
// ========================================

// Helper to get homepage settings
export async function getHomeSettings() {
  try {
    const query = `*[_type == "homeSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      homeBaseSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching home settings:', error);
    return null;
  }
}

// Helper to get contact page settings
export async function getContactSettings() {
  try {
    const query = `*[_type == "contactSettingsHybrid"][0]`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return null;
  }
}

// Helper to get cleaning services page settings
export async function getCleaningServicesSettings() {
  try {
    const query = `*[_type == "cleaningServicesSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching cleaning services settings:', error);
    return null;
  }
}

// Helper to get rental services page settings
export async function getRentalServicesSettings() {
  try {
    const query = `*[_type == "rentalServicesSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching rental services settings:', error);
    return null;
  }
}

// Helper to get jobs page settings
export async function getJobsSettings() {
  try {
    const query = `*[_type == "jobsSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }
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
    const query = `*[_type == "legalSettingsHybrid"][0]`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching legal settings:', error);
    return null;
  }
}

// Helper to get Grächen page settings
export async function getGraechenSettings() {
  try {
    const query = `*[_type == "graechenSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      mountainViewsSection{
        ...,
        image{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching Grächen settings:', error);
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

// Helper to get travel tips page settings
export async function getTravelTipsSettings() {
  try {
    const query = `*[_type == "travelTipsSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching travel tips settings:', error);
    return null;
  }
}

// Helper to get behind the scenes page settings
export async function getBehindTheScenesSettings() {
  try {
    const query = `*[_type == "behindTheScenesSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching behind the scenes settings:', error);
    return null;
  }
}

// Helper to get other locations page settings
export async function getOtherLocationsSettings() {
  try {
    const query = `*[_type == "otherLocationsSettingsHybrid"][0]{
      ...,
      heroSection{
        ...,
        backgroundImage{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      locationsSection{
        ...,
        locations[]{
          ...,
          image{
            asset->{
              _id,
              url
            },
            alt
          }
        }
      },
      graechenCTA{
        ...,
        image{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching other locations settings:', error);
    return null;
  }
}

// ========================================
// Header & Footer Navigation Helpers
// ========================================

// Helper to get header/main navigation
export async function getHeaderNavigation() {
  try {
    const query = `*[_type == "navigation" && name == "header"][0]{
      name,
      items[]{
        text,
        link,
        children[]{
          text,
          link
        }
      }
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching header navigation:', error);
    return null;
  }
}

// Helper to get footer content
export async function getFooterContent() {
  try {
    const query = `*[_type == "footer"][0]{
      sections[]{
        title,
        links[]{
          text,
          url
        }
      },
      socialLinks[]{
        platform,
        url
      },
      copyrightText
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return null;
  }
}
