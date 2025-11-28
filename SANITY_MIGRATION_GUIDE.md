# Sanity CMS Migration Guide

## Overview

All website pages have been prepared for Sanity CMS management. This guide explains how to set up and use the content management system for each page.

## What's Been Created

### ✅ Sanity Schemas (Content Types)

1. **Homepage Settings** - Manage homepage hero and featured sections
2. **About Page Settings** - Full about page content management  
3. **Contact Page Settings** - Contact info and form configuration
4. **Service Pages** - Cleaning Services & Rental Services pages
5. **Explore Pages** - Grächen, Travel Tips, Behind the Scenes, Other Locations
6. **Jobs Page Settings** - Careers page and job listings
7. **Legal Page Settings** - Terms, privacy policy content

### ✅ Supporting Components

- **SanityContentRenderer** - Renders flexible content blocks
- **Helper Functions** - Fetch settings from Sanity
- **Content Blocks** - Text, images, CTAs, features, testimonials

## Setting Up Your Content

### Step 1: Access Sanity Studio

1. Go to: `https://rental-fix.preview.emergentagent.com/studio`
2. Login with your credentials
3. Click **"Content"** in the left sidebar

### Step 2: Create Content for Each Page

#### Homepage Settings

1. Click **"Homepage Settings"** → **"Create"**
2. Fill in:
   - **Page Title**: "Swiss Alpine Journey - Vacation Rentals"
   - **Hero Section**:
     - Heading: "Swiss Alpine Journey"
     - Subheading: "Where authentic stays meet modern comfort"
     - Background Image: Upload a stunning Alpine landscape
   - **Featured Section**:
     - Heading: "Our listings"
     - Description: Browse our collection...
   - **SEO Settings**: Meta title, description, keywords
3. Click **"Publish"**

#### About Page Settings

1. Click **"About Page Settings"** → **"Create"**
2. Fill in:
   - **Title**: "About Us"
   - **Hero Section**: Heading, subheading, hero image
   - **Content**: Add content blocks:
     - Text blocks for your story
     - Image blocks for team photos
     - Feature grids for company values
     - Testimonials from satisfied clients
3. Click **"Publish"**

#### Contact Page Settings

1. Click **"Contact Page Settings"** → **"Create"**
2. Fill in:
   - **Title**: "Contact Us"
   - **Hero Section**: Heading and subheading
   - **Contact Info**:
     - Email: your@email.com
     - Phone: +41 XX XXX XX XX
     - Address: Your physical address
     - Hours: Business hours
   - **Form Settings**: Customize form heading and description
3. Click **"Publish"**

#### Service Pages

1. Click **"Service Pages"** → **"Create"**
2. For **Cleaning Services**:
   - Service Type: Select "Cleaning Services"
   - Title: "Professional Cleaning Services"
   - Slug: "cleaning-services"
   - Hero Section: Add heading, subheading, image
   - Features: Add service features (e.g., "Deep Cleaning", "Eco-Friendly")
   - Content: Add detailed content blocks
3. Repeat for **Rental Services**
4. Click **"Publish"**

#### Explore Pages

1. Click **"Explore Pages"** → **"Create"**
2. Create one for each:
   - **Grächen** (pageType: graechen, slug: graechen)
   - **Other Locations** (pageType: other-locations, slug: other-locations)
   - **Travel Tips** (pageType: travel-tips, slug: travel-tips)
   - **Behind the Scenes** (pageType: behind-the-scenes, slug: behind-the-scenes)
3. For each page:
   - Add hero section with stunning images
   - Build content using text blocks, images, CTAs
   - Add feature grids for highlights
   - Set SEO metadata
4. Click **"Publish"**

#### Jobs Page Settings

1. Click **"Jobs Page Settings"** → **"Create"**
2. Fill in:
   - Title: "Careers"
   - Hero Section: Career page introduction
   - Content: Company culture, benefits
   - **Job Openings**: Add individual job listings:
     - Job Title: "Property Manager"
     - Department: "Operations"
     - Location: "Grächen, Switzerland"
     - Type: "Full-time"
     - Description: Job details
