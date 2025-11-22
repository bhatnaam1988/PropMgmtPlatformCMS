# Hybrid CMS Migration Status

## Overview
This document tracks the progress of migrating all website pages to the hybrid Sanity CMS approach, where page structure remains in code while content is managed in Sanity Studio.

---

## ✅ Completed Migrations

### 1. About Page
- **Schema:** `aboutSettingsHybrid.js` ✅
- **Helper Function:** `getAboutSettingsHybrid()` ✅
- **Page Component:** `/app/app/about/page.js` ✅
- **Migration Script:** `/app/scripts/migrate-about-to-hybrid.js` ✅
- **Status:** **COMPLETE & TESTED**

---

## 🚧 In Progress / Ready for Migration

### 2. Homepage
- **Schema:** `homeSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getHomeSettings()` ✅ CREATED
- **Page Component:** Needs conversion to async + Sanity integration
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

### 3. Contact Page
- **Schema:** `contactSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getContactSettings()` ✅ CREATED
- **Page Component:** Needs conversion
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

### 4. Cleaning Services
- **Schema:** `cleaningServicesSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getCleaningServicesSettings()` ✅ CREATED
- **Page Component:** Needs conversion
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

### 5. Rental Services
- **Schema:** `rentalServicesSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getRentalServicesSettings()` ✅ CREATED
- **Page Component:** Needs conversion
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

### 6. Jobs Page
- **Schema:** `jobsSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getJobsSettings()` ✅ CREATED
- **Page Component:** Needs conversion
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

### 7. Legal Page
- **Schema:** `legalSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getLegalSettings()` ✅ CREATED
- **Page Component:** Needs conversion (complex - has rich text)
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

### 8. Grächen (Explore)
- **Schema:** `graechenSettingsHybrid.js` ✅ CREATED
- **Helper Function:** `getGraechenSettings()` ✅ CREATED
- **Page Component:** Needs conversion
- **Migration Script:** Needs creation
- **Status:** **Schema Ready - Pending Implementation**

---

## ⏳ Pending (Need Schema Creation)

### 9. Other Locations (Explore)
- **Schema:** Not created yet
- **Helper Function:** Not created yet
- **Page Component:** Not started
- **Migration Script:** Not created
- **Status:** **Pending**

### 10. Travel Tips (Explore)
- **Schema:** Not created yet
- **Helper Function:** Not created yet
- **Page Component:** Not started
- **Migration Script:** Not created
- **Status:** **Pending**

### 11. Behind the Scenes (Explore)
- **Schema:** Not created yet
- **Helper Function:** Not created yet
- **Page Component:** Not started
- **Migration Script:** Not created
- **Status:** **Pending**

---

## 📋 Migration Checklist (Per Page)

For each page migration, follow these steps:

### Step 1: Schema (✅ Done for 8 pages)
- [x] Create `[pageName]SettingsHybrid.js` schema
- [x] Define structured fields matching page sections
- [x] Register in `/app/sanity/schemas/index.js`

### Step 2: Helper Functions (✅ Done for 8 pages)
- [x] Add `get[PageName]Settings()` function to `/app/lib/sanity.js`
- [x] Include image asset fetching where needed

### Step 3: Page Component Conversion
- [ ] Convert from `'use client'` to async server component (if applicable)
- [ ] Import helper function from `@/lib/sanity`
- [ ] Fetch data at top of component
- [ ] Add fallback/default data
- [ ] Replace hardcoded text with Sanity data
- [ ] Keep all HTML structure, styling, and layout intact
- [ ] Test that design is preserved

### Step 4: Migration Script
- [ ] Create `/app/scripts/migrate-[pagename]-to-hybrid.js`
- [ ] Extract all current hardcoded content
- [ ] Structure data to match schema
- [ ] Run script to populate Sanity
- [ ] Verify in Sanity Studio

### Step 5: Cleanup
- [ ] Delete old schema files (if any)
- [ ] Remove old schema from index.js
- [ ] Test page loads correctly
- [ ] Verify content is editable in Sanity Studio

---

## 🔄 Old Schemas to Remove

