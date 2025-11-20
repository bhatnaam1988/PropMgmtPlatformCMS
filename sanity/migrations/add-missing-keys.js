import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

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

function addKeysToArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => {
    if (typeof item === 'object' && item !== null && !item._key) {
      return { ...item, _key: uuidv4() };
    }
    return item;
  });
}

function addKeysRecursively(obj) {
  if (Array.isArray(obj)) {
    return addKeysToArray(obj).map(item => addKeysRecursively(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = addKeysRecursively(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function fixDocument(docType) {
  console.log(`\n🔧 Fixing ${docType}...`);
  
  const doc = await client.fetch(`*[_type == "${docType}"][0]`);
  
  if (!doc) {
    console.log(`   ❌ Document not found`);
    return;
  }
  
  // Add _key to all array items recursively
  const fixedDoc = addKeysRecursively(doc);
  
  await client.createOrReplace(fixedDoc);
  console.log(`   ✅ Fixed and updated`);
}

async function main() {
  console.log('🚀 Adding missing _key properties to all documents...\n');
  
  const docTypes = [
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
  
  for (const docType of docTypes) {
    await fixDocument(docType);
  }
  
  console.log('\n✅ All documents fixed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
