/**
 * Migration Script: Remove Pricing Section from Cleaning Services
 * 
 * This script removes the pricingSection field from the cleaning services document
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function removePricingSection() {
  console.log('🔄 Removing Pricing Section from Cleaning Services...\n');

  try {
    // Fetch the document
    const doc = await client.fetch(
      `*[_type == "cleaningServicesSettingsHybrid"][0]`
    );

    if (!doc) {
      console.log('❌ No cleaning services document found.');
      return;
    }

    console.log('📄 Found document:', doc._id);
    
    if (doc.pricingSection) {
      console.log('🗑️  Removing pricingSection field...');
      
      // Use unset to remove the field
      const result = await client
        .patch(doc._id)
        .unset(['pricingSection'])
        .commit();
      
      console.log('✅ Successfully removed pricingSection field');
      console.log('📊 Updated document ID:', result._id);
    } else {
      console.log('✅ pricingSection field does not exist (already removed or never existed)');
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
removePricingSection()
  .then(() => {
    console.log('\n✨ All done! Please refresh Sanity Studio to see the changes.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