3. Click **"Publish"**

#### Legal Page Settings

1. Click **"Legal Page Settings"** → **"Create"**
2. Add sections:
   - **Terms & Conditions**
   - **Privacy Policy**
   - **GDPR Compliance**
   - **Cookie Policy**
3. For each section, use rich text editor for formatting
4. Set "Last Updated" date
5. Click **"Publish"**

## Content Blocks Explained

### Text Block
- Heading + rich text content
- Use for main content areas
- Supports H2, H3 headings, paragraphs, lists

### Image Block
- Full-width or contained images
- Add captions for context
- Great for breaking up text

### CTA Block
- Call-to-action sections
- Includes heading, text, button
- Choose button style (primary, secondary, accent)

### Feature Grid
- Display features in 2, 3, or 4 columns
- Add icons (Lucide icons)
- Perfect for highlighting services or benefits

### Testimonial Block
- Customer reviews
- Include photo, name, title, rating
- Builds trust and credibility

## Next Steps for Full Integration

To make these pages live on your website, the page components need to be updated to fetch and display Sanity content. Here's what needs to be done:

### Pages Requiring Updates:

1. **Homepage** (`/app/app/page.js`)
   - Fetch homeSettings
   - Display hero from Sanity
   - Keep property listings (from Uplisting API)

2. **About Page** (`/app/app/about/page.js`)
   - Fetch aboutSettings
   - Render content blocks

3. **Contact Page** (`/app/app/contact/page.js`)
   - Fetch contactSettings
   - Display contact info from Sanity
   - Keep form functionality

4. **Service Pages** (`/app/app/cleaning-services/page.js` & `/rental-services/page.js`)
   - Fetch servicePageSettings by type
   - Render content blocks
   - Keep form functionality

5. **Explore Pages** (all under `/app/app/explore/`)
   - Fetch explorePageSettings by type
   - Render content blocks

6. **Jobs Page** (`/app/app/jobs/page.js`)
   - Fetch jobsSettings
   - Display job openings
   - Keep application form

7. **Legal Page** (`/app/app/legal/page.js`)
   - Fetch legalSettings
   - Render sections

## Example: Updated Page Component Pattern

```javascript
import { getHomeSettings } from '@/lib/sanity';
import { SanityContentRenderer } from '@/components/SanityContentRenderer';

export default async function HomePage() {
  const settings = await getHomeSettings();
  
  // Fallback if no Sanity content yet
  const heroHeading = settings?.heroSection?.heading || 'Swiss Alpine Journey';
  
  return (
    <main>
      {/* Hero Section from Sanity */}
      <section>
        <h1>{heroHeading}</h1>
        {/* ... */}
      </section>
      
      {/* Existing property listings from Uplisting */}
      {/* Keep as-is */}
    </main>
  );
}
```

## Testing Your Content

1. Create content in Sanity Studio
2. Wait up to 5 minutes for cache revalidation
3. Visit the page on your website
4. Verify content displays correctly
5. Edit in Sanity, republish, and verify updates

## Benefits of This Setup

✅ **Non-Technical Editing** - Update content without coding
✅ **Flexible Content** - Mix and match content blocks
✅ **SEO Control** - Manage metadata for each page
✅ **Preview** - See changes before publishing
✅ **Version History** - Sanity tracks all changes
✅ **Image Management** - CDN-hosted, optimized images
✅ **Rich Text** - Proper formatting and styling

## Support

If you need help:
1. Refer to `SANITY_CMS_GUIDE.md` for general Sanity usage
2. Contact for technical implementation of page updates
3. Sanity docs: https://www.sanity.io/docs

---

**Status**: Schemas created ✅ | Helper functions ready ✅ | Pages need integration ⏳

**Next**: Would you like me to update specific pages to fetch from Sanity, or would you like to populate content in Studio first and then integrate?
