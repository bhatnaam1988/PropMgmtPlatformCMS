/**
 * Sanity Image URL Optimizer
 * Generates optimized image URLs with proper parameters for performance
 */

/**
 * Get optimized Sanity image URL with proper parameters
 * @param {string} url - Base Sanity CDN URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export function getOptimizedSanityImageUrl(url, options = {}) {
  if (!url || !url.includes('cdn.sanity.io')) {
    return url;
  }

  const {
    width = 1920,
    height = null,
    quality = 80,
    format = 'webp',
    fit = 'max',
    auto = 'format'
  } = options;

  // Build query parameters
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality) params.append('q', quality);
  if (format) params.append('fm', format);
  if (fit) params.append('fit', fit);
  if (auto) params.append('auto', auto);

  // Add parameters to URL
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Get responsive srcset for Sanity images
 * @param {string} url - Base Sanity CDN URL
 * @param {Array} widths - Array of widths for srcset
 * @returns {string} srcset string
 */
export function getSanitySrcSet(url, widths = [640, 750, 828, 1080, 1200, 1920, 2048]) {
  if (!url || !url.includes('cdn.sanity.io')) {
    return '';
  }

  return widths
    .map(width => {
      const optimizedUrl = getOptimizedSanityImageUrl(url, { 
        width, 
        quality: 80,
        format: 'webp'
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Image optimization presets for common use cases
 */
export const ImagePresets = {
  hero: {
    width: 1920,
    height: 1080,
    quality: 85,
    format: 'webp',
    fit: 'cover'
  },
  thumbnail: {
    width: 400,
    height: 300,
    quality: 80,
    format: 'webp',
    fit: 'cover'
  },
  card: {
    width: 800,
    height: 600,
    quality: 80,
    format: 'webp',
    fit: 'cover'
  },
  full: {
    width: 2048,
    quality: 90,
    format: 'webp',
    fit: 'max'
  }
};

/**
 * Get optimized image URL with preset
 * @param {string} url - Base Sanity CDN URL
 * @param {string} preset - Preset name (hero, thumbnail, card, full)
 * @returns {string} Optimized image URL
 */
export function getImageWithPreset(url, preset = 'hero') {
  const options = ImagePresets[preset] || ImagePresets.hero;
  return getOptimizedSanityImageUrl(url, options);
}
