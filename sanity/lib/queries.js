import { groq } from 'next-sanity';

// Hero Section Query
export const heroQuery = groq`
  *[_type == "heroSection" && page == $page][0] {
    _id,
    heading,
    subheading,
    ctaText,
    ctaLink,
    backgroundImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    }
  }
`;

// Page Content Query
export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    seo {
      metaTitle,
      metaDescription,
      keywords
    },
    content[] {
      _type,
      _key,
      ...,
      image {
        asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        alt
      }
    }
  }
`;

// Blog Posts Query
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author-> {
      name,
      image
    },
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    categories[]-> {
      title
    }
  }
`;

// Single Blog Post Query
export const blogPostQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author-> {
      name,
      bio,
      image {
        asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        }
      }
    },
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    body,
    categories[]-> {
      title,
      slug
    }
  }
`;

// Property Augmentation Query
export const propertyAugmentationQuery = groq`
  *[_type == "propertyAugmentation" && uplistingId == $uplistingId][0] {
    _id,
    uplistingId,
    customTitle,
    customDescription,
    highlightedFeatures,
    additionalImages[] {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      caption
    }
  }
`;

// Navigation Query
export const navigationQuery = groq`
  *[_type == "navigation" && name == "main"][0] {
    _id,
    items[] {
      _key,
      text,
      link,
      children[] {
        _key,
        text,
        link
      }
    }
  }
`;

// Footer Query
export const footerQuery = groq`
  *[_type == "footer"][0] {
    _id,
    sections[] {
      _key,
      title,
      links[] {
        _key,
        text,
        url
      }
    },
    socialLinks[] {
      _key,
      platform,
      url
    },
    copyrightText
  }
`;
