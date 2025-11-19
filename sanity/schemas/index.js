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

// Page Settings (Hybrid Approach)
import homeSettingsHybrid from './settings/homeSettingsHybrid';
import aboutSettingsHybrid from './settings/aboutSettingsHybrid';
import contactSettingsHybrid from './settings/contactSettingsHybrid';
import cleaningServicesSettingsHybrid from './settings/cleaningServicesSettingsHybrid';
import rentalServicesSettingsHybrid from './settings/rentalServicesSettingsHybrid';
import jobsSettingsHybrid from './settings/jobsSettingsHybrid';
import legalSettingsHybrid from './settings/legalSettingsHybrid';
import graechenSettingsHybrid from './settings/graechenSettingsHybrid';

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
  
  // Page Settings (Hybrid Approach)
  homeSettingsHybrid,
  aboutSettingsHybrid,
  contactSettingsHybrid,
  cleaningServicesSettingsHybrid,
  rentalServicesSettingsHybrid,
  jobsSettingsHybrid,
  legalSettingsHybrid,
  graechenSettingsHybrid,
  
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
