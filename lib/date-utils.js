// Format date for display (e.g., "January 15, 2024")
export function formatDateForDisplay(date) {
  if (!date) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
}

// Format date for datetime attribute (ISO format)
export function formatDateForAttribute(date) {
  if (!date) return '';
  return new Date(date).toISOString();
}

// Calculate reading time based on word count
export function calculateReadingTime(text) {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
