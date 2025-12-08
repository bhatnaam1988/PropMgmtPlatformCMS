# 🔧 Security Fix Implementation Guide
**Quick Start Guide for Resolving Critical Security Issues**

---

## 🚨 CRITICAL: Do This FIRST (Before Any Deployment)

### Step 1: Secure API Keys (30 minutes)

#### 1.1 Check `.gitignore`
```bash
# Verify these are in .gitignore
echo "
.env
.env.local
.env*.local
" >> .gitignore
```

#### 1.2 Remove Keys from .env Files
Edit `/app/.env` and `/app/.env.local`:
- Comment out or remove ALL API keys
- Keep only configuration values:

```bash
# .env (Keep these)
MONGO_DB_NAME=swissalpine
NEXT_PUBLIC_BASE_URL=https://secure-forms-2.preview.emergentagent.com
STRIPE_CURRENCY=chf
STRIPE_TAX_MODE=manual
UPLISTING_API_URL=https://connect.uplisting.io
ADMIN_EMAIL=bookings@yourdomain.com  # Change this!

# Remove these (set in deployment dashboard):
# SANITY_API_TOKEN=
# STRIPE_SECRET_KEY=
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# STRIPE_WEBHOOK_SECRET=
# UPLISTING_API_KEY=
# UPLISTING_CLIENT_ID=
# RESEND_API_KEY=
```

#### 1.3 Rotate ALL Exposed Keys

**Sanity.io:**
1. Go to https://www.sanity.io/manage
2. Navigate to your project > API > Tokens
3. Delete old token: `skZRlQ73VpCchEOureYWpV6yjWGwZ5d4...`
4. Create new token with same permissions
5. Copy new token to Emergent Dashboard

**Stripe:**
1. Go to https://dashboard.stripe.com/apikeys
2. Rotate both test keys:
   - Delete `sk_test_51QgR1DHJGligTDgH...`
   - Delete `pk_test_51QgR1DHJGligTDgH...`
3. Create new test keys
4. Update webhook secret: https://dashboard.stripe.com/webhooks

**Uplisting:**
1. Contact Uplisting support to rotate API key
2. OR generate new key from dashboard if available

**Resend:**
1. Go to https://resend.com/api-keys
2. Delete key: `re_ERQXRMqa_DqmFAnpBk24a4nNCCYiFBhyM`
3. Create new API key

#### 1.4 Set Keys in Deployment Dashboard
1. Go to Emergent Deployment Dashboard
2. Navigate to Environment Variables section
3. Add all keys securely:
   - `SANITY_API_TOKEN` = [new token]
   - `STRIPE_SECRET_KEY` = [new test key]
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = [new pub key]
   - `STRIPE_WEBHOOK_SECRET` = [new webhook secret]
   - `UPLISTING_API_KEY` = [new key]
   - `UPLISTING_CLIENT_ID` = [your client id]
   - `RESEND_API_KEY` = [new key]

---

### Step 2: Implement Rate Limiting (3-4 hours)

#### 2.1 Install Dependencies
```bash
cd /app
yarn add next-rate-limit lru-cache
```

#### 2.2 Create Middleware
Create `/app/middleware.js`:

```javascript
import { NextResponse } from 'next/server';
import rateLimit from 'next-rate-limit';

// Configure rate limiters for different endpoints
const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

const formLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

const paymentLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  try {
    // Form submissions: 5 per 15 minutes
    if (pathname.startsWith('/api/forms/')) {
      await formLimiter.check(request, 5, 'FORM_LIMIT');
    }
    
    // Payment intents: 10 per hour
    else if (pathname.includes('/api/stripe/create-payment-intent')) {
      await paymentLimiter.check(request, 10, 'PAYMENT_LIMIT');
    }
    
    // General API: 100 per minute
    else if (pathname.startsWith('/api/')) {
      await apiLimiter.check(request, 100, 'API_LIMIT');
    }
    
    return NextResponse.next();
    
  } catch {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: '1 minute'
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

#### 2.3 Test Rate Limiting
```bash
# Test form rate limit (should fail after 5 requests)
for i in {1..10}; do 
  curl -X POST http://localhost:3000/api/forms/newsletter \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@test.com"}' \
    -w "\nStatus: %{http_code}\n"
  sleep 1
