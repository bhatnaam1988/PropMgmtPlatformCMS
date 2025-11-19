const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Images to upload
const imagesToUpload = [
  {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920',
    name: 'cleaning-services-hero',
    alt: 'Professional cleaning service in modern vacation rental'
  },
  {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920',
    name: 'rental-services-hero',
    alt: 'Beautiful Swiss Alpine chalet managed as vacation rental'
  },
  {
    url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920',
    name: 'jobs-hero',
    alt: 'Team meeting in Swiss Alpine office'
  }
];

async function uploadImageToSanity(imageUrl, imageName, altText) {
  try {
    console.log(`📥 Downloading ${imageName}...`);
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`⬆️  Uploading ${imageName} to Sanity...`);
    const asset = await client.assets.upload('image', buffer, {
      filename: `${imageName}.jpg`,
    });
    
    console.log(`✅ Uploaded ${imageName}: ${asset._id}`);
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: altText
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${imageName}:`, error);
    return null;
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting image upload to Sanity CDN...\n');
  
  const uploadedImages = {};
  
  for (const img of imagesToUpload) {
    const result = await uploadImageToSanity(img.url, img.name, img.alt);
    if (result) {
      uploadedImages[img.name] = result;
    }
  }
  
  console.log('\n✨ All images uploaded successfully!');
  console.log('\nUploaded Image References:');
  console.log(JSON.stringify(uploadedImages, null, 2));
  
  return uploadedImages;
}

uploadAllImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  });
