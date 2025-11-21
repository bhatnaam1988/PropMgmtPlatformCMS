#!/bin/bash

# Alternative method to remove pricing section using Sanity CLI
# This uses the Sanity HTTP API directly

echo "🔄 Removing Pricing Section from Cleaning Services via API..."

# Read environment variables
source .env.local

# Sanity API endpoint
PROJECT_ID="${NEXT_PUBLIC_SANITY_PROJECT_ID}"
DATASET="${NEXT_PUBLIC_SANITY_DATASET}"
API_VERSION="${NEXT_PUBLIC_SANITY_API_VERSION:-2024-01-01}"
TOKEN="${SANITY_API_TOKEN}"

# First, get the document ID
DOC_ID=$(curl -s "https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=*%5B_type%20%3D%3D%20%22cleaningServicesSettingsHybrid%22%5D%5B0%5D._id" \
  -H "Authorization: Bearer ${TOKEN}" | jq -r '.result')

if [ "$DOC_ID" == "null" ] || [ -z "$DOC_ID" ]; then
  echo "❌ Document not found"
  exit 1
fi

echo "📄 Found document: $DOC_ID"

# Create mutation to unset the pricingSection field
MUTATION='{
  "mutations": [
    {
      "patch": {
        "id": "'$DOC_ID'",
        "unset": ["pricingSection"]
      }
    }
  ]
}'

echo "🗑️  Removing pricingSection field..."

# Execute mutation
RESPONSE=$(curl -s -X POST "https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$MUTATION")

# Check response
if echo "$RESPONSE" | jq -e '.transactionId' > /dev/null; then
  echo "✅ Successfully removed pricingSection field"
  echo "📊 Transaction ID: $(echo $RESPONSE | jq -r '.transactionId')"
else
  echo "❌ Failed to remove field"
  echo "$RESPONSE" | jq '.'
  exit 1
fi

echo ""
echo "✨ All done! Please refresh Sanity Studio to see the changes."
