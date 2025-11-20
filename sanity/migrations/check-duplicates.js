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

const settingsTypes = [
  'homeSettingsHybrid',
  'aboutSettingsHybrid',
  'contactSettingsHybrid',
  'cleaningServicesSettingsHybrid',
  'rentalServicesSettingsHybrid',
  'jobsSettingsHybrid',
  'legalSettingsHybrid',
  'graechenSettingsHybrid',
  'travelTipsSettingsHybrid',
  'behindTheScenesSettingsHybrid',
  'otherLocationsSettingsHybrid'
];

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate documents...\n');
  
  for (const type of settingsTypes) {
    const query = `*[_type == "${type}"]{_id, _createdAt, _updatedAt}`;
    const docs = await client.fetch(query);
    
    if (docs.length > 1) {
      console.log(`⚠️  Found ${docs.length} documents for ${type}:`);
      docs.forEach((doc, i) => {
        console.log(`   ${i + 1}. ID: ${doc._id}`);
        console.log(`      Created: ${new Date(doc._createdAt).toLocaleString()}`);
        console.log(`      Updated: ${new Date(doc._updatedAt).toLocaleString()}`);
      });
      
      // Keep the one with the correct ID format and delete others
      const correctDoc = docs.find(d => d._id === type);
      const drafts = docs.filter(d => d._id.startsWith('drafts.'));
      const others = docs.filter(d => d._id !== type && !d._id.startsWith('drafts.'));
      
      console.log(`   ✅ Keeping: ${correctDoc ? correctDoc._id : docs[0]._id}`);
      
      // Delete drafts
      for (const draft of drafts) {
        console.log(`   🗑️  Deleting draft: ${draft._id}`);
        await client.delete(draft._id);
      }
      
      // Delete other non-standard IDs
      for (const other of others) {
        if (other._id !== type) {
          console.log(`   🗑️  Deleting duplicate: ${other._id}`);
          await client.delete(other._id);
        }
      }
      
      console.log('');
    } else if (docs.length === 1) {
      console.log(`✅ ${type}: 1 document (${docs[0]._id})`);
    } else {
      console.log(`❌ ${type}: No documents found!`);
    }
  }
  
  console.log('\n✅ Duplicate check complete!');
}

checkDuplicates().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
