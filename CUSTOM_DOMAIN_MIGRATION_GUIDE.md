# Custom Domain Migration Guide
## Swiss Alpine Journey - Domain Update from Emergent Host to Custom Domain

**Old Domain:** `https://rental-insights-4.emergent.host`  
**New Custom Domain:** `https://www.swissalpinejourney.ch`  
**Date:** December 16, 2025

---

## 🚨 CRITICAL: YES, YOU MUST UPDATE THE VARIABLES

**Answer:** **YES**, you **MUST** update the `NEXT_PUBLIC_BASE_URL` variable in the Emergent Dashboard from `https://rental-insights-4.emergent.host` to `https://www.swissalpinejourney.ch`

**Why?** This variable is used throughout your application for:
- SEO metadata (OpenGraph, Twitter cards)
- Sitemap generation
- Robot.txt directives
- Internal API calls
- CORS security headers
- Stripe webhook callbacks
- Email links and redirects

**What happens if you don't update?**
- ❌ SEO: Social media previews will show wrong URL
- ❌ Security: CORS headers will block legitimate requests
- ❌ Payments: Stripe webhooks may fail to reach your server
- ❌ Emails: Links in emails will point to old domain
- ❌ Analytics: Tracking will reference wrong domain

---

## 📋 COMPLETE VARIABLE UPDATE CHECKLIST

### 1️⃣ **EMERGENT DASHBOARD** (Production Environment)

**Variables to UPDATE:**

| Variable Name | Current Value | New Value | Priority | Impact |
|--------------|---------------|-----------|----------|--------|
| `NEXT_PUBLIC_BASE_URL` | `https://rental-insights-4.emergent.host` | `https://www.swissalpinejourney.ch` | 🔴 CRITICAL | SEO, APIs, Internal routing |
| `CORS_ORIGINS` | `https://rental-insights-4.emergent.host` | `https://www.swissalpinejourney.ch` | 🔴 CRITICAL | Security, API access |

**Variables to KEEP (No Changes Needed):**

| Variable Name | Current Value | Notes |
|--------------|---------------|-------|
| `MONGO_URL` | MongoDB Atlas connection string | Database access - DO NOT CHANGE |
| `MONGO_DB_NAME` | `swissalpine` | Database name - DO NOT CHANGE |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Payment processing - Keep production key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Payment processing - Keep production key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook verification - Update only if you create new webhook endpoint |
| `STRIPE_CURRENCY` | `chf` | Swiss Francs - No change needed |
| `STRIPE_TAX_MODE` | `manual` | Tax calculation - No change needed |
| `MANUAL_VAT_RATE` | `7.7` | Swiss VAT rate - No change needed |
| `UPLISTING_API_KEY` | Your API key | Property management - No change needed |
| `UPLISTING_API_URL` | `https://connect.uplisting.io` | Uplisting endpoint - No change needed |
| `UPLISTING_CLIENT_ID` | `f4fd1410-9636-013e-aeff-2a9672a658e7` | Your account ID - No change needed |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Your site key | Security - May need domain update (see below) |
| `RECAPTCHA_SECRET_KEY` | Your secret key | Security - May need domain update (see below) |
| `RESEND_API_KEY` | Your API key | Email service - No change needed |
| `ADMIN_EMAIL` | `journey@swissalpinejourney.ch` | Admin notifications - No change needed |
| `EMAIL_FROM` | `journey@swissalpinejourney.ch` | Email sender - No change needed |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `vrhdu6hl` | CMS - No change needed |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | CMS dataset - No change needed |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` | CMS version - No change needed |
| `SANITY_API_TOKEN` | Your token | CMS access - No change needed |

---

### 2️⃣ **LOCAL DEVELOPMENT** (Optional - if you want to test locally with custom domain simulation)

**File:** `/app/.env`

```bash
# Application URLs - Update these
NEXT_PUBLIC_BASE_URL=https://www.swissalpinejourney.ch
CORS_ORIGINS=https://www.swissalpinejourney.ch

# All other variables remain the same
```

**File:** `/app/.env.local` (Local development - usually no changes needed)

This file is for local development only. You can keep `http://localhost:3000` for `NEXT_PUBLIC_SITE_URL`.

---

## 🔐 THIRD-PARTY SERVICE UPDATES REQUIRED

### **1. Google ReCAPTCHA v3** 🔴 CRITICAL

**Status:** ⚠️ **ACTION REQUIRED**

Your current reCAPTCHA keys are configured for domain: `rental-fix.preview.emergentagent.com`

**You MUST add the new domain to your reCAPTCHA site configuration:**

**Steps:**
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your reCAPTCHA v3 site
3. Click "Settings" ⚙️
4. Under "Domains", **ADD** the following domains:
   - `www.swissalpinejourney.ch`
   - `swissalpinejourney.ch` (without www)
