# Sanity CMS Integration Guide

## Overview

Your vacation rental application now includes a fully integrated Sanity CMS for managing blog posts, pages, and other content. This guide will help you get started with content management.

## Accessing the CMS

### Sanity Studio URL
**Local Development:** `http://localhost:3000/studio`
**Production:** `https://sanity-nextjs-pages.preview.emergentagent.com/studio`

### Login Options
- Google Account
- GitHub Account
- Email/Password

## Configuration Details

### Project Information
- **Project ID:** `vrhdu6hl`
- **Dataset:** `production`
- **API Version:** `2024-01-01`

### Environment Variables
The following environment variables are configured in your `.env` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=vrhdu6hl
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## Content Types Available

### 1. Blog Posts
Create and manage blog posts with:
- Title and SEO-friendly slug
- Featured image with alt text
- Author attribution
- Categories
- Rich text content with images
- Excerpt for previews
- SEO metadata (title, description, keywords, OG image)
- Publication date

**Frontend Display:**
- List page: `/blog`
- Individual posts: `/blog/[slug]`

### 2. Authors
Manage blog post authors with:
- Name and slug
- Profile image
- Bio

### 3. Categories
Organize blog posts with categories:
- Title and slug
- Description

### 4. Pages (Marketing Pages)
Create custom marketing pages with flexible content blocks:
- Text blocks
- Image blocks
- CTA blocks
- Feature grids
- Testimonials

### 5. Hero Sections
Manage hero sections for different pages with:
- Heading and subheading
- Background image
- Call-to-action button

### 6. Navigation & Footer
Manage site navigation and footer content dynamically.

### 7. Property Augmentation
Enhance Uplisting property data with:
- Custom titles and descriptions
- Highlighted features
- Additional images
- Local tips

## Creating Your First Blog Post

### Step 1: Access Sanity Studio
1. Navigate to `/studio`
2. Log in with your preferred method
3. You'll see the Sanity Studio dashboard

### Step 2: Create an Author (First Time Only)
1. Click on "Authors" in the left sidebar
2. Click "Create" button
3. Fill in:
   - Name (e.g., "Sarah Johnson")
   - Slug (auto-generated from name)
   - Upload profile image (optional)
   - Add bio (optional)
4. Click "Publish"

### Step 3: Create a Category (Optional)
1. Click on "Categories" in the left sidebar
2. Click "Create" button
3. Fill in:
   - Title (e.g., "Travel Tips")
   - Slug (auto-generated)
   - Description
4. Click "Publish"

### Step 4: Create a Blog Post
1. Click on "Blog Posts" in the left sidebar
2. Click "Create" button
3. Fill in the required fields:
   - **Title:** Your blog post title
   - **Slug:** Auto-generated (can be edited)
   - **Author:** Select the author you created
   - **Main Image:** Upload a featured image and provide alt text
   - **Categories:** Select relevant categories
   - **Published At:** Choose publication date
   - **Excerpt:** Brief summary (max 200 characters)
   - **Body:** Rich text content (see formatting options below)
   - **SEO Settings:** Optional but recommended
4. Click "Publish"

### Step 5: View Your Blog Post
1. Navigate to `/blog` on your website
2. Your blog post should appear in the listing
3. Click on it to view the full post at `/blog/[your-slug]`

## Rich Text Editor Features

When editing the blog post body, you have access to:

### Text Styles
- **Normal:** Regular paragraph text
- **H2:** Main section headings
- **H3:** Subsection headings
- **H4:** Minor headings
- **Quote:** Blockquotes for emphasis

### Formatting
- **Bold:** Strong emphasis
- **Italic:** Light emphasis
- **Links:** Add hyperlinks to external URLs

### Content Blocks
- **Text Blocks:** Regular paragraphs
- **Images:** Inline images with captions and alt text
- **Bullet Lists:** Unordered lists

### Adding Images to Body Content
1. Click the "+" button in the editor
2. Select "Image"
3. Upload your image
4. Provide alt text (required for accessibility)
5. Add caption (optional)

