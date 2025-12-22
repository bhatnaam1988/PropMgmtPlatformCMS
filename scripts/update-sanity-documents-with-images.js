#!/usr/bin/env node
/**
 * Sanity Document Update Script
 * Updates Sanity documents with new image references from CDN
 * 
 * Usage: node scripts/update-sanity-documents-with-images.js
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity configuration
const SANITY_PROJECT_ID = 'vrhdu6hl';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_TOKEN = 'skaa51stG1QnhmY1ENuHE7kozwvo3Kp6rH2SUtbzeO9l2qvJXAYgK1YQWV5sTepwc6z4A6dTpSFa6gXcmR358cSP3zkvfJhTQ17Qb75S5wfPemyWcPK3cWfabdjl9NjM4z3pi6Jp4Ogtm6d4F8I80tD6SmuCdp1vjasE8Jsgw9OewM7bKb7k';

// Initialize Sanity client
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token: SANITY_TOKEN,
  useCdn: false
});

// Load image mapping
const mappingPath = path.join(__dirname, 'sanity-image-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Document update configurations
const documentUpdates = [
  {
    documentType: 'homeSettingsHybrid',
    documentId: 'homeSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'hero-homepage'
      }
    ]
  },
  {
    documentType: 'graechenSettingsHybrid',
    documentId: 'graechenSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'hero-graechen'
      }
    ]
  },
  {
    documentType: 'travelTipsSettingsHybrid',
    documentId: 'travelTipsSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'autumn-hiking'
      }
    ]
  },
  {
    documentType: 'cleaningServicesSettingsHybrid',
    documentId: 'cleaningServicesSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'cleaning-services'
      }
    ]
  },
  {
    documentType: 'rentalServicesSettingsHybrid',
    documentId: 'rentalServicesSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'rental-services'
      }
    ]
  },
  {
    documentType: 'jobsSettingsHybrid',
    documentId: 'jobsSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'jobs-page'
      }
    ]
  },
  {
    documentType: 'aboutSettingsHybrid',
    documentId: 'aboutSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'about-hero'
      },
      {
        path: 'welcomeStory.image',
        imageId: 'about-welcome'
      },
      {
        path: 'whyChooseSection.image',
        imageId: 'about-whychoose'
      }
    ]
  },
  {
    documentType: 'behindTheScenesSettingsHybrid',
    documentId: 'behindTheScenesSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'behind-scenes'
      }
    ]
  },
  {
    documentType: 'otherLocationsSettingsHybrid',
    documentId: 'otherLocationsSettingsHybrid',
    updates: [
      {
        path: 'heroSection.backgroundImage',
        imageId: 'autumn-hiking'
      }
    ]
  }
];

// Helper: Find image asset ID by ID
function getAssetIdByImageId(imageId) {
  const image = mapping.images.find(img => img.id === imageId);
  if (!image || !image.sanityAssetId) {
    throw new Error(`Image not found in mapping: ${imageId}`);
  }
  return image.sanityAssetId;
}

// Helper: Create image reference object
function createImageReference(assetId) {
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId
    },
    alt: 'Swiss Alpine Journey'
  };
}

// Helper: Update document with patches
async function updateDocument(docType, docId, updates) {
  console.log(`\n📝 Updating: ${docType} (ID: ${docId})`);
  
  try {
    // Fetch current document
    const doc = await client.getDocument(docId);
    
    if (!doc) {
      console.log(`  ⚠️  Document not found, creating new one...`);
    }
    
    // Build patches
    const patches = updates.map(update => {
      const assetId = getAssetIdByImageId(update.imageId);
      const imageRef = createImageReference(assetId);
      
      console.log(`  📷 ${update.path} → ${update.imageId} (${assetId})`);
      
      return { path: update.path, value: imageRef };
    });
    
    // Apply patches
    let transaction = client.transaction();
    
    if (!doc) {
      // Create new document
      transaction = transaction.create({
        _id: docId,
        _type: docType,
        ...patches.reduce((acc, patch) => {
          const keys = patch.path.split('.');
          let current = acc;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = patch.value;
          return acc;
        }, {})
      });
    } else {
      // Patch existing document
      patches.forEach(patch => {
        transaction = transaction.patch(docId, p => p.set({ [patch.path]: patch.value }));
      });
    }
    
    await transaction.commit();
    
    console.log(`  ✅ Updated successfully!`);
    return { success: true, docId };
    
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return { success: false, docId, error: error.message };
  }
}

// Main update function
async function updateDocuments() {
  console.log('\n🚀 Starting Sanity Document Updates\n');
  console.log(`Project: ${SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${SANITY_DATASET}`);
  console.log(`Documents to update: ${documentUpdates.length}\n`);
  
  // Verify all images are uploaded
  const missingImages = mapping.images.filter(img => !img.sanityAssetId);
  if (missingImages.length > 0) {
    console.error('❌ Error: Some images are missing Sanity asset IDs:');
    missingImages.forEach(img => console.error(`  - ${img.id}`));
    console.error('\nPlease run migrate-all-images-to-sanity.js first.\n');
    process.exit(1);
  }
  
  const results = [];
  
  for (let i = 0; i < documentUpdates.length; i++) {
    const docConfig = documentUpdates[i];
    const result = await updateDocument(
      docConfig.documentType,
      docConfig.documentId,
      docConfig.updates
    );
    results.push(result);
    
    // Small delay between updates
    if (i < documentUpdates.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Print summary
  console.log('\n📊 Update Summary:');
  console.log(`  ✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`  ❌ Failed: ${results.filter(r => !r.success).length}`);
  console.log(`  📦 Total: ${results.length}`);
  
  if (results.some(r => !r.success)) {
    console.log('\n⚠️  Some documents failed to update. Check the logs above.');
    process.exit(1);
  }
  
  console.log('\n✅ All documents updated successfully!\n');
  console.log('🎉 Migration complete! Images are now served from Sanity CDN.\n');
}

// Run updates
updateDocuments().catch(error => {
  console.error('\n💥 Update failed:', error);
  process.exit(1);
});
