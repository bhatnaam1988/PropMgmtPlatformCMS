/**
 * Accessibility Utility Functions
 * Helpers for WCAG 2.1 AA compliance
 */

/**
 * Generate accessible image alt text for property images
 */
export function generatePropertyImageAlt(property, imageIndex = 0) {
  if (!property) return 'Property image';
  
  const location = property.address?.city || 'Grächen';
  const bedrooms = property.bedrooms || '';
  const type = property.type || 'vacation rental';
  
  if (imageIndex === 0) {
    return `${bedrooms ? `${bedrooms} bedroom ` : ''}${type} in ${location} - Main image`;
  }
  
  return `${bedrooms ? `${bedrooms} bedroom ` : ''}${type} in ${location} - Image ${imageIndex + 1}`;
}

/**
 * Generate alt text for location/destination images
 */
export function generateLocationImageAlt(locationName, context = '') {
  return `${locationName}, Switzerland${context ? ` - ${context}` : ''}`;
}

/**
 * Generate alt text for service images
 */
export function generateServiceImageAlt(serviceName, context = '') {
  return `${serviceName}${context ? ` - ${context}` : ''}`;
}

/**
 * Check if color contrast meets WCAG AA standards
 * Returns true if contrast ratio is >= 4.5:1 for normal text or >= 3:1 for large text
 */
export function meetsContrastRequirement(foreground, background, isLargeText = false) {
  const ratio = calculateContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(color) {
  // Simple implementation for hex colors
  // For production, consider using a library like 'color-contrast-checker'
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Trap focus within a modal/dialog
 */
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Format number for screen readers
 */
export function formatNumberForScreenReader(number, context = '') {
  if (typeof number !== 'number') return '';
  
  const formatted = new Intl.NumberFormat('en-US').format(number);
  return context ? `${formatted} ${context}` : formatted;
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date) {
  if (!(date instanceof Date)) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
