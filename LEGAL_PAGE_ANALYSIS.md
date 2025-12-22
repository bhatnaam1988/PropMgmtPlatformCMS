# Legal Page Analysis & Issues

## Current Status: ⚠️ **HYBRID WITH MISMATCHED STRUCTURE**

---

## Summary of Findings

The Legal page is configured to pull content from **Sanity CMS**, but there's a **critical mismatch** between:
1. What the Sanity schema provides
2. What the code expects
3. What content is actually displayed

### Current Behavior
- ✅ Page structure is working
- ⚠️ Content is using **fallback data** (mostly hardcoded)
- ❌ Sanity CMS content is **not being properly rendered** due to schema/code mismatch
- ❌ Privacy Policy and GDPR sections are **empty** (fallback has no content)

---

## Detailed Analysis

### 1. Sanity CMS Schema Structure
**File:** `/app/sanity/schemas/settings/legalSettingsHybrid.js`

```javascript
{
  headerSection: {
    heading: string,
    description: text
  },
  termsSection: {
    lastUpdated: string,
    content: array[block]  // Rich text blocks
  },
  privacySection: {
    lastUpdated: string,
    content: array[block]  // Rich text blocks
  },
  gdprSection: {
    content: array[block]  // Rich text blocks
  },
  footerText: text
}
```

### 2. Code Expectations
**File:** `/app/app/legal/page.js`

```javascript
{
  pageHeader: {           // ❌ Schema has 'headerSection'
    heading: string,
    description: string
  },
  navigationCards: [],    // ❌ Not in schema - hardcoded only
  termsSection: {
    heading: string,      // ❌ Not in schema
    lastUpdated: string,  // ✅ Matches
    sections: [           // ❌ Schema has 'content' (rich text blocks)
      {
        title: string,
        content: string
      }
    ]
  },
  privacySection: {       // ❌ Same mismatch
    heading: string,
    lastUpdated: string,
    sections: []
  },
  gdprSection: {          // ❌ Same mismatch
    heading: string,
    description: string,
    sections: []
  },
  footerText: {           // ❌ Schema has plain text, code expects object
    text: string,
    linkText: string,
    linkUrl: string
  }
}
```

### 3. Current Fallback Data Issues

**Terms & Conditions:** ✅ Has 2 sample sections
```javascript
sections: [
  { title: '1. Booking and Reservation', content: '...' },
  { title: '2. Payment Terms', content: '...' }
]
```

**Privacy Policy:** ❌ Empty
```javascript
sections: []  // No content
```

**GDPR Information:** ❌ Empty
```javascript
sections: []  // No content
```

---

## Problems This Causes

### Issue 1: Sanity Content Not Rendering
Even if you add content in Sanity CMS, it won't display properly because:
- The code expects `sections[]` arrays with `{title, content}` objects
- Sanity stores rich text `blocks[]` which are not being converted

### Issue 2: Incomplete Fallback Content
The hardcoded fallback is missing:
- Full Terms & Conditions (only 2 sections provided)
- Complete Privacy Policy (empty)
- Complete GDPR Information (empty)

### Issue 3: Navigation Cards Are Hardcoded
The three navigation cards at the top cannot be edited via Sanity CMS.

### Issue 4: Footer Text Structure Mismatch
The footer contact text cannot be properly customized via Sanity.

---

## Recommended Solutions

### Option 1: Quick Fix - Complete the Fallback Content ⚡
**Best for:** Immediate deployment without CMS dependency

**Action:**
1. Update `/app/app/legal/page.js` fallback with complete legal content
2. Add all Terms & Conditions sections (5-10 sections)
3. Add complete Privacy Policy content
4. Add complete GDPR Information content
5. Keep using fallback until Sanity integration is fixed

**Pros:** Quick, reliable, content is in code
**Cons:** Requires code changes to update content

---

### Option 2: Fix Sanity Integration - Update Code to Match Schema 🔧
**Best for:** Future CMS manageability

**Required Changes:**

