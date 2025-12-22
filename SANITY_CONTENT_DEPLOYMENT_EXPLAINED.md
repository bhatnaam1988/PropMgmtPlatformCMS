# Sanity Content & Code Deployment - Complete Explanation

**Question:** When we update content in production Sanity and deploy new code from dev to prod, will the content be reverted?

**Answer:** ✅ **NO - Production content will be RETAINED**

---

## 🏗️ Architecture Overview

### How Sanity Works (Headless CMS)

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                         │
│  ┌────────────┐         ┌─────────────┐                    │
│  │   Dev Env  │         │  Prod Env   │                    │
│  │            │         │             │                    │
│  │  Code Base │         │  Code Base  │                    │
│  │  (Schemas) │         │  (Schemas)  │                    │
│  └─────┬──────┘         └──────┬──────┘                    │
│        │                       │                            │
└────────┼───────────────────────┼────────────────────────────┘
         │                       │
         │  API Calls            │  API Calls
         │                       │
         ▼                       ▼
┌────────────────────────────────────────────────────────────┐
│              SANITY CLOUD (External Service)               │
│                                                            │
│  ┌──────────────────┐      ┌──────────────────┐          │
│  │  Dev Dataset     │      │  Production      │          │
│  │  (development)   │      │  Dataset         │          │
│  │                  │      │  (production)    │          │
│  │  Content A       │      │  Content B       │          │
│  │  Images X        │      │  Images Y        │          │
│  └──────────────────┘      └──────────────────┘          │
│                                                            │
│         COMPLETELY SEPARATE STORAGE                        │
└────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### 1. Content Storage Location

**Content is NOT in your codebase** ❌

```
Your Git Repository:
├── /app
│   ├── /sanity
│   │   └── /schemas         ← ONLY SCHEMAS (structure definitions)
│   │       ├── footer.js    ← Defines WHAT fields exist
│   │       ├── header.js    ← NOT the actual content
│   │       └── blogPost.js  ← Just the structure
```

**Content is in Sanity Cloud** ✅

```
Sanity Cloud Infrastructure (sanity.io):
├── Project: vrhdu6hl
│   ├── Dataset: production
│   │   ├── Documents
│   │   │   ├── footer (content)      ← "© 2025 Swiss Alpine..."
│   │   │   ├── header (content)      ← Navigation links, logo
│   │   │   └── blogPost-123 (content) ← Actual blog text
│   │   └── Assets
│   │       ├── image-abc.jpg         ← Uploaded images
│   │       └── image-xyz.png
│   └── Dataset: development
│       └── (separate content)
```

---

### 2. What's in Your Code vs What's in Sanity

| In Your Codebase | In Sanity Cloud |
|------------------|-----------------|
| Schema definitions (structure) | Actual content (data) |
| Field types and names | Text you write |
| Validation rules | Images you upload |
| Schema relationships | Page configurations |
| UI configuration for Studio | Navigation items |
| | Blog posts |
| | Footer text |

**Example:**

**In Code** (`/app/sanity/schemas/footer.js`):
```javascript
{
  name: 'copyrightText',
  title: 'Copyright Text',
  type: 'string'  // ← Defines a text field
}
```

