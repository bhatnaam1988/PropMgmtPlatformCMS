/**
 * Property Configuration
 * 
 * This file contains configuration for properties including primary/showcase images
 * that should be displayed first across all property views.
 */

// Primary images for properties - these will be shown first in all property displays
export const PRIMARY_IMAGES = {
  '84656': 'https://cdn.filestackcontent.com/resize=width:1200,fit:max/quality=value:80/compress/P8zGn2yTiq7FL6P1yctj',
  '186289': 'https://cdn.filestackcontent.com/resize=width:1200,fit:max/quality=value:80/compress/wURZa6mSQ6di77fLopiq',
  '174947': 'https://cdn.filestackcontent.com/resize=width:1200,fit:max/quality=value:80/compress/G1TCaC2UThunMnKsTuuz'
};

/**
 * Reorders property photos to place the primary image first
 * @param {Object} property - Property object with photos array
 * @returns {Object} - Property object with reordered photos
 */
export function setPrimaryImage(property) {
  if (!property || !property.id) return property;
  
  const primaryImageUrl = PRIMARY_IMAGES[property.id];
  
  // If no primary image configured, return property as-is
  if (!primaryImageUrl) return property;
  
  // If property has no photos, return as-is
  if (!property.photos || !Array.isArray(property.photos) || property.photos.length === 0) {
    return property;
  }
  
  // Check if primary image already exists in photos array
  const primaryImageIndex = property.photos.findIndex(photo => photo.url === primaryImageUrl);
  
  // If primary image exists in photos, move it to first position
  if (primaryImageIndex > 0) {
    const primaryPhoto = property.photos[primaryImageIndex];
    const reorderedPhotos = [
      primaryPhoto,
      ...property.photos.slice(0, primaryImageIndex),
      ...property.photos.slice(primaryImageIndex + 1)
    ];
    
    return {
      ...property,
      photos: reorderedPhotos
    };
  }
  
  // If primary image doesn't exist in photos array, add it as first photo
  if (primaryImageIndex === -1) {
    const primaryPhoto = {
      url: primaryImageUrl,
      description: `${property.name || 'Property'} - Primary Image`
    };
    
    return {
      ...property,
      photos: [primaryPhoto, ...property.photos]
    };
  }
  
  // Primary image is already first, return as-is
  return property;
}

/**
 * Process multiple properties to set their primary images
 * @param {Array} properties - Array of property objects
 * @returns {Array} - Array of properties with primary images set
 */
export function setPrimaryImagesForList(properties) {
  if (!Array.isArray(properties)) return properties;
  return properties.map(property => setPrimaryImage(property));
}
