# How to Remove Pricing Section from Sanity Studio

The Pricing Section field is still visible in Sanity Studio because the data exists in the document, even though we removed it from the schema definition.

## Why is it still showing?

1. ✅ Schema updated (removed pricingSection field definition)
2. ❌ Document data still contains pricingSection field
3. Result: Field shows in Studio but is "orphaned" (no schema definition)

---

## Solution Options

### Option 1: Manual Removal in Sanity Studio (Easiest)

Since the field is now removed from the schema but still exists in the document, you can:

1. **Access Sanity Studio:** `https://secure-forms-2.preview.emergentagent.com/studio`
2. **Open the document:** Find "Cleaning Services Page Content"
3. **Use Vision Tool (Developer Mode):**
   - Click on "Vision" tab in Sanity Studio
   - Run this GROQ query to see the document:
     ```groq
     *[_type == "cleaningServicesSettingsHybrid"][0]
     ```
   - Copy the document `_id`
   
4. **Use API Tool:**
   - In Vision tab, switch to "MUTATE" mode
   - Use this mutation to remove the field:
     ```json
     [
       {
         "patch": {
           "id": "YOUR_DOCUMENT_ID_HERE",
           "unset": ["pricingSection"]
         }
       }
     ]
     ```

---

### Option 2: Using Sanity CLI (If you have it installed)

If you have Sanity CLI installed locally:

```bash
cd /app
sanity exec sanity/migrations/remove-pricing-section.js --with-user-token
```

---

### Option 3: Direct API Call (Using curl)

Run this command from your terminal:

```bash
# Get your Sanity credentials from .env.local
PROJECT_ID="vrhdu6hl"
DATASET="production"
TOKEN="your-sanity-api-token-here"

# First, get the document ID
DOC_ID=$(curl -s "https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=*%5B_type%20%3D%3D%20%22cleaningServicesSettingsHybrid%22%5D%5B0%5D._id" \
  -H "Authorization: Bearer ${TOKEN}" | jq -r '.result')

echo "Document ID: $DOC_ID"

# Remove the pricingSection field
curl -X POST "https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "mutations": [
      {
        "patch": {
          "id": "'$DOC_ID'",
          "unset": ["pricingSection"]
        }
      }
    ]
  }'
```

---

### Option 4: Let it remain (Recommended for now)

**Important Note:** Even though the field shows in Sanity Studio, it **won't appear on the website** because:

1. ✅ The code no longer renders the pricing section
2. ✅ The schema has been updated (it won't show for new documents)
3. ✅ The website is working correctly without it

**Recommendation:** 
- Leave it in Sanity for now (it's harmless)
- After the Sanity Studio is redeployed, the field will appear as "orphaned" or might not show at all
- You can safely ignore it as it has no effect on the website

---

## What happens after schema change?

When you reload Sanity Studio:
- The Pricing Section field might show with a warning icon (indicating it has no schema definition)
- OR it might be hidden automatically (Sanity sometimes hides orphaned fields)
- The data remains in the document but won't affect the website

---

## To verify it's not showing on website:

1. Visit: `https://secure-forms-2.preview.emergentagent.com/cleaning-services`
2. Scroll through the page
3. Confirm: No pricing section appears between "Benefits" and "Request Form"

✅ The website should be working correctly without the pricing section, regardless of what shows in Sanity Studio.

---

## If you want to clean it up completely:

Contact your Sanity administrator or use the Sanity Management Console to:
1. Log into: https://www.sanity.io/manage
2. Go to your project: `vrhdu6hl`
3. Navigate to "Datasets" → "production"
4. Use the document browser to find and edit the document
5. Manually remove the `pricingSection` field from the JSON

---

## Summary

**Current Status:**
- ✅ Code updated (pricing section removed from display)
- ✅ Schema updated (field definition removed)
- ⚠️ Document data still contains the field (but doesn't affect website)

**Recommendation:**
- **Leave it as is** - The website works correctly
- **Or** - Use Option 1 (Manual removal in Sanity Studio) if you want to clean it up

The field showing in Sanity Studio is cosmetic and doesn't affect the live website at all.
