import { retryConfig } from './stripe-client';

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} backoffMs - Base backoff time in milliseconds
 * @param {string} operationName - Name for logging
 * @returns {Promise} Result of function or throws last error
 */
export async function retryWithBackoff(fn, maxAttempts = retryConfig.maxAttempts, backoffMs = retryConfig.backoffMs, operationName = 'operation') {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 [${operationName}] Attempt ${attempt}/${maxAttempts}`);
      const result = await fn();
      
      if (attempt > 1) {
        console.log(`✅ [${operationName}] Succeeded on attempt ${attempt}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`❌ [${operationName}] Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        const delay = backoffMs * attempt; // Linear backoff
        console.log(`⏳ [${operationName}] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  // All attempts failed
  console.error(`💥 [${operationName}] All ${maxAttempts} attempts failed`);
  throw lastError;
}

/**
 * Generate a unique idempotency key
 * @param {string} prefix - Prefix for the key
 * @param {Object} data - Data to include in key generation
 * @returns {string} Idempotency key
 */
export function generateIdempotencyKey(prefix, data) {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const dataHash = JSON.stringify(data).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `${prefix}_${timestamp}_${Math.abs(dataHash)}_${randomPart}`;
}

/**
 * Send admin alert (placeholder for future email integration)
 * @param {string} subject - Alert subject
 * @param {Object} details - Alert details
 */
export function sendAdminAlert(subject, details) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const alertEnabled = process.env.ADMIN_ALERT_ENABLED === 'true';
  
  if (!alertEnabled || !adminEmail) {
    console.warn('⚠️ Admin alerts are disabled or email not configured');
    return;
  }
  
  // Log to console (in production, this would send an email)
  console.error('🚨 [ADMIN ALERT]', {
    to: adminEmail,
    subject,
    details,
    timestamp: new Date().toISOString(),
  });
  
  // TODO: Integrate email service (SendGrid, Resend, etc.)
  // For now, just logging to console
}

export default retryWithBackoff;
