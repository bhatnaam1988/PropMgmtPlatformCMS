# Update Cleaning Services in Sanity CMS

## Overview
The cleaning services page has been updated to display only 3 services in one row:
1. **Deep Cleaning**
2. **Linen Service**  
3. **Quality Inspections**

The first item (Turnover Cleaning) is now skipped in the display.

---

## Changes Made

### 1. Code Changes (Already Applied)
- **File:** `/app/app/cleaning-services/CleaningServicesClient.js`
- **Change:** Updated services grid to display only 3 items using `.slice(1, 4)`
- **Layout:** Changed from `md:grid-cols-2 lg:grid-cols-3` to `md:grid-cols-3` for consistent 3-column layout
- **Spacing:** Increased padding and centered items for better visual appearance

### 2. Fallback Data Updated
- **File:** `/app/app/cleaning-services/page.js`
- **Change:** Updated service descriptions to be more detailed and professional

---

## How to Update Sanity CMS Data

Since the Sanity API token may have limited permissions, here's how to update the data manually through the Sanity Studio:

### Step 1: Access Sanity Studio
1. Navigate to: `https://sanity-nextjs.preview.emergentagent.com/studio`
2. Login with your Sanity credentials

### Step 2: Find Cleaning Services Document
1. In the left sidebar, look for **"Cleaning Services Page Content"** or search for `cleaningServicesSettingsHybrid`
2. Click on the document to edit it

### Step 3: Update Services Grid
Navigate to the **"Services Grid"** section and update the services array:

**Keep these services (in this order):**

1. **First Item (will be skipped in display):**
   - Title: `Turnover Cleaning`
   - Description: `Complete cleaning between guest stays (will not be displayed).`
   - Note: This item is kept for backward compatibility but won't be shown

2. **Deep Cleaning** (will be displayed as 1st item):
   - Title: `Deep Cleaning`
   - Description: `Comprehensive seasonal cleaning including windows, appliances, and detailed sanitization`

3. **Linen Service** (will be displayed as 2nd item):
   - Title: `Linen Service`
   - Description: `Professional laundering, ironing, and fresh linen setup for each guest arrival`

4. **Quality Inspections** (will be displayed as 3rd item):
   - Title: `Quality Inspections`
   - Description: `Post-cleaning inspection to ensure everything meets our high standards before guest check-in`

### Step 4: Save and Publish
1. Click the **"Publish"** button in the top-right corner
2. Wait for the confirmation message
3. Refresh the cleaning services page to see the changes

---

## Current Display Logic

The code now uses `.slice(1, 4)` which means:
- **Index 0** (Turnover Cleaning) is **skipped**
- **Index 1** (Deep Cleaning) is **displayed** as 1st card
- **Index 2** (Linen Service) is **displayed** as 2nd card
- **Index 3** (Quality Inspections) is **displayed** as 3rd card

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Services Section                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   [Icon]     │  │   [Icon]     │  │   [Icon]     │         │
│  │              │  │              │  │              │         │
│  │ Deep         │  │ Linen        │  │ Quality      │         │
│  │ Cleaning     │  │ Service      │  │ Inspections  │         │
│  │              │  │              │  │              │         │
│  │ Description  │  │ Description  │  │ Description  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Benefits Section

Also update the **Benefits Section** if needed:

1. **Local Team**
   - Description: `Experienced cleaners who know Grächen properties and Alpine accommodation standards`

2. **Reliable Scheduling**
   - Description: `Flexible timing to accommodate back-to-back bookings and tight turnarounds`

3. **Eco-Friendly Products**
   - Description: `High-quality, environmentally responsible cleaning products safe for guests and properties`

---

## Testing

After making changes in Sanity:
1. Clear browser cache or open in incognito mode
2. Navigate to: `https://sanity-nextjs.preview.emergentagent.com/cleaning-services`
3. Verify that only 3 services are displayed in one row
4. Check that spacing and layout look professional
5. Test on mobile devices to ensure responsiveness

---

## Troubleshooting

**If services don't update:**
1. Check if you clicked "Publish" (not just "Save")
2. Wait 5 minutes for cache to clear (revalidate is set to 300 seconds)
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

**If layout looks broken:**
1. Ensure you have exactly 4 items in the services array (1st will be skipped, 2-4 will be shown)
2. Check that all service items have both `title` and `description` fields

**If old content is showing:**
1. The fallback data in the code will be used if Sanity data is not available
2. Make sure the Sanity document is published (not in draft state)

---

## Alternative: Using Migration Script

If you have proper Sanity API access, you can run the migration script:

```bash
cd /app
node sanity/migrations/update-cleaning-services.js
```

**Note:** This requires a valid `SANITY_API_TOKEN` with write permissions in your `.env.local` file.

---

## Summary

✅ Code updated to display 3 items in one row
✅ Layout centered and properly spaced
✅ Fallback data updated with better descriptions
✅ First item (Turnover Cleaning) is skipped in display
✅ Responsive design maintained

**Next Step:** Update the Sanity Studio data following the instructions above.
