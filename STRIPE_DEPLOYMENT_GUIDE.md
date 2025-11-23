# Stripe Deployment Guide - Environment Variables

## 🚨 Critical Issue: Test Keys in Production

### Problem Identified
Your production deployment was using **test Stripe keys** even though live keys were configured in the Emergent dashboard.

### Root Cause
Next.js bakes `NEXT_PUBLIC_*` environment variables into the JavaScript bundle **at build time**. The `.env` file contained hardcoded test keys that were being compiled into the production bundle, overriding the live keys from the Emergent dashboard.

---

## ✅ Solution Implemented

### Changes Made
1. Updated `/app/.env` with clear comments indicating test keys are for **local development only**
2. Documented that production keys must be set via Emergent Deployment Dashboard

---

## 🔑 Required Stripe Environment Variables

You need to configure these in the **Emergent Deployment Dashboard**:

### 1. **STRIPE_SECRET_KEY** (Backend - Server Side)
- **Test:** `sk_test_51QgR12HbvQ7QfHyl...`
- **Live:** `rk_live_51QgR12HbvQ7QfHy...` (your restricted key) OR `sk_live_...` (full key)
- Used by: Backend API routes (`/app/lib/stripe-client.js`)

### 2. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** (Frontend - Client Side)
- **Test:** `pk_test_51QgR12HbvQ7QfHyl...`
- **Live:** `pk_live_51QgR12HbvQ7QfHy...`
- Used by: Frontend checkout page (`/app/app/checkout/page.js`)
- ⚠️ **CRITICAL:** This is baked into the bundle at build time!

### 3. **STRIPE_WEBHOOK_SECRET** (Backend - Webhook Validation)
- **Test:** `whsec_eWG9mHTjqFi8VTfPrheLrOGPA9zKgusW`
- **Live:** `whsec_...` (from your live Stripe webhook configuration)
- Used by: Webhook handler (`/app/app/api/stripe/webhook/route.js`)

### 4. **STRIPE_CURRENCY** (Optional, defaults to CHF)
- Value: `chf`

### 5. **STRIPE_TAX_MODE** (Optional, defaults to manual)
- Value: `manual`

---

## 📝 Deployment Steps for Production

### Step 1: Configure Live Keys in Emergent Dashboard
1. Go to your deployment: **rental-insights-4**
2. Navigate to: **Deployments → Environment Variables**
3. Add/Update the following variables with your **LIVE** keys:

```bash
STRIPE_SECRET_KEY=rk_live_51QgR12HbvQ7QfHy...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QgR12HbvQ7QfHy...
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_LIVE_WEBHOOK_SECRET]
STRIPE_CURRENCY=chf
STRIPE_TAX_MODE=manual
```

### Step 2: Configure Live Stripe Webhook
1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **Add Endpoint**
3. Set endpoint URL: `https://rental-insights-4.emergent.host/api/stripe/webhook`
4. Select events to listen for:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add this as `STRIPE_WEBHOOK_SECRET` in Emergent dashboard

### Step 3: Rebuild and Redeploy
1. Click **Re-Deploy** in Emergent dashboard
2. Wait for build to complete (~5-7 minutes)
3. Build process will use the live keys from environment variables

### Step 4: Verify Deployment
1. Open: `https://rental-insights-4.emergent.host/checkout?[test-booking-params]`
2. Open browser DevTools → Network tab
3. Look for Stripe API calls - verify they use `pk_live_...` (not `pk_test_...`)
4. Test a payment with a test card in live mode (if Stripe allows)

---

## 🧪 Testing in Different Environments

### Local Development (Test Mode)
- Uses keys from `/app/.env` file
- Test keys: `pk_test_...` and `sk_test_...`
- Use Stripe test cards: `4242 4242 4242 4242`

### Production Deployment (Live Mode)
- Uses keys from Emergent Dashboard environment variables
- Live keys: `pk_live_...` and `rk_live_...`
- Real payment processing

---

## ⚠️ Important Notes

### Next.js Environment Variable Behavior
- **`NEXT_PUBLIC_*` variables:** Exposed to browser, baked into bundle at build time
- **Regular variables:** Only available server-side, can be changed without rebuild
- **Implication:** Changing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` requires a full rebuild

### Stripe Key Types
- **Publishable Key** (`pk_*`): Safe to expose in frontend code
- **Secret Key** (`sk_*`): Must never be exposed, server-side only
- **Restricted Key** (`rk_*`): Limited permissions, recommended for production

### Common Mistakes to Avoid
❌ Hardcoding production keys in `.env` file  
❌ Committing secret keys to Git  
❌ Forgetting to rebuild after changing `NEXT_PUBLIC_*` variables  
❌ Using test webhook secret with live keys  

---

## 🔍 Debugging Checklist

If you still see test keys in production:

1. **Verify environment variables in Emergent dashboard**
   - Check all Stripe variables are set correctly
   - Ensure no typos in variable names

2. **Check browser network tab**
   - Look for `key` parameter in Stripe API requests
   - Should start with `pk_live_` in production

3. **Verify webhook configuration**
   - Stripe Dashboard → Webhooks → Check endpoint URL
   - Verify events are being received

4. **Check deployment logs**
   - Look for environment variable loading messages
   - Verify build completed successfully

5. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or use incognito/private browsing mode

---

## 📚 Additional Resources

- [Stripe API Keys](https://stripe.com/docs/keys)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Stripe Testing](https://stripe.com/docs/testing)

---

## 🆘 Need Help?

If you continue to experience issues:
1. Check deployment logs in Emergent dashboard
2. Verify all environment variables are correctly set
3. Ensure a full rebuild was triggered after configuration changes
4. Test with browser DevTools to inspect actual keys being used

**Current Status:** `.env` file updated with documentation. Ready for production deployment with live keys from Emergent dashboard.