## SEO Best Practices

### Blog Post SEO
For each blog post, fill in the SEO Settings:

1. **Meta Title:** 50-60 characters (include primary keyword)
   - Example: "Best Hiking Trails in Grächen | Swiss Alpine Journey"

2. **Meta Description:** 150-160 characters (compelling summary)
   - Example: "Discover the top 5 hiking trails in Grächen, Switzerland. Expert tips, difficulty ratings, and stunning views await your alpine adventure."

3. **Keywords:** 5-10 relevant keywords
   - Examples: "Grächen hiking", "Swiss Alps trails", "mountain hiking"

4. **OG Image:** Upload a high-quality image (1200x630px recommended)

### Content Writing Tips
- Use descriptive headings (H2, H3)
- Keep paragraphs short and scannable
- Include relevant internal links to properties or other content
- Add images to break up text
- Use bullet points for lists
- Write engaging excerpts that encourage clicks

## Content Workflow

### Draft → Review → Publish
1. **Draft:** Create content in Sanity Studio
2. **Preview:** Use the preview feature to see how it looks
3. **Publish:** Click publish to make it live
4. **Update:** Content updates automatically (5-minute cache)

### Content Revalidation
- Blog listing page: Revalidates every 5 minutes
- Individual blog posts: Revalidate every 5 minutes
- Changes may take up to 5 minutes to appear on the frontend

## Sitemap Integration

Blog posts are automatically included in your sitemap at `/sitemap.xml`:
- Blog listing page: High priority (0.8)
- Individual posts: Medium-high priority (0.7)
- Updated daily for SEO

## Maintenance & Updates

### Adding New Content Types
To add new content types (schemas):
1. Create a new schema file in `/sanity/schemas/`
2. Import and add it to `/sanity/schemas/index.js`
3. Update `/app/lib/sanity.js` with helper functions
4. Create frontend pages to display the content

### Backing Up Content
Sanity provides automatic backups. You can also export data:
```bash
sanity dataset export production backup.tar.gz
```

### Managing Users
Add collaborators in Sanity's management console:
1. Go to https://sanity.io/manage
2. Select your project
3. Navigate to "Members"
4. Invite users with appropriate roles

## Troubleshooting

### "No blog posts yet" Message
- Make sure you've published at least one blog post in Sanity Studio
- Check that `publishedAt` date is not in the future
- Wait up to 5 minutes for cache revalidation

### Images Not Loading
- Verify image URLs in Sanity Studio
- Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` is correctly set
- Ensure images are published (not just in draft mode)

### Studio Not Loading
- Check that all Sanity environment variables are set correctly
- Verify project ID matches Sanity account
- Clear browser cache and try again

## Resources

### Official Documentation
- **Sanity Documentation:** https://www.sanity.io/docs
- **Next.js + Sanity:** https://www.sanity.io/guides/nextjs-app-router-live-preview
- **GROQ Query Language:** https://www.sanity.io/docs/groq

### Support
- **Sanity Community:** https://www.sanity.io/community
- **Sanity Slack:** https://slack.sanity.io/

## Content Strategy Tips

### Blog Content Ideas
1. **Travel Guides:** "Ultimate Guide to Winter in Grächen"
2. **Local Insights:** "Hidden Gems in the Swiss Alps"
3. **Practical Tips:** "What to Pack for Your Alpine Vacation"
4. **Property Spotlights:** Feature specific properties with stories
5. **Seasonal Content:** Activities by season
6. **Guest Stories:** Testimonials and experiences
7. **Behind the Scenes:** Property management insights

### Publishing Schedule
- Aim for 1-2 blog posts per week
- Plan content calendar in advance
- Mix evergreen and timely content
- Update older posts with new information

### Engagement
- End posts with calls-to-action
- Link to relevant properties
- Encourage comments (if enabled)
- Share on social media
- Monitor analytics to see what performs best

---

**Last Updated:** November 2024
**Integration Version:** 1.0
