# 🚀 Emergent Dashboard Environment Variables Configuration Guide

## ✅ Local Files Updated Successfully

Your local `.env` and `.env.local` files have been updated with your **SANDBOX/TEST keys** for local development.

**Verification Result:**
```json
{
  "accountId": "51QgR1DHJG",
  "keysMatch": true,
  "accountsMatch": true,
  "ready": true
}
```

---

## 📋 EMERGENT DASHBOARD CONFIGURATION

### Navigation:
1. Go to: **Emergent Dashboard**
2. Select: **Deployments**
3. Choose: **rental-insights-4** (your deployment)
4. Click: **Environment Variables** tab

---

## 🔑 PRODUCTION ENVIRONMENT VARIABLES TO SET

### For **LIVE/PRODUCTION** Deployment:

Add or update these **5 environment variables**:

| Variable Name | Value to Enter |
|---------------|----------------|
| `STRIPE_SECRET_KEY` | `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` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_51QgR12HbvQ7QfHylJtgAAS7UFj7bbZZZVsqe5ryUQqgCLy4b3LuitW7KM5tSc5EqctJOKRBhygCPWdpBroooGmsl00JjEYDyuB` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_0c7eWCvSoiP7lnAAUHcjcN6fZpcEMen8` |
| `STRIPE_CURRENCY` | `chf` |
| `STRIPE_TAX_MODE` | `manual` |

---

## 📝 DETAILED STEP-BY-STEP INSTRUCTIONS

### Step 1: Add/Update STRIPE_SECRET_KEY

```
Variable Name: STRIPE_SECRET_KEY
Value: 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
```

**Notes:**
- This is a **restricted key** (starts with `rk_live_`)
- Used by backend to create Payment Intents
- Never exposed to browser

---

### Step 2: Add/Update NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

```
Variable Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51QgR12HbvQ7QfHylJtgAAS7UFj7bbZZZVsqe5ryUQqgCLy4b3LuitW7KM5tSc5EqctJOKRBhygCPWdpBroooGmsl00JjEYDyuB
```

**Notes:**
- This is your **live publishable key** (starts with `pk_live_`)
- Used by frontend to initialize Stripe.js
- **CRITICAL:** Must start with `NEXT_PUBLIC_` prefix
- Will be baked into JavaScript bundle at build time

---

### Step 3: Add/Update STRIPE_WEBHOOK_SECRET

```
Variable Name: STRIPE_WEBHOOK_SECRET
Value: whsec_0c7eWCvSoiP7lnAAUHcjcN6fZpcEMen8
```

**Notes:**
- Used to verify webhook signatures
- Get this from: Stripe Dashboard → Developers → Webhooks
- This should match your **live webhook endpoint**

---

### Step 4: Add/Update STRIPE_CURRENCY

```
Variable Name: STRIPE_CURRENCY
Value: chf
```

**Notes:**
- Your default currency (Swiss Franc)
- Used for all payment intents

---

### Step 5: Add/Update STRIPE_TAX_MODE

```
Variable Name: STRIPE_TAX_MODE
Value: manual
```

**Notes:**
- How taxes are calculated
- `manual` = You calculate taxes in code
- Alternative: `stripe_tax` = Stripe calculates taxes

---

## 🎯 AFTER ADDING VARIABLES

### Step 6: Re-Deploy

**CRITICAL:** You MUST re-deploy for changes to take effect!

1. Click the **"Re-Deploy"** button in Emergent Dashboard
2. Wait for build to complete (~5-7 minutes)
3. The new build will include your live Stripe keys

**Why Re-Deploy is Required:**
- `NEXT_PUBLIC_*` variables are compiled into the JavaScript bundle
- Simply updating environment variables is NOT enough
- A full rebuild is required to bake new keys into the frontend code

---

### Step 7: Verify Deployment

After deployment completes, verify the keys are correct:

**Option 1: Use Verification Endpoint**
```
Visit: https://rental-insights-4.emergent.host/api/stripe/verify-keys
```

**Expected Result:**
```json
{
  "keys": {
    "secret": {
      "masked": "rk_live_51Qg...Decs",
      "type": "RESTRICTED_LIVE",
      "accountId": "51QgR12HbvQ"
    },
    "publishable": {
      "masked": "pk_live_51Qg...DyuB",
      "type": "PUBLISHABLE_LIVE",
      "accountId": "51QgR12HbvQ"
    }
  },
  "validation": {
    "keysMatch": true,
    "accountsMatch": true,
    "ready": true,
    "warnings": []
  }
}
```

