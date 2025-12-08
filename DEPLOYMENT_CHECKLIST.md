# 🚀 Pre-Deployment Security Checklist

**Before deploying to production, complete ALL items below.**

---

## ✅ CRITICAL - DO BEFORE DEPLOYMENT

### 1. Rotate API Keys (30 minutes) - MANDATORY

- [ ] **Sanity.io API Token**
  - Go to: https://www.sanity.io/manage
  - Navigate to: Your Project > API > Tokens
  - Delete old token: `skZRlQ73VpCchEOureYW...`
  - Create new token with same permissions
  - Copy new token (you'll need it in step 2)

- [ ] **Stripe Keys**
  - Go to: https://dashboard.stripe.com/apikeys
  - Click on "Reveal test key" for current keys
  - Click "Roll" or "Delete" to rotate:
    - Secret Key: `sk_test_51QgR1DHJGligTDgH...`
    - Publishable Key: `pk_test_51QgR1DHJGligTDgH...`
  - Copy both new keys
  
  - Go to: https://dashboard.stripe.com/webhooks
  - Find your webhook endpoint
  - Click "Roll secret" for webhook secret
  - Copy new webhook secret: `whsec_...`

- [ ] **Uplisting API Key**
  - Contact Uplisting support OR
  - Log into Uplisting dashboard
  - Regenerate API key
  - Copy new key

- [ ] **Resend API Key**
  - Go to: https://resend.com/api-keys
  - Find key: `re_ERQXRMqa_DqmFAnpBk24a4nNCCYiFBhyM`
  - Click "Delete" or "Rotate"
  - Create new API key
  - Copy new key

---

### 2. Configure Deployment Dashboard (10 minutes) - MANDATORY

- [ ] Go to Emergent Deployment Dashboard
- [ ] Click on "Environment Variables" or "Settings"
- [ ] Add/Update these variables with NEW keys from Step 1:

```
SANITY_API_TOKEN = [paste new Sanity token]
STRIPE_SECRET_KEY = [paste new Stripe secret key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [paste new Stripe publishable key]
STRIPE_WEBHOOK_SECRET = [paste new webhook secret]
UPLISTING_API_KEY = [paste new Uplisting key]
UPLISTING_CLIENT_ID = f4fd1410-9636-013e-aeff-2a9672a658e7 (CRITICAL - DO NOT CHANGE)
RESEND_API_KEY = [paste new Resend key]
```

- [ ] Keep these variables the same:
```
MONGO_URL = mongodb://localhost:27017
MONGO_DB_NAME = swissalpine
NEXT_PUBLIC_BASE_URL = https://secure-forms-2.preview.emergentagent.com
CORS_ORIGINS = https://secure-forms-2.preview.emergentagent.com
STRIPE_CURRENCY = chf
STRIPE_TAX_MODE = manual
UPLISTING_API_URL = https://connect.uplisting.io
ADMIN_EMAIL = [your email]
```

- [ ] Save all variables
- [ ] Verify variables are saved correctly

---

### 3. Verify .gitignore (2 minutes) - MANDATORY

- [ ] Check that `.gitignore` contains:
```
.env
.env.local
.env*.local
```

- [ ] Verify with command:
```bash
cat /app/.gitignore | grep -E "\.env"
```

- [ ] Make sure no `.env` files are committed:
```bash
git status | grep ".env"
# Should return nothing
```

---

## ✅ RECOMMENDED - TEST BEFORE DEPLOYMENT

### 4. Test Rate Limiting (5 minutes)

Test that rate limiting works:

```bash
# Test newsletter form (should block after 5 requests)
for i in {1..8}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/forms/newsletter \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@test.com"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done
```

- [ ] Requests 1-5 should succeed (200 OK)
- [ ] Requests 6+ should fail (429 Too Many Requests)
- [ ] Wait 15 minutes and try again (should work)

---

### 5. Test Input Sanitization (5 minutes)

Test XSS protection:

```bash
# Should strip script tags
curl -X POST http://localhost:3000/api/forms/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message",
    "inquiryType": "general"
  }'
```

- [ ] Form should accept request
- [ ] Name should be sanitized (no script tags)

Test disposable email blocking:

```bash
# Should reject disposable email
curl -X POST http://localhost:3000/api/forms/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tempmail.com"}'
```

- [ ] Should return 400 error
- [ ] Error message: "Disposable email addresses are not allowed"

---

### 6. Test CORS (2 minutes)

```bash
# Should be blocked (wrong origin)
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  http://localhost:3000/api/properties
```

- [ ] Should NOT return Access-Control-Allow-Origin header

---

### 7. Verify Security Headers (2 minutes)

```bash
curl -I http://localhost:3000 | grep -E "Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options"
```

- [ ] Should see: `Strict-Transport-Security`
- [ ] Should see: `X-Frame-Options: SAMEORIGIN`
- [ ] Should see: `X-Content-Type-Options: nosniff`

---

### 8. Test All Forms (10 minutes)

Manually test each form submission:

- [ ] Newsletter subscription (homepage)
- [ ] Contact form
- [ ] Job application
- [ ] Cleaning services request
- [ ] Rental services inquiry

For each form:
- [ ] Fill with valid data → Should succeed
- [ ] Fill with invalid email → Should be rejected
- [ ] Fill with XSS attempt → Should be sanitized
- [ ] Check admin email received (with escaped HTML)

---

### 9. Test Critical Flows (15 minutes)

- [ ] **Property Search**
  - Go to /stay page
  - Search for properties
  - Apply filters
  - Verify results display

- [ ] **Property Detail**
  - Click on a property
  - View details
  - Select dates
  - Check pricing calculation

- [ ] **Booking Flow** (with test card)
  - Select property and dates
  - Click "Book Now"
  - Fill guest information
  - Use test card: `4242 4242 4242 4242`
  - Verify payment intent created
  - Check Stripe dashboard for payment

- [ ] **Sanity CMS**
  - Go to Sanity Studio
  - Edit homepage content
  - Verify changes appear on site
  - Test header navigation edit
  - Test footer content edit

---

## ✅ POST-DEPLOYMENT - VERIFY IN PRODUCTION

### 10. Verify Security in Production (10 minutes)

After deployment, test:

- [ ] **Security Headers Score**
  - Go to: https://securityheaders.com
  - Enter your domain
  - Target Grade: A or A+

- [ ] **SSL Configuration**
  - Go to: https://www.ssllabs.com/ssltest/
  - Enter your domain
  - Target Grade: A or A+

- [ ] **Rate Limiting Works**
  - Try submitting form 6+ times
  - Should get rate limited

- [ ] **CORS Restricted**
  - Try API call from different origin
  - Should be blocked

- [ ] **Forms Work**
  - Test at least 2 forms
  - Verify emails received

- [ ] **Booking Works**
  - Test full booking flow
  - Verify in Stripe dashboard
  - Verify in Uplisting

---

## 📊 Deployment Status Tracker

Mark your progress:

### Pre-Deployment
- [ ] Step 1: API Keys Rotated
- [ ] Step 2: Deployment Dashboard Configured
- [ ] Step 3: .gitignore Verified
- [ ] Steps 4-9: All Tests Passed

### Deployment
- [ ] Deployed to Production
- [ ] Step 10: Production Verification Complete

### Final Sign-Off
- [ ] Security Grade: A or A+
- [ ] All Critical Flows Working
- [ ] No Exposed Secrets
- [ ] Ready for Live Traffic

---

## 🚨 If Something Goes Wrong

### API Not Working
1. Check environment variables in dashboard
2. Verify keys are correct (not expired)
3. Check service status pages:
   - Stripe: https://status.stripe.com
   - Sanity: https://status.sanity.io
   - Uplisting: Contact support

### Rate Limiting Too Strict
1. Temporarily increase limits in `/app/middleware.js`
2. Redeploy
3. Monitor for abuse
4. Adjust as needed

### Forms Not Submitting
1. Check browser console for errors
2. Verify rate limit not hit
3. Check email validation rules
4. Review server logs

### Booking Failures
1. Check Stripe dashboard for payment errors
2. Verify webhook endpoint configured
3. Check Uplisting API status
4. Review server logs (secure logger)

---

## 📞 Support

If you encounter issues:
1. Check `/app/SECURITY_FIXES_IMPLEMENTED.md` for details
2. Review `/app/SECURITY_AUDIT_REPORT.md` for technical info
3. Check server logs (via deployment dashboard)
4. Contact Emergent support if needed

---

## ✅ Final Checklist Summary

Before clicking "Deploy":

✅ All API keys rotated  
✅ New keys in deployment dashboard  
✅ .gitignore verified  
✅ Rate limiting tested  
✅ Input sanitization tested  
✅ Security headers verified  
✅ All forms tested  
✅ Critical flows tested  

After deployment:

✅ Security score A or A+  
✅ SSL score A or A+  
✅ Production tests passed  
✅ No secrets exposed  

**If all above are checked, you're ready for production! 🚀**

---

**Last Updated:** December 2024  
**Security Grade Required:** A or A+  
**Status:** Production Ready (pending key rotation)