**In Sanity Cloud** (stored in Sanity's database):
```json
{
  "copyrightText": "© 2025 Swiss Alpine Journey. All Rights Reserved."
}
```

---

## 🔄 What Happens During Code Deployment

### Scenario: You Deploy Code from Dev to Prod

**Step 1: Production Sanity BEFORE Deployment**
```
Sanity Cloud - Production Dataset:
- Footer text: "© 2025 Swiss Alpine Journey"
- Blog posts: 15 published posts
- Images: 50 uploaded images
- Hero section: "Welcome to the Alps"
```

**Step 2: You Deploy New Code**
```bash
git push production main
# Code is deployed to production server
```

**Step 3: Production Sanity AFTER Deployment**
```
Sanity Cloud - Production Dataset:
- Footer text: "© 2025 Swiss Alpine Journey"  ← UNCHANGED ✅
- Blog posts: 15 published posts               ← UNCHANGED ✅
- Images: 50 uploaded images                   ← UNCHANGED ✅
- Hero section: "Welcome to the Alps"          ← UNCHANGED ✅
```

**Result:** ✅ **ALL CONTENT RETAINED**

---

## 🎯 Why Content is Not Overwritten

### Reason 1: Separate Storage Systems

```
Code Deployment:
Git Repo → Build Server → Production Server
(only code files are moved)

Content Storage:
Your App → Sanity API → Sanity Cloud Database
(content never in Git)
```

### Reason 2: Environment Variables Point to Different Datasets

**In Your `.env` File:**

```bash
# This tells your app WHICH Sanity dataset to use
NEXT_PUBLIC_SANITY_DATASET=production

# This is your Sanity project ID (same for all environments)
NEXT_PUBLIC_SANITY_PROJECT_ID=vrhdu6hl
```

**Dev Environment:**
```bash
NEXT_PUBLIC_SANITY_DATASET=development  # Points to dev dataset
```

**Prod Environment:**
```bash
NEXT_PUBLIC_SANITY_DATASET=production   # Points to prod dataset
```

**Result:** Each environment reads from its own dataset

---

## 📊 Detailed Deployment Flow

### What Actually Happens

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: You Edit Content in Production Sanity Studio       │
├─────────────────────────────────────────────────────────────┤
│ Action: Login to https://your-domain.com/studio             │
│ Change: Update footer to "© 2025 Swiss Alpine Journey"     │
│ Result: Content saved in Sanity Cloud → production dataset │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Later, You Deploy New Code from Dev                │
├─────────────────────────────────────────────────────────────┤
│ Files Deployed:                                             │
│ ✅ /app/components/Footer.js (code changes)                 │
│ ✅ /app/sanity/schemas/footer.js (schema changes)           │
│ ✅ /app/lib/sanity.js (query changes)                       │
│ ❌ Content data (NOT deployed - not in Git)                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Production App Starts Up                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Loads new code from Git                                 │
│ 2. Reads NEXT_PUBLIC_SANITY_DATASET=production             │
│ 3. Connects to Sanity Cloud production dataset             │
│ 4. Fetches content from Sanity API                         │
│ 5. Displays: "© 2025 Swiss Alpine Journey" ✅              │
│                                                             │
│ Result: Your edited content is still there!                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Verification: Check Your Current Setup

### 1. Check Sanity Configuration

**File:** `/app/lib/sanity.js`

```javascript
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // 'vrhdu6hl'
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,       // 'production'
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION, // '2024-01-01'
  useCdn: false,
});
```

**This configuration:**
- ✅ Reads dataset name from environment variables
- ✅ Different environment = different dataset
- ✅ No content in code

---

### 2. Check Your Environment Files

**File:** `/app/.env`

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=vrhdu6hl
NEXT_PUBLIC_SANITY_DATASET=production  # ← Points to prod content
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=<your-token>
```

**In Production (Emergent Dashboard):**
```bash
NEXT_PUBLIC_SANITY_DATASET=production
```

**In Dev/Local:**
```bash
NEXT_PUBLIC_SANITY_DATASET=development
```

---

## ⚠️ What COULD Affect Content (Edge Cases)

### Scenario 1: Schema Changes (Usually Safe)

**If you add a NEW field to schema:**

```javascript
// OLD schema in prod
{
  name: 'footer',
  fields: [
    { name: 'copyrightText', type: 'string' }
  ]
}

// NEW schema deployed
{
  name: 'footer',
  fields: [
    { name: 'copyrightText', type: 'string' },
    { name: 'socialLinks', type: 'array' }  // ← NEW FIELD
  ]
}
```

**Result:**
- ✅ Existing content (`copyrightText`) is PRESERVED
- ⚠️ New field (`socialLinks`) is empty until you populate it in Studio
- ✅ No data loss

---

### Scenario 2: Renaming a Field (DANGEROUS)

**If you RENAME a field in schema:**

```javascript
// OLD schema
{ name: 'copyrightText', type: 'string' }

// NEW schema - RENAMED FIELD
{ name: 'footerCopyright', type: 'string' }  // ← Different name!
```

**Result:**
- ❌ Sanity sees this as a NEW field (empty)
- ❌ Old field data (`copyrightText`) becomes inaccessible
- ⚠️ **This is like data loss** (though old data still exists in Sanity)

**Solution:** Use Sanity migrations to rename fields properly

---

### Scenario 3: Deleting a Schema (DANGEROUS)

**If you delete an entire schema file:**

```bash
# Delete this file
rm /app/sanity/schemas/footer.js
```

**Result:**
- ❌ Content still exists in Sanity Cloud
- ❌ BUT you can't edit it in Studio anymore
- ❌ Your app can't query it (unless you manually query)
- ⚠️ Content is orphaned, not deleted

**Note:** Content is never automatically deleted by schema changes

---

## ✅ Best Practices

### 1. Use Separate Datasets for Dev and Prod

**Recommended Setup:**

```
Sanity Project: vrhdu6hl
├── Dataset: development
│   ├── Test content
│   ├── Test images
│   └── Experiment freely
└── Dataset: production
    ├── Real content
    ├── Real images
    └── Only edit with care
```

**Benefits:**
- ✅ Test schema changes in dev first
- ✅ Production content safe from experiments
- ✅ Can populate dev with test data

---

### 2. Test Schema Changes in Dev First

**Workflow:**

```
1. Change schema in code
2. Deploy to DEV environment
3. Test in DEV Sanity Studio
4. Verify everything works
5. Then deploy to PRODUCTION
```

---

### 3. Never Hardcode Content in Code

**BAD:**
```javascript
// Hardcoded in code
const footer = "© 2024 Swiss Alpine Journey";
```

**GOOD:**
```javascript
// Fetch from Sanity
const footer = await sanityClient.fetch('*[_type == "footer"][0]');
```

---

### 4. Use Version Control for Schemas Only

**What to commit to Git:**
- ✅ Schema files (`/sanity/schemas/`)
- ✅ Sanity configuration
- ✅ API queries

**What NOT to commit:**
- ❌ Content data
- ❌ Images
- ❌ Sanity API tokens (use environment variables)

---

## 🚀 Production Deployment Checklist

### Before Deploying Code

- [ ] Test schema changes in dev environment
- [ ] Verify dev Sanity Studio works with new schemas
- [ ] Check for any breaking schema changes
- [ ] Review field renames or deletions
- [ ] Back up production content (optional, but recommended)

### During Deployment

- [ ] Deploy code to production
- [ ] Verify production environment variables are correct
- [ ] Check `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] Restart application to load new code