5. **Keep** the old domain temporarily for testing: `rental-fix.preview.emergentagent.com`
6. Click "Save"

**Why?** reCAPTCHA validates the domain where the form is submitted. If the domain is not whitelisted, all form submissions will fail.

**Impact if not updated:** 
- ❌ All forms will be blocked (Contact, Booking, Cleaning Services, Rental Services, Jobs, Newsletter)
- ❌ Users will see "ReCAPTCHA verification failed" errors

---

### **2. Stripe Webhooks** 🟡 RECOMMENDED

**Status:** ⚠️ **UPDATE RECOMMENDED**

Stripe sends payment notifications to a webhook endpoint on your server. You need to update the webhook URL.

**Current webhook URL:** `https://rental-insights-4.emergent.host/api/stripe/webhook`  
**New webhook URL:** `https://www.swissalpinejourney.ch/api/stripe/webhook`

**Steps:**
1. Go to [Stripe Dashboard - Webhooks](https://dashboard.stripe.com/webhooks)
2. Find your existing webhook endpoint
3. **Option A:** Edit the existing endpoint and change URL to `https://www.swissalpinejourney.ch/api/stripe/webhook`
4. **Option B:** Create a new endpoint (recommended for zero downtime):
   - Click "+ Add endpoint"
   - Endpoint URL: `https://www.swissalpinejourney.ch/api/stripe/webhook`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.succeeded`
     - `charge.failed`
   - Click "Add endpoint"
   - Copy the new **Webhook signing secret** (starts with `whsec_...`)
5. Update `STRIPE_WEBHOOK_SECRET` in Emergent Dashboard with the new secret (if you created a new endpoint)
6. After confirming the new webhook works, you can disable/delete the old one

**Impact if not updated:**
- ⚠️ Booking confirmations may be delayed or not processed
- ⚠️ Payment status updates won't trigger Uplisting reservations
- ⚠️ Admin email alerts for failed bookings may not work

---

### **3. Resend Email Domain** 🟢 ALREADY DONE

**Status:** ✅ **NO ACTION NEEDED**

Your email configuration uses `journey@swissalpinejourney.ch`, which means the domain `swissalpinejourney.ch` should already be verified in Resend.

**Verify in Resend Dashboard:**
1. Go to [Resend Dashboard - Domains](https://resend.com/domains)
2. Confirm `swissalpinejourney.ch` is listed and verified ✅
3. If not verified, follow Resend's DNS setup instructions

---

### **4. Sanity CMS** 🟢 NO CHANGES NEEDED

**Status:** ✅ **NO ACTION NEEDED**

Sanity CMS is domain-agnostic. Your content is stored in Sanity Cloud and will work with any domain.

---

### **5. Uplisting API** 🟢 NO CHANGES NEEDED

**Status:** ✅ **NO ACTION NEEDED**

Uplisting API authentication is key-based, not domain-based. No changes required.

---

## 📝 CODE FILES AFFECTED (Automatic - No Manual Changes Needed)

These files use the `NEXT_PUBLIC_BASE_URL` environment variable and will automatically use the new domain once you update it in the Emergent Dashboard:

| File Path | Usage | Auto-Updates? |
|-----------|-------|---------------|
| `/app/sitemap.js` | Generates XML sitemap with URLs | ✅ Yes |
| `/app/robots.js` | Generates robots.txt with sitemap URL | ✅ Yes |
| `/app/property/[id]/layout.js` | Property page metadata (OpenGraph) | ✅ Yes |
| `/app/api/bookings/route.js` | Booking confirmation links | ✅ Yes |
| `/app/api/stripe/create-payment-intent/route.js` | Stripe payment metadata | ✅ Yes |
| `/lib/metadata.js` | Global site metadata | ✅ Yes |
| `/lib/schemas.js` | Schema.org structured data | ✅ Yes |
| `/next.config.js` | CORS headers configuration | ✅ Yes |

**No manual code changes required!** All these files read from environment variables.

---

## 🚀 DEPLOYMENT STEPS (Step-by-Step)

### **Phase 1: Pre-Deployment Preparation** ✅

1. ✅ **Custom domain connected** (Already done by you)
2. ⬜ **Update Google ReCAPTCHA** - Add new domain (See instructions above)
3. ⬜ **Verify Resend Domain** - Confirm swissalpinejourney.ch is verified
4. ⬜ **Prepare Stripe Webhook** - Note down webhook signing secret if creating new

---

### **Phase 2: Update Emergent Dashboard** 🔴 CRITICAL

1. Go to your project in Emergent Dashboard
2. Navigate to "Environment Variables" or "Settings"
3. **Update these variables:**
   - `NEXT_PUBLIC_BASE_URL` → `https://www.swissalpinejourney.ch`
   - `CORS_ORIGINS` → `https://www.swissalpinejourney.ch`
4. Click "Save" or "Update"
5. **Redeploy your application** for changes to take effect

---

### **Phase 3: Update Third-Party Services** ⚠️

1. ⬜ **Google ReCAPTCHA** - Add domain `www.swissalpinejourney.ch`
2. ⬜ **Stripe Webhooks** - Update webhook URL or create new endpoint
3. ⬜ **Update `STRIPE_WEBHOOK_SECRET`** in Emergent Dashboard (if new webhook created)

---

### **Phase 4: Testing** 🧪

**Test the following on your new domain:**

1. ⬜ **Homepage loads** - Visit `https://www.swissalpinejourney.ch`
2. ⬜ **Property pages work** - Navigate to a property detail page
3. ⬜ **Contact form submission** - Test reCAPTCHA integration
4. ⬜ **Booking flow** - Test reservation and payment
5. ⬜ **Check email notifications** - Verify emails are sent correctly
6. ⬜ **View page source** - Verify OpenGraph URLs show new domain
7. ⬜ **Check sitemap** - Visit `https://www.swissalpinejourney.ch/sitemap.xml`
8. ⬜ **Check robots.txt** - Visit `https://www.swissalpinejourney.ch/robots.txt`

---

### **Phase 5: Post-Deployment** 🎉

1. ⬜ **Monitor Stripe Dashboard** - Confirm webhooks are received
2. ⬜ **Test complete booking** - End-to-end test with real payment
3. ⬜ **Google Search Console** - Add new domain property
4. ⬜ **Update Google Analytics** - Update domain if using GA
5. ⬜ **Update social media links** - Facebook, Instagram, etc.
6. ⬜ **Remove old domain** - After 1-2 weeks, remove old domain from reCAPTCHA and Stripe

---

## ❓ FAQ

### Q1: Can I keep both domains working (old and new)?

**A:** Yes, temporarily. You can:
1. Keep both domains in `CORS_ORIGINS`: `https://www.swissalpinejourney.ch,https://rental-insights-4.emergent.host`
2. Keep both domains in Google reCAPTCHA
3. Keep both webhook endpoints in Stripe

But for production, you should eventually redirect the old domain to the new one and use only the new domain.

---

### Q2: Will my bookings and data be affected?

**A:** No, your MongoDB database and Sanity CMS content are completely independent of the domain. All existing data remains intact.

---

### Q3: What if I forget to update reCAPTCHA domains?

**A:** All forms will fail with "Verification failed" error. Users won't be able to submit Contact, Booking, or any other forms protected by reCAPTCHA.

---

### Q4: Do I need to update Sanity Studio?

**A:** No, Sanity Studio is domain-independent. You can access it from any domain as long as you have the credentials.

---

### Q5: Will SEO be affected?

**A:** Yes, positively! Using a custom domain improves SEO. Make sure to:
1. Submit new sitemap to Google Search Console
2. Set up 301 redirects from old domain to new (if possible)
3. Update all social media links

---

## 📞 SUPPORT

If you encounter any issues during migration:

1. **Stripe Issues:** Contact Stripe Support via Dashboard
2. **reCAPTCHA Issues:** Check [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/verify)
3. **Resend Email Issues:** Contact Resend Support
4. **Emergent Deployment Issues:** Contact Emergent Support

---

## ✅ FINAL CHECKLIST

**Before Going Live:**
- [ ] Updated `NEXT_PUBLIC_BASE_URL` in Emergent Dashboard
- [ ] Updated `CORS_ORIGINS` in Emergent Dashboard
- [ ] Redeployed application after variable changes
- [ ] Added `www.swissalpinejourney.ch` to Google reCAPTCHA
- [ ] Updated Stripe webhook URL
- [ ] Updated `STRIPE_WEBHOOK_SECRET` if new webhook created
- [ ] Verified Resend domain is configured
- [ ] Tested all forms (Contact, Booking, etc.)
- [ ] Tested complete booking flow with payment
- [ ] Verified emails are being sent correctly
- [ ] Checked sitemap.xml shows correct URLs
- [ ] Checked robots.txt shows correct sitemap URL

**After successful deployment:**
- [ ] Monitor Stripe webhook deliveries for 24 hours
- [ ] Monitor email deliveries
- [ ] Test booking flow from mobile device
- [ ] Submit new sitemap to Google Search Console
- [ ] Update social media links and profiles

---

**Status:** 📋 **READY FOR IMPLEMENTATION**  
**Estimated Time:** 30-45 minutes  
**Risk Level:** Low (if checklist followed)  
**Rollback Plan:** Revert environment variables in Dashboard and redeploy

---

*Document created: December 16, 2025*  
*Application: Swiss Alpine Journey*  
*Contact: journey@swissalpinejourney.ch*
