# Header & Footer Management via Sanity CMS

## Overview
The Header navigation and Footer content can now be managed through Sanity Studio. This allows non-technical users to update links, sections, and content without modifying code.

---

## Accessing Sanity Studio

1. Navigate to: `https://rental-fix.preview.emergentagent.com/studio`
2. Log in with your Sanity credentials
3. You'll see the content management dashboard

---

## Managing Header Navigation

### Location in Sanity Studio
- Go to **"Navigation"** in the sidebar
- Look for or create a document with `name: "header"`

### Structure

The header navigation document contains:
- **Name**: Set this to `"header"` (required identifier)
- **Items**: Array of navigation links

Each navigation item has:
- **Text**: The label displayed (e.g., "Stay", "Explore", "About")
- **Link**: The URL path (e.g., "/stay", "/blog", "#")
- **Children**: Optional array for dropdown items
  - Each child has **Text** and **Link**

### Example: Current Header Configuration

```json
{
  "_type": "navigation",
  "name": "header",
  "items": [
    {
      "text": "Stay",
      "link": "/stay",
      "children": []
    },
    {
      "text": "Explore",
      "link": "#",
      "children": [
        { "text": "Grächen", "link": "/explore/graechen" },
        { "text": "Other Locations", "link": "/explore/other-locations" },
        { "text": "Travel Tips", "link": "/explore/travel-tips" },
        { "text": "Behind the Scenes", "link": "/explore/behind-the-scenes" }
      ]
    },
    {
      "text": "Blog",
      "link": "/blog",
      "children": []
    },
    {
      "text": "Services",
      "link": "#",
      "children": [
        { "text": "Cleaning Services", "link": "/cleaning-services" },
        { "text": "Rental Services", "link": "/rental-services" }
      ]
    },
    {
      "text": "About",
      "link": "#",
      "children": [
        { "text": "About", "link": "/about" },
        { "text": "Contact", "link": "/contact" },
        { "text": "Careers", "link": "/jobs" }
      ]
    }
  ]
}
```

### How to Edit Header

1. **Add a new top-level menu item:**
   - Click "Add item" in the Items array
   - Enter Text (label) and Link (URL)
   - Leave Children empty if no dropdown needed

2. **Add a dropdown menu:**
   - In an existing item, click "Add item" in the Children array
   - Add Text and Link for each dropdown option

3. **Remove an item:**
   - Click the trash icon next to the item you want to remove

4. **Reorder items:**
   - Drag and drop items using the handle icon

5. **Save:**
   - Click "Publish" to make changes live

---

## Managing Footer Content

### Location in Sanity Studio
- Go to **"Footer"** in the sidebar
- Create or edit the footer document

### Structure

The footer document contains:
- **Sections**: Array of footer columns
- **Social Links**: Array of social media links
- **Copyright Text**: Footer copyright notice

#### Footer Sections (Columns)

Each section has:
- **Title**: Column heading (e.g., "Services", "Legal")
- **Links**: Array of links with:
  - **Text**: Link label
  - **URL**: Link destination

#### Social Links

Each social link has:
- **Platform**: Select from dropdown (Instagram, Facebook, etc.)
- **URL**: Full URL to social media profile

### Example: Current Footer Configuration

```json
{
  "_type": "footer",
  "sections": [
    {
      "title": "Services",
      "links": [
        { "text": "Cleaning Services", "url": "/cleaning-services" },
        { "text": "Rental Management", "url": "/rental-services" },
        { "text": "Careers", "url": "/jobs" }
      ]
    },
    {
      "title": "Legal",
      "links": [
        { "text": "Privacy Policy", "url": "/legal#privacy" },
        { "text": "Terms & Conditions", "url": "/legal#terms" },
        { "text": "GDPR Information", "url": "/legal#gdpr" }
      ]
    }
  ],
  "socialLinks": [
    {
      "platform": "instagram",
      "url": "https://instagram.com/swissalpinejourney"
    }
  ],
  "copyrightText": "© 2024 Swiss Alpine Journey. All rights reserved."
}
```

### How to Edit Footer

1. **Add a new footer column:**
   - Click "Add item" in Sections
   - Enter Title for the column
   - Add Links (text and url pairs)

2. **Edit existing links:**
   - Expand the section you want to edit
   - Modify Text or URL fields
   - Click "Publish" to save

3. **Add social media:**
   - In Social Links, click "Add item"
   - Select Platform from dropdown
   - Enter the full URL

4. **Update copyright:**
   - Edit the Copyright Text field
   - Click "Publish"

---

## Important Notes

### Fallback System
- If Sanity data is not available, the site uses **hardcoded fallback data**
- This ensures the site never breaks if Sanity is down
- The current hardcoded fallback matches the example configurations above

### Brand Information
- **Brand name** ("Swiss Alpine Journey") is kept hardcoded for safety
- **Brand tagline** in footer is also hardcoded
- These can be changed by a developer if needed

### Changes Go Live Immediately
- After clicking "Publish" in Sanity Studio, changes appear on the frontend
- The site has a 5-minute cache, so you may need to wait briefly for changes to appear
- To see changes immediately, add `?x_request_source=preview` to the URL

---

## Troubleshooting

### Changes not appearing?
1. Make sure you clicked **"Publish"** (not just "Save")
2. Wait up to 5 minutes for cache to clear
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check if you're editing the correct document (name="header" for navigation)

### Navigation dropdown not showing?
- Make sure the parent item has **Children** array populated
- Each child item must have both **Text** and **Link** fields filled

### Footer column missing?
- Check that the section has a **Title** field filled
- Ensure at least one link exists in the **Links** array

---

## Support

For technical issues or questions about Sanity CMS management, please contact the development team.
