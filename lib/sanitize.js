import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitization utilities for user inputs
 * Protects against XSS, NoSQL injection, and other attacks
 */

/**
 * Sanitize and validate email
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }
  
  const trimmed = email.trim().toLowerCase();
  
  if (!validator.isEmail(trimmed, {
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false
  })) {
    throw new Error('Invalid email format');
  }
  
  // Check for disposable email domains
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com',
    'throwaway.email', 'mailinator.com', 'trashmail.com'
  ];
  
  const domain = trimmed.split('@')[1];
  if (disposableDomains.includes(domain)) {
    throw new Error('Disposable email addresses are not allowed');
  }
  
  return validator.normalizeEmail(trimmed);
}

/**
 * Sanitize plain text (remove all HTML)
 */
export function sanitizeText(text, maxLength = 5000) {
  if (!text) return '';
  if (typeof text !== 'string') {
    throw new Error('Text must be a string');
  }
  
  // Remove all HTML tags
  const cleaned = DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Trim and limit length
  const trimmed = cleaned.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`Text exceeds maximum length of ${maxLength} characters`);
  }
  
  return trimmed;
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone) {
  if (!phone) return '';
  if (typeof phone !== 'string') {
    throw new Error('Phone must be a string');
  }
  
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.length > 0 && (cleaned.length < 10 || cleaned.length > 15)) {
    throw new Error('Invalid phone number length');
  }
  
  return cleaned;
}

/**
 * Escape HTML for email templates
 */
export function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
