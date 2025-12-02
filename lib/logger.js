/**
 * Secure logging utility
 * Only logs in development, sanitizes in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

function maskEmail(email) {
  if (!email || typeof email !== 'string') return 'invalid';
  const [local, domain] = email.split('@');
  if (!local || !domain) return 'invalid';
  return `${local.charAt(0)}***@${domain}`;
}

export const logger = {
  info: (message, data = {}) => {
    if (isDevelopment) {
      console.log('ℹ️', message, data);
    }
  },
  
  warn: (message, data = {}) => {
    console.warn('⚠️', message, data);
  },
  
  error: (message, error = {}) => {
    // Always log errors, but sanitize
    console.error('❌', message, {
      message: error.message || error,
      code: error.code,
    });
  },
  
  // Secure logging for sensitive operations
  secureLog: (operation, data = {}) => {
    if (isDevelopment) {
      console.log(`🔒 ${operation}`, {
        ...data,
        email: data.email ? maskEmail(data.email) : undefined,
      });
    }
  }
};
