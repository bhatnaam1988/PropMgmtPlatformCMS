#!/bin/bash

# Load environment variables
source /app/.env.local

PROJECT_ID="${NEXT_PUBLIC_SANITY_PROJECT_ID}"
DATASET="${NEXT_PUBLIC_SANITY_DATASET}"
TOKEN="${SANITY_API_TOKEN}"
API_VERSION="2024-01-01"

echo "🚀 Creating Sanity documents..."
echo "Project ID: $PROJECT_ID"
echo "Dataset: $DATASET"
echo ""

# Navigation document
NAV_DOC='{
  "mutations": [{
    "createOrReplace": {
      "_type": "navigation",
      "_id": "navigation-header",
      "name": "header",
      "items": [
        {
          "_key": "stay",
          "text": "Stay",
          "link": "/stay",
          "children": []
        },
        {
          "_key": "explore",
          "text": "Explore",
          "link": "#",
          "children": [
            {"_key": "graechen", "text": "Grächen", "link": "/explore/graechen"},
            {"_key": "other-locations", "text": "Other Locations", "link": "/explore/other-locations"},
            {"_key": "travel-tips", "text": "Travel Tips", "link": "/explore/travel-tips"},
            {"_key": "behind-scenes", "text": "Behind the Scenes", "link": "/explore/behind-the-scenes"}
          ]
        },
        {
          "_key": "blog",
          "text": "Blog",
          "link": "/blog",
          "children": []
        },
        {
          "_key": "services",
          "text": "Services",
          "link": "#",
          "children": [
            {"_key": "cleaning-services", "text": "Cleaning Services", "link": "/cleaning-services"},
            {"_key": "rental-services", "text": "Rental Services", "link": "/rental-services"}
          ]
        },
        {
          "_key": "about",
          "text": "About",
          "link": "#",
          "children": [
            {"_key": "about-page", "text": "About", "link": "/about"},
            {"_key": "contact", "text": "Contact", "link": "/contact"},
            {"_key": "careers", "text": "Careers", "link": "/jobs"}
          ]
        }
      ]
    }
  }]
}'

echo "📝 Creating Navigation document..."
NAV_RESPONSE=$(curl -s -X POST \
  "https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "$NAV_DOC")

if echo "$NAV_RESPONSE" | grep -q "\"documentId\""; then
  echo "✅ Navigation document created successfully!"
else
  echo "❌ Failed to create Navigation document"
  echo "Response: $NAV_RESPONSE"
fi

echo ""

# Footer document
FOOTER_DOC='{
  "mutations": [{
    "createOrReplace": {
      "_type": "footer",
      "_id": "footer-main",
      "sections": [
        {
          "_key": "services-section",
          "title": "Services",
          "links": [
            {"_key": "cleaning-services", "text": "Cleaning Services", "url": "/cleaning-services"},
            {"_key": "rental-management", "text": "Rental Management", "url": "/rental-services"},
            {"_key": "careers", "text": "Careers", "url": "/jobs"}
          ]
        },
        {
          "_key": "legal-section",
          "title": "Legal",
          "links": [
            {"_key": "privacy", "text": "Privacy Policy", "url": "/legal#privacy"},
            {"_key": "terms", "text": "Terms & Conditions", "url": "/legal#terms"},
            {"_key": "gdpr", "text": "GDPR Information", "url": "/legal#gdpr"}
          ]
        }
      ],
      "socialLinks": [
        {"_key": "instagram", "platform": "instagram", "url": "https://instagram.com/swissalpinejourney"}
      ],
      "copyrightText": "© 2024 Swiss Alpine Journey. All rights reserved."
    }
  }]
}'

echo "📝 Creating Footer document..."
FOOTER_RESPONSE=$(curl -s -X POST \
  "https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "$FOOTER_DOC")

if echo "$FOOTER_RESPONSE" | grep -q "\"documentId\""; then
  echo "✅ Footer document created successfully!"
else
  echo "❌ Failed to create Footer document"
  echo "Response: $FOOTER_RESPONSE"
fi

echo ""
echo "🎉 Done! Documents created in Sanity."
echo "✨ Visit https://rental-fix.preview.emergentagent.com/studio to view them."