**Option 2: Check Browser Network Tab**
1. Open: `https://rental-insights-4.emergent.host/checkout?propertyId=84b56&checkIn=2026-04-17&checkOut=2026-04-19&adults=2&children=0&infants=0`
2. Open DevTools → Network tab
3. Look for requests to `api.stripe.com`
4. Check the `key` parameter - should be `pk_live_51QgR12HbvQ7QfHyl...`

---

## 🔄 OPTIONAL: TESTING WITH SANDBOX KEYS FIRST

If you want to test the deployment with **SANDBOX keys** before going live:

Use these values in Emergent Dashboard:

| Variable Name | Sandbox Value |
|---------------|---------------|
| `STRIPE_SECRET_KEY` | `sk_test_51QgR1DHJGligTDgHJSZ6Dep5XYgq6X4ek2c3IDUekLqiq4BaEIIun2sUUtV4Jp3SDh18Af7KjQXb5HC9AFfX32ob00Fxx5QoBp` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51QgR1DHJGligTDgHpbD9wbpLcm11lhtic3PYNgJvsli5HQWwTIWXbH3WjSd4r8LIFncqV6RcfRwElpVT6TMjWyI500T5BFbqke` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_UfERJYUPXsoHnxDxTdlcNr3usJBDPI1i` |
| `STRIPE_CURRENCY` | `chf` |
| `STRIPE_TAX_MODE` | `manual` |

**Testing with Sandbox:**
- Use Stripe test cards: `4242 4242 4242 4242`
- CVC: Any 3 digits
- Expiry: Any future date
- No real money is charged

---

## 🎯 STRIPE WEBHOOK CONFIGURATION

### For Production (Live Keys):

1. Go to: **Stripe Dashboard → Developers → Webhooks**
2. Click: **Add endpoint**
3. Enter URL: `https://rental-insights-4.emergent.host/api/stripe/webhook`
4. Select events to listen for:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click: **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. This should match the value you entered in Step 3 above

---

## ⚠️ IMPORTANT NOTES

### 1. Key Matching Rules
- Secret key and publishable key MUST be from the same Stripe account
- Secret key and publishable key MUST be from the same mode (both test OR both live)
- Webhook secret must match the webhook endpoint configuration in Stripe

### 2. Security Best Practices
- ✅ Never commit live keys to Git
- ✅ Use test keys for local development
- ✅ Use live keys only in production environment variables
- ✅ Rotate keys if compromised

### 3. Troubleshooting
If you still get "client_secret does not match" error after deployment:
1. Verify keys in Emergent Dashboard are exactly as shown above
2. Ensure you clicked "Re-Deploy" (not just saved variables)
3. Check verification endpoint shows LIVE keys (not TEST)
4. Hard refresh browser (Ctrl+Shift+R) to clear cached JavaScript

---

## 📊 QUICK REFERENCE: CURRENT VS PRODUCTION

| Component | Current (Local) | Production (Deploy) |
|-----------|----------------|---------------------|
| **Mode** | Sandbox/Test | Live |
| **Secret Key** | `sk_test_51QgR1DHJG...` | `rk_live_51QgR12HbvQ...` |
| **Publishable Key** | `pk_test_51QgR1DHJG...` | `pk_live_51QgR12HbvQ...` |
| **Webhook Secret** | `whsec_UfERJYUP...` | `whsec_0c7eWCvS...` |
| **Account** | 51QgR1DHJG | 51QgR12HbvQ |

---

## ✅ CHECKLIST

Before clicking Re-Deploy, ensure:

- [ ] All 5 environment variables added to Emergent Dashboard
- [ ] Values copied exactly (no extra spaces or line breaks)
- [ ] Variable names are spelled correctly
- [ ] `NEXT_PUBLIC_` prefix is included for publishable key
- [ ] Webhook is configured in Stripe Dashboard
- [ ] Webhook secret matches the one in environment variables

After Re-Deploy:
- [ ] Deployment completes successfully
- [ ] Verification endpoint shows LIVE keys
- [ ] Browser network tab shows correct publishable key
- [ ] Test payment with real card (small amount)
- [ ] Webhook receives payment events

---

**Ready to Deploy!** 🚀

Once you've added all environment variables in the Emergent Dashboard, click **Re-Deploy** and your production site will use the correct live Stripe keys!
