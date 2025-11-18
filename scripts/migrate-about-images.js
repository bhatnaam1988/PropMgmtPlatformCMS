/**
 * About Page Image Migration Script
 * Downloads and uploads About page images to Sanity
 */

import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SANITY_API_TOKEN = 'skZRlQ73VpCchEOureYWpV6yjWGwZ5d4DieEDCT1AA7z1uB0qfR31rI5StaW65WOWhl9xkcfx5RB7wA4rWfH1rvtIexqmF1A6n9tC57VfvxggJkpAQvnIpMrF5xWm98NQ9im4w1VpesYZX2PFFwrX1cPiOe9ve22gMCi1g2ux7I6PbKhjA3b';

const client = createClient({
  projectId: 'vrhdu6hl',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

// About page images
const aboutImages = {
  hero: {
    url: 'https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NTc4Mzk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Swiss Alpine village with traditional chalets and mountain views',
  },
};

async function downloadImage(url, filename) {
  console.log(`📥 Downloading: ${filename}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${filename}: ${response.statusText}`);
  
  const buffer = await response.arrayBuffer();
  const tempPath = join('/tmp', filename);
  await writeFile(tempPath, Buffer.from(buffer));
  console.log(`✅ Downloaded: ${filename}`);
  return tempPath;
}

async function uploadToSanity(imagePath, altText) {
  console.log(`📤 Uploading to Sanity: ${imagePath}...`);
  
  try {
    const imageAsset = await client.assets.upload('image', createReadStream(imagePath), {
      filename: imagePath.split('/').pop(),
    });
    
    console.log(`✅ Uploaded to Sanity: ${imageAsset._id}`);
    
    // Clean up temp file
    await unlink(imagePath);
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
      alt: altText,
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${imagePath}:`, error.message);
    throw error;
  }
}

async function updateAboutPage(heroImage) {
  console.log('📝 Updating About Page Settings with hero image...');
  
  const updated = await client
    .patch('aboutSettings')
    .set({
      'heroSection.image': heroImage,
    })
    .commit();
  
  console.log('✅ About Page Settings updated with hero image');
  return updated;
}

async function migrateImages() {
  console.log('🚀 Starting About page image migration to Sanity...\n');
  
  try {
    // Download and upload About page hero image
    console.log('📷 Processing About Page Hero Image...');
    const heroPath = await downloadImage(aboutImages.hero.url, 'about-hero.jpg');
    const heroImage = await uploadToSanity(heroPath, aboutImages.hero.alt);
    
    // Update About page document
    console.log('\n📝 Updating Sanity About Page document...');
    await updateAboutPage(heroImage);
    
    console.log('\n🎉 About page image migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Login to Sanity Studio');
    console.log('2. Go to About Page Settings');
    console.log('3. You should now see the hero image in the Hero Section');
    console.log('4. You can edit, crop, or replace the image as needed');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateImages().catch(console.error);
