# How to Restore Deleted Rental Services Document

You accidentally deleted the Rental Services document in Sanity. Here are all the options to restore it:

---

## Option 1: Check Sanity's Document History (Try This First!)

Sanity keeps document history and may allow you to restore deleted documents.

### Steps:

1. **Go to Sanity Management Console:**
   - Visit: https://www.sanity.io/manage
   - Login with your credentials
   - Select project: `vrhdu6hl`

2. **Check Document History:**
   - Navigate to: **"Datasets"** → **"production"**
   - Look for **"Document History"** or **"History"** tab
   - Search for: `rentalServicesSettingsHybrid`
   - If found, you can view previous versions and restore

3. **Alternative - Vision Tool:**
   - Open Sanity Studio: `https://secure-forms-2.preview.emergentagent.com/studio`
   - Click on **"Vision"** tab
   - Run this query to check if document exists in history:
     ```groq
     *[_type == "rentalServicesSettingsHybrid"] | order(_updatedAt desc)
     ```

---

## Option 2: Restore Using Migration Script (Recommended)

I've created a script that will recreate the document with all the original content.

### Steps:

1. **Run the migration script:**
   ```bash
   cd /app
   node sanity/migrations/restore-rental-services.js
   ```

2. **What it does:**
   - Creates a new Rental Services document
   - Includes all 6 services (Listing Optimization, Guest Communication, etc.)
   - Includes all 4 benefits
   - Includes form section

3. **Expected output:**
   ```
   ✅ Successfully created Rental Services document!
   Document ID: [generated-id]
   Services count: 6
   Benefits count: 4
   ```

4. **Refresh Sanity Studio** to see the restored document

---

## Option 3: Manual Recreation in Sanity Studio

If the migration script doesn't work due to token permissions, you can manually recreate it:

### Steps:

1. **Open Sanity Studio:**
   - Go to: `https://secure-forms-2.preview.emergentagent.com/studio`

2. **Create New Document:**
   - Click **"+"** or **"Create"** button
   - Select: **"Rental Services Page Content"** (or `rentalServicesSettingsHybrid`)

3. **Fill in the sections:**

#### Hero Section:
- **Heading:** `Property Management Services`
- **Description:** `Maximize your rental income while we handle everything from guest communication to property maintenance.`
- **Background Image:** Upload or use URL: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920`

#### Services Grid (6 services):

1. **Listing Optimization**
   - Description: `Professional photography, compelling descriptions, and strategic pricing to maximize visibility and bookings`

2. **Guest Communication**
   - Description: `24/7 guest support handling inquiries, bookings, and ensuring excellent customer experience`

3. **Cleaning & Maintenance**
   - Description: `Coordinated cleaning services and property care to maintain high standards between guest stays`

4. **Revenue Management**
   - Description: `Dynamic pricing strategies based on demand, seasonality, and market trends to maximize income`

5. **Marketing**
   - Description: `Multi-platform listing management across Airbnb, Booking.com, and other major vacation rental platforms`

6. **Financial Reporting**
   - Description: `Detailed monthly reports with income breakdown, expenses, and performance analytics`

#### Benefits Section:

**Heading:** `Benefits of Professional Management`

**Benefits (4 items):**

1. **Hands-Free Operation**
   - Description: `We handle all aspects of property management so you can enjoy passive income without the hassle`

2. **Higher Occupancy**
   - Description: `Professional management typically results in 30-50% increase in bookings and revenue`

3. **Better Reviews**
   - Description: `5-star service quality ensures excellent guest reviews and improved property reputation`

4. **Property Care**
   - Description: `Regular maintenance and inspections keep your property in top condition and protect your investment`

#### Form Section:
- **Heading:** `Partner With Us`
- **Description:** `Let's discuss how we can maximize your rental income. Fill out the form below and we'll contact you within 24 hours to schedule a consultation.`

4. **Click "Publish"**

---

## Option 4: Contact Sanity Support

If the above options don't work:

1. **Sanity Support:**
   - Email: support@sanity.io
   - Or use the chat in Sanity Management Console
   - Provide:
     - Project ID: `vrhdu6hl`
     - Dataset: `production`
     - Document type: `rentalServicesSettingsHybrid`
     - Request: Restore deleted document

2. **They can:**
   - Check if document can be recovered
   - Provide document history
   - Restore from backups (if available)

---

## Important Note: Website Still Works!

**Good news:** Even though the document is deleted in Sanity, **the website is still working** because:

1. ✅ The code has fallback data
2. ✅ Rental Services page is displaying correctly
3. ✅ All content is showing from fallback

**To verify:**
- Visit: `https://secure-forms-2.preview.emergentagent.com/rental-services`
- The page should load normally with all content

---

## What Happens After Restoration?

Once the document is restored:

1. ✅ Content will be manageable via Sanity Studio
2. ✅ You can edit text, images, and services
3. ✅ Changes will reflect on the website (after cache clears)

Until then:
- Website continues to work with fallback data
- No visitor impact
- You just can't edit the content via Sanity Studio

---

## Troubleshooting

**If migration script fails with "Unauthorized":**
- The Sanity API token might be expired or have limited permissions
- Try Option 3 (manual recreation) instead

**If document appears but seems empty:**
- Check that all fields are filled
- Make sure you clicked "Publish" (not just "Save")

**If changes don't appear on website:**
- Wait 5 minutes (cache revalidation time is 300 seconds)
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

---

## Quick Recovery Command

If you want to try the quickest option:

```bash
cd /app && node sanity/migrations/restore-rental-services.js
```

Then refresh Sanity Studio!

---

## Summary

**Best Option:** Run the migration script (Option 2)
**Easiest Option:** Check Sanity document history (Option 1)  
**Most Reliable:** Manual recreation (Option 3)

**Current Status:** Website is working fine, just need to restore for CMS management.

---

**Need help?** The migration script will recreate everything automatically with all the correct content!