#### A. Update Sanity Query in `/app/lib/sanity.js`
```javascript
export async function getLegalSettings() {
  try {
    const query = `*[_type == "legalSettingsHybrid"][0]{
      headerSection,
      termsSection{
        lastUpdated,
        "contentHtml": content
      },
      privacySection{
        lastUpdated,
        "contentHtml": content
      },
      gdprSection{
        "contentHtml": content
      },
      footerText
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching legal settings:', error);
    return null;
  }
}
```

#### B. Update Page Component to Transform Data
Add a transformation function to convert Sanity data to expected format:
```javascript
function transformSanityData(sanityData) {
  return {
    pageHeader: {
      heading: sanityData.headerSection?.heading || 'Legal Information',
      description: sanityData.headerSection?.description || ''
    },
    navigationCards: [/* keep hardcoded */],
    termsSection: {
      heading: 'Terms & Conditions',
      lastUpdated: sanityData.termsSection?.lastUpdated,
      // Convert rich text blocks to sections
      sections: convertBlocksToSections(sanityData.termsSection?.contentHtml)
    },
    // ... same for privacy and gdpr
  };
}
```

#### C. Create Block-to-Section Converter
Install and use Sanity's portable text converter or create custom parser.

**Pros:** Content manageable via CMS
**Cons:** More development time, requires block text parsing

---

### Option 3: Hybrid Approach - Update Schema to Match Code 🎯
**Best for:** Simplest CMS integration

**Action:**
1. Update Sanity schema to match code expectations exactly
2. Add all missing fields to schema
3. Populate content in Sanity Studio

#### New Schema Structure Needed:
```javascript
{
  name: 'legalSettingsHybrid',
  title: 'Legal Page Content',
  type: 'document',
  fields: [
    {
      name: 'pageHeader',  // Changed from 'headerSection'
      title: 'Page Header',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' }
      ]
    },
    {
      name: 'termsSection',
      title: 'Terms & Conditions',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Section Heading', type: 'string' },
        { name: 'lastUpdated', title: 'Last Updated', type: 'string' },
        {
          name: 'sections',
          title: 'Content Sections',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Section Title', type: 'string' },
              { name: 'content', title: 'Section Content', type: 'text' }
            ]
          }]
        }
      ]
    },
    // Repeat for privacySection and gdprSection
    {
      name: 'footerText',
      title: 'Footer Contact Text',
      type: 'object',
      fields: [
        { name: 'text', title: 'Text', type: 'string' },
        { name: 'linkText', title: 'Link Text', type: 'string' },
        { name: 'linkUrl', title: 'Link URL', type: 'string' }
      ]
    }
  ]
}
```

**Pros:** Clean match between CMS and code, easy to manage
**Cons:** Requires schema update and re-deployment

---

## Current Content Status

### What's Currently Displayed (from fallback):

**✅ Terms & Conditions:**
- 1. Booking and Reservation
- 2. Payment Terms
- *Missing: Cancellation, Check-in/out, Property Usage, Guest Responsibilities, Liability, etc.*

**❌ Privacy Policy:**
- Heading only, no content sections

**❌ GDPR Information:**
- Heading only, no content sections

---

## Immediate Action Required

### Priority 1: Content Completeness
Regardless of the CMS integration issues, the legal page needs complete content:

1. **Terms & Conditions** - Add missing sections:
   - 3. Cancellation Policy
   - 4. Check-in and Check-out
   - 5. Property Usage
   - 6. Guest Responsibilities
   - 7. Liability and Insurance
   - 8. Force Majeure
   - 9. Dispute Resolution

2. **Privacy Policy** - Add complete content:
   - Data Collection
   - How We Use Your Data
   - Data Storage and Security
   - Your Rights
   - Cookies
   - Third-Party Services
   - Contact Information

3. **GDPR Information** - Add complete content:
   - Right to Access
   - Right to Rectification
   - Right to Erasure
   - Right to Data Portability
   - Right to Object
   - How to Exercise Your Rights

### Priority 2: Fix Schema/Code Mismatch
Choose one of the three options above and implement.

---

## Recommendation

**For immediate deployment:**
1. **Complete the fallback content** in `/app/app/legal/page.js` with full legal text
2. Document that Sanity integration needs fixing
3. Deploy with complete, accurate legal information

**For long-term:**
1. Implement **Option 3** (update schema to match code) for clean CMS management
2. Migrate complete content to Sanity
3. Test thoroughly before removing fallback

---

## Files Involved

- `/app/app/legal/page.js` - Page component with fallback data
- `/app/app/legal/LegalClient.js` - Client-side rendering component
- `/app/sanity/schemas/settings/legalSettingsHybrid.js` - Sanity schema
- `/app/lib/sanity.js` - Sanity query function

---

**Status:** Requires immediate attention for content completeness and structural fixes.
