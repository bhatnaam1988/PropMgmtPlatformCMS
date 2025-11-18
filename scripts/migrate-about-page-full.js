/**
 * COMPLETE About Page Migration
 * Migrates all content and images to match website exactly
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

// Images to upload
const images = {
  interior1: {
    url: 'https://images.unsplash.com/photo-1628172225866-fbbec7bcbe9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscGluZSUyMGNoYWxldCUyMGludGVyaW9yfGVufDF8fHx8MTc1NzgzOTk4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Cozy Swiss alpine chalet interior with comfortable furnishings and warm lighting',
    filename: 'about-interior-1.jpg',
  },
  fireplace: {
    url: 'https://images.unsplash.com/photo-1578416043044-298e3d1da20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbW91bnRhaW4lMjBjaGFsZXQlMjBmaXJlcGxhY2V8ZW58MXx8fHwxNzU3ODM5OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Cozy mountain chalet interior with fireplace and comfortable seating area',
    filename: 'about-fireplace.jpg',
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

async function migrateAboutPage() {
  console.log('🚀 Starting COMPLETE About Page Migration...\n');
  
  try {
    // Step 1: Download and upload images
    console.log('📷 Step 1: Uploading Images...\n');
    
    console.log('Processing interior image #1...');
    const interior1Path = await downloadImage(images.interior1.url, images.interior1.filename);
    const interior1Image = await uploadToSanity(interior1Path, images.interior1.alt);
    
    console.log('\nProcessing fireplace image #2...');
    const fireplacePath = await downloadImage(images.fireplace.url, images.fireplace.filename);
    const fireplaceImage = await uploadToSanity(fireplacePath, images.fireplace.alt);
    
    // Step 2: Update About Page document
    console.log('\n📝 Step 2: Updating About Page Content...\n');
    
    const updatedAboutPage = {
      _type: 'aboutSettings',
      _id: 'aboutSettings',
      title: 'About Us',
      
      // Hero Section - Match website exactly
      heroSection: {
        heading: 'Our Story',
        subheading: 'Where authentic stays meet modern comfort and local adventure',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: 'image-3bc9f22ae7ef0bc4d003905bba8a4bfad5a9ef61-1080x608-jpg', // Existing hero image
          },
          alt: 'Swiss Alpine village with traditional chalets and mountain views',
        },
      },
      
      // Content blocks in exact order
      content: [
        // Section 2: Welcome Story
        {
          _key: 'welcomeStory',
          _type: 'textBlock',
          heading: 'Welcome to Swiss Alpine Journey',
          text: [
            {
              _key: 'p1',
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _key: 'span1',
                  _type: 'span',
                  text: "Our story begins in Grächen, where my grandfather built the first family apartments many years ago. What started as a place for our own family holidays has grown into a lasting commitment to share the beauty and comfort of the Swiss Alps with others.",
                  marks: [],
                },
              ],
            },
            {
              _key: 'p2',
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _key: 'span2',
                  _type: 'span',
                  text: "Having spent much of my life in these alps – hiking, working, and appreciating their rhythm through every season – I continue that tradition today by welcoming guests not only to my grandfather's original apartment, which I now own, but also to other carefully maintained homes I've acquired or help manage for local owners.",
                  marks: [],
                },
              ],
            },
            {
              _key: 'p3',
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _key: 'span3',
                  _type: 'span',
                  text: "For me, hosting is about reliability, thoughtful design, and ease. Each property is equipped with everything you need to settle in quickly and feel at home, so you can focus on what truly matters – whether that's relaxing in the alpine calm or setting out for new adventures on the trails and slopes.",
                  marks: [],
                },
              ],
            },
          ],
        },
        
        // Interior Image #1
        {
          _key: 'interiorImage1',
          _type: 'imageBlock',
          image: interior1Image,
          layout: 'contained',
        },
        
        // CTA after welcome story
        {
          _key: 'browseCta',
          _type: 'ctaBlock',
          buttonText: 'Browse Our Properties →',
          buttonLink: '/stay',
          style: 'secondary',
        },
        
        // Section 3: Our Values
        {
          _key: 'ourValues',
          _type: 'featureGrid',
          heading: 'Our Values',
          columns: 3,
          features: [
            {
              _key: 'value1',
              icon: 'Heart',
              title: 'Prime Locations',
              description: 'We select properties based on their proximity to village centers, ski areas, and outdoor activities for maximum convenience.',
            },
            {
              _key: 'value2',
              icon: 'Award',
              title: 'Quality Standards',
              description: 'Every property in our collection is carefully maintained and equipped with thoughtful amenities for a comfortable stay.',
            },
            {
              _key: 'value3',
              icon: 'Users',
              title: 'Local Expertise',
              description: "We're dedicated to helping you make the most of your Alpine experience with insider knowledge and personalized recommendations.",
            },
          ],
        },
        
        // Section 4: Stats
        {
          _key: 'stats',
          _type: 'statsBlock',
          stats: [
            {
              _key: 'stat1',
              number: '100+',
              label: 'Happy Families Hosted',
            },
            {
              _key: 'stat2',
              number: 'Airbnb Superhost',
              label: 'Since 2024',
            },
            {
              _key: 'stat3',
              number: '4.9',
              label: 'Average Rating',
            },
          ],
        },
        
        // Fireplace Image #2
        {
          _key: 'fireplaceImage',
          _type: 'imageBlock',
          image: fireplaceImage,
          layout: 'contained',
        },
        
        // Section 5: Why Choose Us
        {
          _key: 'whyChoose',
          _type: 'textBlock',
          heading: 'Why Choose Swiss Alpine Journey?',
          text: [
            {
              _key: 'why1',
              _type: 'block',
              style: 'h3',
              children: [
                {
                  _key: 'span1',
                  _type: 'span',
                  text: 'Strategic Selection',
                  marks: [],
                },
              ],
            },
            {
              _key: 'why1desc',
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _key: 'span2',
                  _type: 'span',
                  text: 'Every property is carefully chosen for its prime location near skiing, activities, and village amenities.',
                  marks: [],
                },
              ],
            },
            {
              _key: 'why2',
              _type: 'block',
              style: 'h3',
              children: [
                {
                  _key: 'span3',
                  _type: 'span',
                  text: 'Quality Maintenance',
                  marks: [],
                },
              ],
            },
            {
              _key: 'why2desc',
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _key: 'span4',
                  _type: 'span',
                  text: 'We personally visit and maintain every property, ensuring it meets our high standards for comfort and convenience.',
                  marks: [],
                },
              ],
            },
            {
              _key: 'why3',
              _type: 'block',
              style: 'h3',
              children: [
                {
                  _key: 'span5',
                  _type: 'span',
                  text: 'Always Here for You',
                  marks: [],
                },
              ],
            },
            {
              _key: 'why3desc',
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _key: 'span6',
                  _type: 'span',
                  text: 'Our dedicated support team is always available to ensure your stay is worry-free and everything runs smoothly.',
                  marks: [],
                },
              ],
            },
          ],
        },
        
        // CTAs after Why Choose
        {
          _key: 'contactCta',
          _type: 'ctaBlock',
          buttonText: 'Get in Touch →',
          buttonLink: '/contact',
          style: 'secondary',
        },
        {
          _key: 'graechenCta',
          _type: 'ctaBlock',
          buttonText: 'Explore Grächen →',
          buttonLink: '/explore/graechen',
          style: 'secondary',
        },
        
        // Section 6: Final CTA
        {
          _key: 'finalCta',
          _type: 'ctaBlock',
          heading: 'Ready to Plan Your Journey?',
          text: 'Let us help you discover your perfect Swiss home base. Browse our collection of thoughtfully located homes and start planning your next journey in Switzerland.',
          buttonText: 'Plan Your Journey',
          buttonLink: '/stay',
          style: 'primary',
        },
      ],
      
      // SEO
      seo: {
        metaTitle: 'About Us | Swiss Alpine Journey',
        metaDescription: 'Learn about Swiss Alpine Journey. Family-owned vacation rental company in Grächen offering quality properties with authentic Swiss alpine hospitality.',
        keywords: ['Swiss Alpine Journey', 'vacation rental company', 'Grächen property management', 'alpine hospitality', 'family-owned business'],
      },
    };
    
    // Replace entire document
    await client.createOrReplace(updatedAboutPage);
    
    console.log('✅ About Page updated successfully!\n');
    
    console.log('🎉 Migration Complete!\n');
    console.log('📝 Summary:');
    console.log('- ✅ Hero section updated (heading + subheading)');
    console.log('- ✅ Welcome Story added (3 paragraphs)');
    console.log('- ✅ Interior image #1 uploaded and added');
    console.log('- ✅ Our Values updated (3 values with correct icons)');
    console.log('- ✅ Stats section added (100+, Superhost, 4.9)');
    console.log('- ✅ Fireplace image #2 uploaded and added');
    console.log('- ✅ Why Choose Us section added (3 points)');
    console.log('- ✅ All CTAs and links added');
    console.log('- ✅ Final CTA section added');
    console.log('\n📋 Next steps:');
    console.log('1. Login to Sanity Studio');
    console.log('2. View About Page Settings');
    console.log('3. Verify all 6 sections match the website');
    console.log('4. Test editing and adding content');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateAboutPage().catch(console.error);