### After Deployment

- [ ] Visit production Sanity Studio
- [ ] Verify all content is still visible
- [ ] Check if new schema fields appear
- [ ] Test editing and publishing content
- [ ] Verify frontend displays content correctly

---

## 📝 Summary

### The Golden Rule

> **"Code defines structure, Sanity stores content"**

### Quick Answers

**Q: Will my production content be overwritten during code deployment?**  
**A:** ❌ NO - Content lives in Sanity Cloud, not in your codebase

**Q: Can I edit production content in Sanity Studio?**  
**A:** ✅ YES - Content is independent of code deployments

**Q: What if I change a schema and deploy?**  
**A:** ✅ Existing content preserved, new fields appear empty

**Q: How do I back up Sanity content?**  
**A:** Use Sanity's export tool or CLI: `sanity dataset export production backup.tar.gz`

**Q: Can I have different content in dev vs prod?**  
**A:** ✅ YES - Use separate datasets (development vs production)

---

## 🔗 Additional Resources

**Sanity Documentation:**
- Content Management: https://www.sanity.io/docs/content-studio
- Datasets: https://www.sanity.io/docs/datasets
- Schema Types: https://www.sanity.io/docs/schema-types
- Migrations: https://www.sanity.io/docs/migrating-data

**Your Sanity Project:**
- Project ID: `vrhdu6hl`
- Production Studio: `https://your-domain.com/studio`
- Sanity Dashboard: https://www.sanity.io/manage

**Backup Commands:**
```bash
# Export production dataset
sanity dataset export production production-backup.tar.gz

# Import to dev dataset
sanity dataset import production-backup.tar.gz development
```

---

## 🎯 TL;DR (Too Long, Didn't Read)

**Your production content is 100% safe during code deployments.**

Why? Because:
1. Content is stored in Sanity's cloud, not in your code
2. Code deployment only updates application files
3. Environment variables point each environment to its own dataset
4. Sanity content and application code are completely separate systems

**You can confidently deploy code changes without worrying about losing content!** ✅

---

**Last Updated:** December 10, 2025  
**Status:** Production-Safe Architecture ✅
