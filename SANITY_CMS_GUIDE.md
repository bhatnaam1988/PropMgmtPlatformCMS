# Sanity CMS Guide for Swiss Alpine Journey

## Question 1: How to Add New Job Positions (and other dynamic content)

### ✅ Adding New Jobs to the Careers Page

The Jobs page schema **already supports** adding/removing job positions dynamically! Here's how:

#### Steps to Add a New Job:

1. **Go to Sanity Studio**: Navigate to `/studio` in your browser

2. **Find Jobs Page Settings**: 
   - In the left sidebar, click on **"Jobs Page Content"** under the "Content" section

3. **Open Positions Section**:
   - Scroll down to **"Open Positions Section"**
   - Click on the **"Positions"** array field

4. **Add New Position**:
   - Click the **"+ Add item"** button at the bottom of the positions list
   - Fill in the new job details:
     - **Job Title**: e.g., "Marketing Manager"
     - **Location**: e.g., "Grächen" or "Remote"
     - **Job Type**: e.g., "Full-time", "Part-time", "Contract"
     - **Description**: Job description text

5. **Reorder Jobs** (optional):
   - Drag and drop the positions using the drag handle (⋮⋮) on the left
   - Jobs appear on the website in the same order

6. **Remove Jobs**:
   - Click the trash icon next to any job position to remove it

7. **Save**: Click **"Publish"** button in the bottom right

8. **View Changes**: 
   - Changes appear on the website within ~5 minutes
   - Or refresh the `/jobs` page to see immediately

### 🎯 Other Dynamic Arrays You Can Manage:

All these sections support adding/removing items the same way:

- **Homepage**: Activities (3 activity cards)
- **About Page**: Values, Stats, Why Choose Us points
- **Legal Page**: Terms sections, Privacy sections, GDPR sections
- **Grächen Page**: Highlights, Winter Activities, Summer Activities, Practical Info blocks
- **Travel Tips**: Quick tips, Detailed tip categories, Money-saving tips, Sustainability tips
- **Behind The Scenes**: Values, Team roles, Process steps, Quality standards
- **Other Locations**: Featured locations

---

## Question 2: Understanding Sanity Studio Sections

Here's what each section in the Sanity Studio sidebar is for:

### 📄 **Content** (Page Settings - Primary Use)
**✅ ACTIVELY USED** - These are your main page content managers:

- **Home Page Settings** - Edit homepage content
- **About Page Settings** - Edit about page content
- **Jobs Page Content** - Edit careers/jobs page
- **Contact Page Settings** - Edit contact page
- **Cleaning Services Settings** - Edit cleaning services page
- **Rental Services Settings** - Edit rental management page
- **Legal Page Settings** - Edit terms, privacy, GDPR
- **Grächen Page Content** - Edit Grächen explore page
- **Travel Tips Settings** - Edit travel tips page
- **Behind The Scenes Settings** - Edit behind the scenes page
- **Other Locations Settings** - Edit other locations page

**Purpose**: These control ALL the text, headings, descriptions, and structured content on your static pages.

---

### 🎨 **Hero Section**
**⚠️ LEGACY/UNUSED** - From initial generic CMS attempt

**Status**: Not currently used in the hybrid approach. Can be safely ignored.

**Why**: The hybrid approach uses page-specific hero sections (like `heroSection` inside `homeSettingsHybrid`) instead of this generic one.

**Action**: You can hide this or leave it. It won't affect your site.

---

### 📝 **Page**
**⚠️ LEGACY/UNUSED** - From initial generic CMS attempt

**Status**: This was for the failed "generic block" approach where pages were fully dynamic. Not used now.

**Why**: Hybrid approach keeps page structure in code, so we don't need generic pages.

**Action**: Can be ignored. If you want to hide it, we can remove it from the schema registration.

---

### ✍️ **Author**
**✅ ACTIVELY USED** - For blog functionality

**Purpose**: Create and manage blog post authors
- Each blog post can have an author
- Includes name, bio, image, and slug

**Usage**: 
- If you publish blog posts, create author profiles here
- Link authors to blog posts

---

### 📰 **Blog Post**
**✅ ACTIVELY USED** - For blog functionality

**Purpose**: Create and manage blog articles
- Full blog post creation and editing
- Supports rich text content (Portable Text)
- Categories, featured images, SEO settings

