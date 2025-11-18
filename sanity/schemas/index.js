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

// Page Settings
import homeSettings from './settings/homeSettings';
import aboutSettingsHybrid from './settings/aboutSettingsHybrid';
import contactSettings from './settings/contactSettings';
import servicePageSettings from './settings/servicePageSettings';
import explorePageSettings from './settings/explorePageSettings';
import jobsSettings from './settings/jobsSettings';
import legalSettings from './settings/legalSettings';

// Content blocks
import textBlock from './blocks/textBlock';
import imageBlock from './blocks/imageBlock';
import ctaBlock from './blocks/ctaBlock';
import featureGrid from './blocks/featureGrid';
import testimonialBlock from './blocks/testimonialBlock';
import statsBlock from './blocks/statsBlock';

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
  
  // Page Settings
  homeSettings,
  aboutSettings,
  aboutSettingsHybrid,
  contactSettings,
  servicePageSettings,
  explorePageSettings,
  jobsSettings,
  legalSettings,
  
  // Object types
  seo,
  
  // Content blocks
  textBlock,
  imageBlock,
  ctaBlock,
  featureGrid,
  testimonialBlock,
  statsBlock,
];
