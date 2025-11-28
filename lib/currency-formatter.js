/**
 * Format currency with proper decimal handling
 * - Shows 2 decimal places if the value has decimals (e.g., 28.42)
 * - Shows no decimals if it's a whole number (e.g., 169, not 169.00)
 * 
 * @param {number} value - The numeric value to format
 * @returns {string} - Formatted number string
 */
export function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  // Check if the number has decimal places
  const hasDecimals = value % 1 !== 0;
  
  if (hasDecimals) {
    // Show up to 2 decimal places for non-whole numbers
    return value.toFixed(2);
  } else {
    // Show no decimals for whole numbers
    return Math.round(value).toString();
  }
}

/**
 * Format currency with symbol
 * @param {number} value - The numeric value to format
 * @param {string} currency - Currency symbol (default: 'CHF')
 * @returns {string} - Formatted currency string
 */
export function formatCurrencyWithSymbol(value, currency = 'CHF') {
  return `${currency} ${formatCurrency(value)}`;
}
