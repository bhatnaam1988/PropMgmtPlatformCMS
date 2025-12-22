# Footer Copyright Update Guide

## Current Issue
The footer copyright text is managed through Sanity CMS and needs to be updated from:
- **Current:** "© 2024 Swiss Alpine Journey. All rights reserved."
- **Required:** "© 2025 Swiss Alpine Journey. All Rights Reserved."

## How to Update via Sanity Studio

### Step 1: Access Sanity Studio
Navigate to: `https://secure-forms-2.preview.emergentagent.com/studio`

### Step 2: Login
Use your Sanity credentials to log in to the CMS dashboard.

### Step 3: Navigate to Footer Settings
1. In the left sidebar, look for **"Footer"** document type
2. Click on it to open the footer configuration

### Step 4: Update Copyright Text
1. Find the field labeled **"Copyright Text"**
2. Change the value from:
   ```
   © 2024 Swiss Alpine Journey. All rights reserved.
   ```
   to:
   ```
   © 2025 Swiss Alpine Journey. All Rights Reserved.
   ```

### Step 5: Save Changes
1. Click the **"Publish"** button in the bottom right corner
2. Wait for the confirmation message

### Step 6: Verify Changes
1. Go back to the website: `https://secure-forms-2.preview.emergentagent.com`
2. Scroll to the footer
3. Verify the copyright text now shows: "© 2025 Swiss Alpine Journey. All Rights Reserved."

## Technical Details

### Code Changes Already Applied ✅
The fallback copyright text in the code has already been updated in:
- **File:** `/app/components/Footer.js`
- **Line:** 41
- **Change:** Updated to "© 2025 Swiss Alpine Journey. All Rights Reserved."

This fallback will be used if Sanity CMS data is unavailable.

### Why Sanity Update is Needed
The footer component fetches content from Sanity CMS first, and only uses the fallback if Sanity data is not available. Since your Sanity CMS has footer data configured, it's overriding the fallback.

## Alternative: Programmatic Update (Advanced)

If you prefer to update it programmatically without using the Studio UI, you can use the Sanity client to update the document directly. However, using the Studio UI is the recommended approach as it's safer and allows you to see all footer settings at once.

## Note for Future Updates

Both the code fallback and Sanity CMS content should be kept in sync for consistency:
1. Update in Sanity Studio (primary source)
2. Update in code fallback (secondary/backup)

This ensures the copyright text is correct even if Sanity CMS is temporarily unavailable.
