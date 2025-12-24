# Deployment Error Fixes - Summary

## 🐛 Issues Identified

### 1. **TypeError: Cannot read properties of null (reading 'digest')**
**Root Cause:** 
- Missing environment variables (UPLISTING_API_KEY, UPLISTING_CLIENT_ID) in production
- When Uplisting API calls failed, errors were thrown without proper structure
- Next.js runtime tried to access `.digest` property on null/undefined error objects

### 2. **Error creating payment intent - "Failed to fetch property data"**
**Root Cause:**
- Payment intent creation makes internal API call to `/api/properties/{id}`
- This call failed due to missing Uplisting credentials
- Error was thrown without proper handling, causing cascade failures

---

## ✅ Fixes Applied

### 1. **Enhanced Environment Variable Validation** (`/lib/uplisting.js`)
```javascript
// Added validation on module load
function validateEnvironment() {
  const missing = [];
  if (!UPLISTING_API_KEY) missing.push('UPLISTING_API_KEY');
  if (!UPLISTING_CLIENT_ID) missing.push('UPLISTING_CLIENT_ID');
  
  if (missing.length > 0) {
    console.error('❌ Missing Uplisting environment variables:', missing.join(', '));
    console.error('Please configure these variables in your deployment dashboard');
    return false;
  }
  return true;
}
```

**Benefits:**
- Clear error messages at startup
- Identifies missing configuration immediately
- Prevents silent failures

### 2. **Structured Error Objects** (`/lib/uplisting.js`)
```javascript
function getHeaders() {
  if (!UPLISTING_API_KEY) {
    const error = new Error('UPLISTING_API_KEY is not configured');
    error.statusCode = 503; // Service Unavailable
    error.userMessage = 'Service configuration error. Please contact support.';
    throw error;
  }
  // ... similar for CLIENT_ID
}
```

**Benefits:**
- Errors have consistent structure
- Proper HTTP status codes
- User-friendly messages for frontend

### 3. **Improved Error Handling in API Routes**

**Updated Routes:**
- ✅ `/app/api/properties/[id]/route.js`
- ✅ `/app/api/properties/route.js`
- ✅ `/app/api/availability/[propertyId]/route.js`
- ✅ `/app/api/stripe/create-payment-intent/route.js`

**Pattern Applied:**
```javascript
} catch (error) {
  logger.error('Context-specific message', {
    propertyId,
    message: error.message,
    statusCode: error.statusCode
  });
  
  const statusCode = error.statusCode || 500;
  const errorMessage = error.userMessage || 'Generic fallback message';
  
  return NextResponse.json(
    { 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    },
    { status: statusCode }
  );
}
```

**Benefits:**
- Prevents null digest errors
- Better logging for debugging
- Appropriate HTTP status codes
- Security: hides internal details in production

### 4. **Enhanced Payment Intent Error Handling**
```javascript
// Better error logging
logger.error('Error creating payment intent', {
  message: error.message,
  code: error.code,
  statusCode: error.statusCode,
  stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
});

// More informative property fetch error
if (!propertyResponse.ok) {
  const errorData = await propertyResponse.json().catch(() => ({ error: 'Unknown error' }));
  logger.error('Failed to fetch property data', {
    propertyId,
    status: propertyResponse.status,
    error: errorData
  });
  
  return NextResponse.json(
    { 
      error: 'Unable to fetch property information. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? errorData : undefined
    },
    { status: 503 }
  );
}
```

**Benefits:**
- No more "Failed to fetch property data" without context
- Clear logging shows exact failure point
- Graceful degradation

---

## 🔧 Required Deployment Configuration

### **CRITICAL: Set These Environment Variables in Emergent Dashboard**

#### 1. **Uplisting API Configuration**
```bash
UPLISTING_API_KEY=<your_base64_encoded_api_key>
UPLISTING_CLIENT_ID=f4fd1410-9636-013e-aeff-2a9672a658e7
UPLISTING_API_URL=https://connect.uplisting.io
```

#### 2. **Stripe Configuration**
```bash
STRIPE_SECRET_KEY=<your_stripe_secret_key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
```

#### 3. **Email Configuration (Resend)**
```bash
RESEND_API_KEY=<your_resend_api_key>
ADMIN_EMAIL=aman.bhatnagar11@gmail.com
```

#### 4. **Google reCAPTCHA v3**
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lcw-CQsAAAAAINd4ubLtdyhmEJfofUzdL56pp27
RECAPTCHA_SECRET_KEY=6Lcw-CQsAAAAADp88DY66UmFzeQRua4jHwX6jgd3
```

#### 5. **Sanity CMS**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=vrhdu6hl
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=<your_sanity_token>
```

#### 6. **MongoDB (Auto-configured by Emergent)**
```bash
MONGO_URL=<provided_by_emergent>
MONGO_DB_NAME=swissalpine
```

---

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Homepage loads without errors
- [ ] Property listing page displays properties
- [ ] Individual property pages load
- [ ] Availability calendar works
- [ ] Booking flow completes
- [ ] Payment processing works
- [ ] Admin receives booking notifications
- [ ] All forms submit successfully
- [ ] reCAPTCHA validates on all forms

---

## 📊 Expected Behavior

### **With Correct Configuration:**
✅ All API routes return proper responses  
✅ Error messages are user-friendly  
✅ Logging provides debugging context  
✅ No "digest" errors  
✅ Payment intents create successfully  

### **With Missing Configuration:**
⚠️ Clear error messages in logs: "Missing Uplisting environment variables"  
⚠️ 503 Service Unavailable responses  
⚠️ User-friendly error messages on frontend  
⚠️ **NO** "Cannot read properties of null (reading 'digest')" errors  

---

## 🔍 Debugging in Production

If issues persist, check deployment logs for:

1. **Startup Messages:**
   ```
   ❌ Missing Uplisting environment variables: UPLISTING_API_KEY, UPLISTING_CLIENT_ID
   ```

2. **API Call Failures:**
   ```
   Error fetching property: {"propertyId": "xxx", "message": "...", "statusCode": 503}
   ```

3. **Payment Intent Errors:**
   ```
   Failed to fetch property data: {"propertyId": "xxx", "status": 503, "error": {...}}
   ```

---

## 📝 Files Modified

1. `/lib/uplisting.js` - Enhanced error handling and validation
2. `/app/api/properties/[id]/route.js` - Better error responses
3. `/app/api/properties/route.js` - Consistent error pattern
4. `/app/api/availability/[propertyId]/route.js` - Improved logging
5. `/app/api/stripe/create-payment-intent/route.js` - Enhanced error context

---

## 🎯 Summary

These fixes ensure:
- **No more "digest" errors** - All errors are properly structured
- **Clear diagnostics** - Missing config is immediately obvious
- **Graceful failures** - Users see helpful messages, not crashes
- **Better debugging** - Logs provide context for troubleshooting
- **Production-safe** - Internal details hidden in production

**Next Step:** Configure the environment variables in your Emergent deployment dashboard and redeploy.
