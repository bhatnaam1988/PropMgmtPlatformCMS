/**
 * Sanity Content Conditional Rendering Helpers
 * 
 * These utilities help determine if content from Sanity should be rendered
 * on the frontend, preventing empty sections and maintaining clean UI/UX.
 */

/**
 * Check if a field has content
 * Works for strings, numbers, booleans, arrays, and objects
 * 
 * @param {*} value - The value to check
 * @returns {boolean} - True if the field has meaningful content
 */
export function hasContent(value) {
  // Null or undefined
  if (value === null || value === undefined) {
    return false;
  }
  
  // String - check if not empty after trim
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  // Number - check if not NaN
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  
  // Boolean - always has content
  if (typeof value === 'boolean') {
    return true;
  }
  
  // Array - check if has items
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  // Object - check if has properties (excluding empty objects and null)
  if (typeof value === 'object') {
    // Check for Sanity image/file objects
    if (value.asset && (value.asset._ref || value.asset.url)) {
      return true;
    }
    // Check for other objects
    return Object.keys(value).length > 0;
  }
  
  return false;
}

/**
 * Check if a section has enough content to render
 * Checks multiple fields and returns true if ANY have content
 * 
 * @param {Object} section - The section object from Sanity
 * @param {string[]} requiredFields - Array of field names that must have content
 * @returns {boolean} - True if section should render
 */
export function shouldRenderSection(section, requiredFields = []) {
  if (!section) return false;
  
  // If no required fields specified, check if section exists and has any content
  if (requiredFields.length === 0) {
    return hasContent(section);
  }
  
  // Check if ANY of the required fields have content
  return requiredFields.some(field => hasContent(section[field]));
}

/**
 * Check if an array section should render
 * Wrapper for checking array-based sections
 * 
 * @param {Array} items - The array to check
 * @returns {boolean} - True if array has items
 */
export function shouldRenderArraySection(items) {
  return Array.isArray(items) && items.length > 0;
}

/**
 * Get content or fallback
 * Returns content if it exists, otherwise returns fallback
 * 
 * @param {*} content - The content to check
 * @param {*} fallback - The fallback value
 * @returns {*} - Content or fallback
 */
export function getContentOrFallback(content, fallback = '') {
  return hasContent(content) ? content : fallback;
}

/**
 * Example Usage:
 * 
 * // For text fields
 * {hasContent(data.section?.title) && (
 *   <h2>{data.section.title}</h2>
 * )}
 * 
 * // For array sections
 * {shouldRenderArraySection(data.section?.items) && (
 *   <section>
 *     {data.section.items.map(item => ...)}
 *   </section>
 * )}
 * 
 * // For complex sections with multiple fields
 * {shouldRenderSection(data.contactInfo, ['phone', 'email']) && (
 *   <div>Contact information</div>
 * )}
 * 
 * // With fallback
 * <p>{getContentOrFallback(data.description, 'Default description')}</p>
 */