done
```

---

### Step 3: Fix CORS Configuration (1 hour)

#### 3.1 Update Environment Variable
Edit `/app/.env`:
```bash
# Change from:
CORS_ORIGINS=*

# To (use your actual domain):
CORS_ORIGINS=https://secure-forms-2.preview.emergentagent.com,https://yourdomain.com
```

#### 3.2 Update next.config.js
Replace the headers section:

```javascript
// /app/next.config.js
async headers() {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['https://secure-forms-2.preview.emergentagent.com'];
  
  return [
    {
      source: "/(.*)",
      headers: [
        // CORS - Restrict to specific origins
        { 
          key: "Access-Control-Allow-Origin", 
          value: allowedOrigins[0] // Primary domain
        },
        { 
          key: "Access-Control-Allow-Methods", 
          value: "GET, POST, PUT, DELETE, OPTIONS" 
        },
        { 
          key: "Access-Control-Allow-Headers", 
          value: "Content-Type, Authorization" 
        },
        
        // Security Headers
        { 
          key: "Strict-Transport-Security", 
          value: "max-age=31536000; includeSubDomains" 
        },
        { 
          key: "X-Frame-Options", 
          value: "SAMEORIGIN" // Changed from ALLOWALL
        },
        { 
          key: "X-Content-Type-Options", 
          value: "nosniff" 
        },
        { 
          key: "X-XSS-Protection", 
          value: "1; mode=block" 
        },
        { 
          key: "Referrer-Policy", 
          value: "strict-origin-when-cross-origin" 
        },
        { 
          key: "Permissions-Policy", 
          value: "camera=(), microphone=(), geolocation=()" 
        },
        { 
          key: "Content-Security-Policy", 
          value: "frame-ancestors 'self';" // Changed from *
        },
      ],
    },
  ];
},
```

---

## 🟠 HIGH PRIORITY: Implement Within Week 1

### Step 4: Input Sanitization (4-6 hours)

#### 4.1 Install Dependencies
```bash
yarn add validator dompurify isomorphic-dompurify
```

#### 4.2 Create Sanitization Utility
Create `/app/lib/sanitize.js`:

```javascript
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

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
export function sanitizeText(text, maxLength = 1000) {
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
  
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new Error('Invalid phone number length');
  }
  
  return cleaned;
}

