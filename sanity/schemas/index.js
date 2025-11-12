// Import all schema types
import heroSection from './heroSection';
import page from './page';
import blogPost from './blogPost';
import author from './author';
import category from './category';
import propertyAugmentation from './propertyAugmentation';
import navigation from './navigation';
import footer from './footer';
import seo from './seo';

// Content blocks
import textBlock from './blocks/textBlock';
import imageBlock from './blocks/imageBlock';
import ctaBlock from './blocks/ctaBlock';
import featureGrid from './blocks/featureGrid';
import testimonialBlock from './blocks/testimonialBlock';

export const schemaTypes = [
  // Document types
  heroSection,
  page,
  blogPost,
  author,
  category,
  propertyAugmentation,
  navigation,
  footer,
  
  // Object types
  seo,
  
  // Content blocks
  textBlock,
  imageBlock,
  ctaBlock,
  featureGrid,
  testimonialBlock,
];