After migration is complete, these old schemas should be deleted:

- `/app/sanity/schemas/settings/homeSettings.js` ❌ (Replace with homeSettingsHybrid)
- `/app/sanity/schemas/settings/contactSettings.js` ❌ (Replace with contactSettingsHybrid)
- `/app/sanity/schemas/settings/servicePageSettings.js` ❌ (Generic - no longer needed)
- `/app/sanity/schemas/settings/explorePageSettings.js` ❌ (Generic - no longer needed)
- `/app/sanity/schemas/settings/jobsSettings.js` ❌ (Replace with jobsSettingsHybrid)
- `/app/sanity/schemas/settings/legalSettings.js` ❌ (Replace with legalSettingsHybrid)

**Note:** `aboutSettings.js` was already deleted ✅

---

## 📝 Example Migration Pattern

### Before (Client Component with Hardcoded Content):
```javascript
'use client';

export default function PageName() {
  return (
    <div>
      <h1>Hardcoded Title</h1>
      <p>Hardcoded description text here...</p>
    </div>
  );
}
```

### After (Server Component with Sanity Content):
```javascript
import { getPageNameSettings } from '@/lib/sanity';

export default async function PageName() {
  const content = await getPageNameSettings();
  
  // Fallback data
  const fallbackData = {
    heroSection: {
      heading: 'Hardcoded Title',
      description: 'Hardcoded description text here...'
    }
  };
  
  const data = content || fallbackData;
  
  return (
    <div>
      <h1>{data.heroSection.heading}</h1>
      <p>{data.heroSection.description}</p>
    </div>
  );
}
```

---

## 🎯 Priority Order (Recommended)

1. ✅ **About** (DONE)
2. **Homepage** - Most visible, highest priority
3. **Contact** - Essential for user communication
4. **Cleaning Services** - Business critical
5. **Rental Services** - Business critical
6. **Jobs** - Important for hiring
7. **Gr\u00e4chen** - Key destination page
8. **Legal** - Compliance required
9-11. **Other Explore Pages** - Lower priority

---

## 🛠️ Tools & Resources

### Key Files:
- **Schemas:** `/app/sanity/schemas/settings/`
- **Helper Functions:** `/app/lib/sanity.js`
- **Page Components:** `/app/app/[page-name]/page.js`
- **Migration Scripts:** `/app/scripts/`

### Sanity Studio:
- **Access:** `https://gallery-update-1.preview.emergentagent.com/studio`
- **Content Editing:** After migration, all content editable in Sanity Studio
- **No Duplicates:** One entry per page (hybrid approach)

### Reference Implementation:
- See `/app/app/about/page.js` for complete working example
- See `/app/sanity/schemas/settings/aboutSettingsHybrid.js` for schema pattern
- See `/app/scripts/migrate-about-to-hybrid.js` for migration script template

---

## 📊 Overall Progress

- **Total Pages:** 11
- **Schemas Created:** 8/11 (73%)
- **Helper Functions Created:** 8/11 (73%)
- **Page Components Converted:** 1/11 (9%)
- **Migrations Run:** 1/11 (9%)
- **Fully Complete & Tested:** 1/11 (9%)

---

## 🚀 Next Steps

1. **Immediate:** Convert Homepage component and create migration
2. **Short-term:** Complete Contact, Cleaning, and Rental pages
3. **Medium-term:** Finish Jobs, Legal, and Gr\u00e4chen pages
4. **Final:** Create schemas for remaining 3 explore pages and convert

---

## ✨ Benefits of Hybrid Approach

- ✅ **Design Preservation:** Page structure/layout stays in code
- ✅ **Content Flexibility:** All text, images editable in Sanity CMS
- ✅ **No Breaking Changes:** Predictable data shapes, no layout breaks
- ✅ **Developer Control:** Maintain full control over HTML/CSS/structure
- ✅ **Content Team Empowerment:** Easy content updates without code changes
- ✅ **One Source of Truth:** Single content entry per page in Sanity

---

**Last Updated:** December 2024  
**Status:** Migration in progress - 1 of 11 pages complete