/**
 * Sanitize and validate URL
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required');
  }
  
  if (!validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  })) {
    throw new Error('Invalid URL format');
  }
  
  return url.trim();
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
```

#### 4.3 Update Form Routes
Example for `/app/api/forms/newsletter/route.js`:

```javascript
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sanitizeEmail } from '@/lib/sanitize';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { email } = formData;

    // Validate and sanitize email
    let sanitizedEmail;
    try {
      sanitizedEmail = sanitizeEmail(email);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME || 'swissalpine');
    
    // Check if email already exists
    const existingSubscriber = await db.collection('newsletter_subscribers').findOne({ 
      email: sanitizedEmail 
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, error: 'This email is already subscribed to our newsletter' },
        { status: 400 }
      );
    }

    // Create subscription record
    const subscription = {
      email: sanitizedEmail,
      subscribedAt: new Date(),
      status: 'active',
      source: 'homepage',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    const result = await db.collection('newsletter_subscribers').insertOne(subscription);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
```

Apply similar sanitization to ALL form routes:
- `/app/api/forms/contact/route.js`
- `/app/api/forms/jobs/route.js`
- `/app/api/forms/cleaning/route.js`
- `/app/api/forms/rental/route.js`
- etc.

---

### Step 5: Remove Sensitive Logging (2-3 hours)

#### 5.1 Create Secure Logger
Create `/app/lib/logger.js`:

```javascript
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

function maskApiKey(key) {
  if (!key || typeof key !== 'string') return 'invalid';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
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
      message: error.message,
      // Do NOT log: error.stack, full error object, sensitive data
    });
  },
  
  // Secure logging for sensitive operations
  secureLog: (operation, data = {}) => {
    if (isDevelopment) {
      console.log(`🔒 ${operation}`, {
        ...data,
        email: data.email ? maskEmail(data.email) : undefined,
        apiKey: data.apiKey ? maskApiKey(data.apiKey) : undefined,
      });
    }
  }
};
```

#### 5.2 Replace Console.log Statements
Search and replace in all API routes:

```bash
# Find all console.log in API routes
grep -r "console.log" /app/app/api --include="*.js"

# For each file, replace with logger
```

Example replacement:
```javascript
// BEFORE
console.log('💰 Calculated pricing:', pricing);
console.log('🔑 Using credentials:', { apiKeyPrefix: UPLISTING_API_KEY?.substring(0, 10) });

// AFTER
import { logger } from '@/lib/logger';
logger.secureLog('Pricing calculated', { total: pricing.grandTotal });
logger.secureLog('API call initiated', { service: 'Uplisting' });
```

#### 5.3 Never Log These:
- ❌ Full email addresses
- ❌ Payment amounts/details
- ❌ API keys (even prefixes)
- ❌ Personal information (names, phones, addresses)
- ❌ Session tokens
- ❌ Password hashes
- ❌ Credit card numbers (you shouldn't have these anyway)

---

## 🎯 Testing Your Security Fixes

### Test 1: Rate Limiting
```bash
# Should receive 429 after limit
./test-rate-limit.sh
```

### Test 2: CORS
```bash
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://localhost:3000/api/properties
# Should NOT return Access-Control-Allow-Origin header for malicious site
```

### Test 3: Input Sanitization
```bash
# Try XSS attack
curl -X POST http://localhost:3000/api/forms/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>",
    "email": "test@test.com",
    "subject": "Test",
    "message": "Test",
    "inquiryType": "general"
  }'
# Should sanitize the script tags
```

### Test 4: Security Headers
```bash
curl -I http://localhost:3000
# Should see:
# - Strict-Transport-Security
# - X-Content-Type-Options
# - X-Frame-Options: SAMEORIGIN
```

---

## 📊 Progress Tracker

Mark items as complete:

### Critical (Must Do Before Deployment)
- [ ] Step 1: Remove and rotate all API keys
- [ ] Step 2: Implement rate limiting
- [ ] Step 3: Fix CORS configuration

### High Priority (Week 1)
- [ ] Step 4: Add input sanitization
- [ ] Step 5: Remove sensitive logging
- [ ] Add security headers (included in Step 3)
- [ ] Improve email validation (included in Step 4)

### Deployment Checklist
- [ ] All keys configured in Deployment Dashboard
- [ ] `.env` files contain no secrets
- [ ] Rate limiting tested and working
- [ ] CORS tested and working
- [ ] Input sanitization tested on all forms
- [ ] No sensitive data in logs
- [ ] Security headers verified with https://securityheaders.com

---

## 🆘 Need Help?

**Common Issues:**

1. **Rate limiter not working?**
   - Ensure middleware.js is in the correct location (/app/middleware.js)
   - Check that `next-rate-limit` is installed
   - Restart Next.js server

2. **CORS still allowing all origins?**
   - Verify `.env` is loaded (check with `console.log(process.env.CORS_ORIGINS)`)
   - Restart server after changing .env
   - Clear browser cache

3. **Sanitization breaking forms?**
   - Check error messages in browser console
   - Verify validator library is installed
   - Test with valid inputs first

---

**Once all critical and high-priority fixes are complete, refer back to SECURITY_AUDIT_REPORT.md for medium and low priority improvements.**