**Usage**:
- Click "+ Create" to write a new blog post
- Posts automatically appear on `/blog`
- Individual post pages at `/blog/[slug]`

---

### 🏷️ **Category**
**✅ ACTIVELY USED** - For blog organization

**Purpose**: Organize blog posts by category
- Examples: "Travel Tips", "Local Events", "Property Management"
- Blog posts can be assigned multiple categories

**Usage**:
- Create categories before writing blog posts
- Assign categories when creating/editing blog posts
- Helps visitors filter blog content

---

### 🏠 **Property Augmentation**
**✅ ACTIVELY USED** - For property listings

**Purpose**: Add extra information to properties from Uplisting API
- Override/supplement property data
- Add featured property badges
- Customize property descriptions

**Usage**:
- If you want to add custom marketing text to a property
- If you want to mark properties as "Featured"
- Uses property ID to match with Uplisting data

---

### 🧭 **Navigation**
**⚠️ PARTIALLY UNUSED** - Navigation is hardcoded

**Status**: Schema exists but navigation menu is currently hardcoded in `/components/Header.js`

**Potential Use**: Could be used to make navigation menu dynamic if needed in future

**Current**: Navigation items are defined in code, not CMS

---

### 🦶 **Footer**
**⚠️ PARTIALLY UNUSED** - Footer is hardcoded

**Status**: Schema exists but footer content is currently hardcoded in `/components/Footer.js`

**Potential Use**: Could be used to make footer content dynamic if needed in future

**Current**: Footer links and text are defined in code, not CMS

---

## 📊 Summary Table

| Section | Status | Purpose | Action |
|---------|--------|---------|--------|
| **Content (Page Settings)** | ✅ **ACTIVE** | Edit all page content | **USE THIS DAILY** |
| **Blog Post** | ✅ Active | Create blog articles | Use when publishing blogs |
| **Author** | ✅ Active | Manage blog authors | Create author profiles |
| **Category** | ✅ Active | Organize blog posts | Create blog categories |
| **Property Augmentation** | ✅ Active | Enhance property data | Add custom property info |
| **Hero Section** | ⚠️ Legacy | Old generic approach | Can ignore |
| **Page** | ⚠️ Legacy | Old generic approach | Can ignore |
| **Navigation** | ⚠️ Exists | Could make nav dynamic | Currently unused |
| **Footer** | ⚠️ Exists | Could make footer dynamic | Currently unused |

---

## 🎯 Your Primary Workflow

### For Page Content Editing:
1. Go to `/studio`
2. Click on the page you want to edit under **"Content"**
3. Edit text, headings, descriptions
4. For arrays (jobs, activities, tips): Click "+ Add item" to add more
5. Click "Publish"
6. Wait ~5 minutes or refresh page to see changes

### For Blog Management:
1. Create **Categories** first (e.g., "Travel Tips")
2. Create **Authors** (your team members)
3. Create **Blog Posts** and assign categories/authors
4. Posts appear automatically on `/blog`

### For Property Enhancement:
1. Get property ID from Uplisting
2. Create **Property Augmentation** document
3. Add custom descriptions or mark as featured

---

## 🧹 Cleanup Recommendation (Optional)

If you want to simplify the Studio interface by hiding unused legacy schemas:

1. Edit `/app/sanity/schemas/index.js`
2. Comment out or remove these imports:
   ```javascript
   // import heroSection from './heroSection';  // Legacy - unused
   // import page from './page';  // Legacy - unused
   ```
3. Remove them from the `schemaTypes` array
4. Restart Next.js server

This will hide them from the Studio sidebar, making it cleaner and less confusing.

---

## 💡 Pro Tips

1. **Draft Changes**: Sanity supports drafts - make changes and preview before publishing
2. **Reorder Items**: Most arrays support drag-and-drop reordering
3. **Required Fields**: Red asterisk (*) means the field is required
4. **Rich Text**: Some fields support rich formatting - look for the editor toolbar
5. **Images**: Upload images directly in Sanity (though current hybrid schemas use URLs for simplicity)

---

## 🆘 Need Help?

If you want to:
- Make the Navigation menu CMS-managed
- Make the Footer CMS-managed  
- Add new dynamic sections to existing pages
- Create entirely new page types

Just ask! The hybrid architecture makes it easy to extend.
