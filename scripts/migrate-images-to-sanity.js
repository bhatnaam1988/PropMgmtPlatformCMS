/**
 * Image Migration Script for Sanity CMS
 * Downloads images from URLs and uploads them to Sanity
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

// Image URLs from the website
const images = {
  homeHero: {
    url: 'https://images.unsplash.com/photo-1633341500706-62690376b1ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwwfHx8fDE3NjE2NjA4MTR8MA&ixlib=rb-4.1.0&q=85',
    alt: 'Scenic view of Swiss Alpine village with traditional chalets and snow-capped mountains',
  },
  homeGraechen: {
    url: 'https://images.unsplash.com/photo-1629114472586-19096663e723?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbiUyMGNoYWxldHxlbnwwfHx8fDE3NjE2NjA4MTR8MA&ixlib=rb-4.1.0&q=85',
    alt: 'Charming traditional Swiss chalet in Grächen village with wooden architecture and Alpine surroundings',
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

async function updateHomepage(heroImage, graechenImage) {
  console.log('📝 Updating Homepage Settings with images...');
  
  const homepage = await client.getDocument('homeSettings');
  
  const updated = await client
    .patch('homeSettings')
    .set({
      'heroSection.backgroundImage': heroImage,
    })
    .commit();
  
  console.log('✅ Homepage Settings updated with hero image');
  return updated;
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Sanity...\n');
  
  try {
    // Download and upload home hero image
    console.log('📷 Processing Homepage Hero Image...');
    const heroPath = await downloadImage(images.homeHero.url, 'home-hero.jpg');
    const heroImage = await uploadToSanity(heroPath, images.homeHero.alt);
    
    // Download and upload Grächen section image
    console.log('\n📷 Processing Grächen Section Image...');
    const graechenPath = await downloadImage(images.homeGraechen.url, 'home-graechen.jpg');
    const graechenImage = await uploadToSanity(graechenPath, images.homeGraechen.alt);
    
    // Update homepage document
    console.log('\n📝 Updating Sanity documents...');
    await updateHomepage(heroImage, graechenImage);
    
    console.log('\n🎉 Image migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Login to Sanity Studio');
    console.log('2. View Homepage Settings to see the uploaded images');
    console.log('3. Optionally upload more images for other pages');
    console.log('4. Edit content as needed');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateImages().catch(console.error);
