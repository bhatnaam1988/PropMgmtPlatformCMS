/**
 * Image Optimization Utilities
 * Handles optimization for external images (Uplisting/Filestack)
 */

/**
 * Optimizes Uplisting property images from Filestack CDN
 * Applies transformation parameters for better performance
 * 
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @param {number} options.width - Target width in pixels
 * @param {number} options.quality - Quality (1-100, default 75)
 * @param {string} options.format - Image format (default 'auto')
 * @returns {string} Optimized image URL
 */
export function optimizeUplistingImage(url, options = {}) {
  if (!url) return '';
  
  const {
    width = 800,
    quality = 75,
    format = 'auto'
  } = options;
  
  // Check if it's a Filestack URL (Uplisting images)
  if (url.includes('filestackcontent.com')) {
    // Filestack supports URL transformations
    // Format: https://cdn.filestackcontent.com/resize=width:800/compress/auto_image/[handle]
    const baseUrl = url.split('?')[0]; // Remove existing params
    
    // Apply Filestack transformations
    // Note: Check Uplisting API docs for exact supported parameters
    return `${baseUrl}?w=${width}&q=${quality}&auto=compress,format`;
  }
  
  // For other URLs, return as-is (Next.js Image will optimize)
  return url;
}

/**
 * Gets optimal image dimensions based on use case
 */
export const IMAGE_SIZES = {
  // Property cards in grid
  CARD: {
    width: 800,
    quality: 75,
  },
  // Property detail page hero
  DETAIL_HERO: {
    width: 1200,
    quality: 80,
  },
  // Property detail gallery thumbnails
  THUMBNAIL: {
    width: 400,
    quality: 70,
  },
  // Property detail gallery full size
  GALLERY: {
    width: 1600,
    quality: 85,
  },
  // Mobile optimized
  MOBILE: {
    width: 640,
    quality: 70,
  },
};

/**
 * Generates responsive image sizes attribute for Next.js Image
 * @param {string} usage - Image usage context
 */
export function getImageSizes(usage = 'default') {
  const sizesMap = {
    hero: '100vw',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    detail: '(max-width: 768px) 100vw, 50vw',
    thumbnail: '(max-width: 640px) 50vw, 25vw',
    default: '100vw',
  };
  
  return sizesMap[usage] || sizesMap.default;
}

/**
 * Extracts Uplisting image array and returns optimized URLs
 * @param {Array} images - Array of Uplisting image objects
 * @param {string} size - Size preset to use
 */
export function getOptimizedImages(images = [], size = 'CARD') {
  if (!images || !Array.isArray(images)) return [];
  
  const sizeConfig = IMAGE_SIZES[size] || IMAGE_SIZES.CARD;
  
  return images.map(img => ({
    ...img,
    url: optimizeUplistingImage(img.url, sizeConfig),
    original: img.url, // Keep original for reference
  }));
}
