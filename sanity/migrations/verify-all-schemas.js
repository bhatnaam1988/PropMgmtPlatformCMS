import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function verifyAllSchemas() {
  console.log('🔍 Checking all page settings for field presence...\n');
  
  const checks = [
    {
      name: 'homeSettingsHybrid',
      query: `*[_type == "homeSettingsHybrid"][0]{
        heroSection,
        ourListingsSection,
        homeBaseSection,
        activitiesSection,
        newsletterSection
      }`
    },
    {
      name: 'contactSettingsHybrid',
      query: `*[_type == "contactSettingsHybrid"][0]{
        heroSection,
        contactInfo,
        hoursSection,
        formSection
      }`
    },
    {
      name: 'cleaningServicesSettingsHybrid',
      query: `*[_type == "cleaningServicesSettingsHybrid"][0]{
        heroSection,
        servicesGrid,
        benefitsSection,
        pricingSection,
        formSection
      }`
    },
    {
      name: 'rentalServicesSettingsHybrid',
      query: `*[_type == "rentalServicesSettingsHybrid"][0]{
        heroSection,
        servicesGrid,
        benefitsSection,
        formSection
      }`
    },
    {
      name: 'jobsSettingsHybrid',
      query: `*[_type == "jobsSettingsHybrid"][0]{
        heroSection,
        valuesSection,
        openPositionsSection,
        applicationSection
      }`
    },
    {
      name: 'legalSettingsHybrid',
      query: `*[_type == "legalSettingsHybrid"][0]{
        pageHeader,
        navigationCards,
        termsSection,
        privacySection,
        gdprSection,
        footerText
      }`
    }
  ];
  
  for (const check of checks) {
    console.log(`\n📄 ${check.name}:`);
    const data = await client.fetch(check.query);
    
    if (!data) {
      console.log('   ❌ Document not found!');
      continue;
    }
    
    const fields = Object.keys(data);
    fields.forEach(field => {
      if (data[field] === undefined || data[field] === null) {
        console.log(`   ❌ Missing: ${field}`);
      } else if (typeof data[field] === 'object' && Object.keys(data[field]).length === 0) {
        console.log(`   ⚠️  Empty: ${field}`);
      } else {
        console.log(`   ✅ ${field}`);
      }
    });
  }
  
  console.log('\n✅ Verification complete!');
}

verifyAllSchemas().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
