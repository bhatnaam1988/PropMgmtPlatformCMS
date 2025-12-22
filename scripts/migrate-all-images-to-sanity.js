#!/usr/bin/env node
/**
 * Sanity Image Migration Script
 * Downloads images from Unsplash and uploads them to Sanity CDN
 * 
 * Usage: node scripts/migrate-all-images-to-sanity.js
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Sanity configuration
const SANITY_PROJECT_ID = 'vrhdu6hl';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_TOKEN = 'skaa51stG1QnhmY1ENuHE7kozwvo3Kp6rH2SUtbzeO9l2qvJXAYgK1YQWV5sTepwc6z4A6dTpSFa6gXcmR358cSP3zkvfJhTQ17Qb75S5wfPemyWcPK3cWfabdjl9NjM4z3pi6Jp4Ogtm6d4F8I80tD6SmuCdp1vjasE8Jsgw9OewM7bKb7k';

// Initialize Sanity client with write token
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

// Helper: Download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    // Construct full Unsplash URL with quality params
    const fullUrl = url.includes('?') 
      ? `${url}&w=1920&q=85&fm=jpg`
      : `${url}?w=1920&q=85&fm=jpg`;
    
    console.log(`  📥 Downloading: ${fullUrl.substring(0, 80)}...`);
    
    https.get(fullUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }
      
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Helper: Upload image to Sanity
async function uploadToSanity(imageBuffer, filename, description) {
  try {
    console.log(`  📤 Uploading to Sanity: ${filename}`);
    
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      contentType: 'image/jpeg',
      title: description,
      description: description
    });
    
    console.log(`  ✅ Uploaded! Asset ID: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ❌ Upload failed: ${error.message}`);
    throw error;
  }
}

// Main migration function
async function migrateImages() {
  console.log('\n🚀 Starting Sanity Image Migration\n');
  console.log(`Project: ${SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${SANITY_DATASET}`);
  console.log(`Total images to migrate: ${mapping.images.length}\n`);
  
  const results = [];
  
  for (let i = 0; i < mapping.images.length; i++) {
    const image = mapping.images[i];
    console.log(`\n[${i + 1}/${mapping.images.length}] Processing: ${image.id}`);
    console.log(`  Description: ${image.description}`);
    
    try {
      // Download image
      const imageBuffer = await downloadImage(image.originalUrl);
      console.log(`  ✅ Downloaded (${(imageBuffer.length / 1024).toFixed(2)} KB)`);
      
      // Upload to Sanity
      const filename = `${image.id}.jpg`;
      const asset = await uploadToSanity(imageBuffer, filename, image.description);
      
      // Update mapping with asset ID
      image.sanityAssetId = asset._id;
      image.sanityUrl = asset.url;
      
      results.push({
        id: image.id,
        success: true,
        assetId: asset._id,
        url: asset.url
      });
      
      console.log(`  🎉 Success!`);
      
    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}`);
      results.push({
        id: image.id,
        success: false,
        error: error.message
      });
    }
    
    // Small delay to avoid rate limits
    if (i < mapping.images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Save updated mapping
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n💾 Updated mapping saved to: ${mappingPath}`);
  
  // Print summary
  console.log('\n📊 Migration Summary:');
  console.log(`  ✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`  ❌ Failed: ${results.filter(r => !r.success).length}`);
  console.log(`  📦 Total: ${results.length}`);
  
  if (results.some(r => !r.success)) {
    console.log('\n⚠️  Some images failed to migrate. Check the logs above.');
    process.exit(1);
  }
  
  console.log('\n✅ All images migrated successfully!\n');
}

// Run migration
migrateImages().catch(error => {
  console.error('\n💥 Migration failed:', error);
  process.exit(1);
});
