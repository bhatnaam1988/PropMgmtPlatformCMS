# Stripe Publishable Key - Usage & Update Guide

## Where the Publishable Key is Used

### Location: Checkout Page (Client-Side)

**File:** `/app/app/checkout/page.js`

**Usage:**
```javascript
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe on the client-side
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

**Purpose:**
- Loads Stripe.js library in the browser
- Initializes Stripe Elements (card input fields)
- Handles client-side payment processing
- Creates payment methods securely

---

## Why "NEXT_PUBLIC_" Prefix?

### Important Distinction:

**Client-Side Variables (NEXT_PUBLIC_):**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  ← Exposed to browser ✅
```
- Included in JavaScript bundle sent to browser
- Visible in browser DevTools (this is OK!)
- Safe to expose (designed to be public)
- Used for client-side Stripe initialization

**Server-Side Variables (No prefix):**
```
STRIPE_SECRET_KEY                   ← Server-only 🔒
STRIPE_WEBHOOK_SECRET               ← Server-only 🔒
```
- Never sent to browser
- Only accessible on server
- Must be kept secret

---

## Current Configuration

### In `.env` file:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QgR12HbvQ7QfHylP2xJVuX4usoBn29k5Q8V0crpCyHg2LoWUYa3cPJmXBLCuiU219MnsLRwEjqievnCzwoeWWMW00KCDvsQ1U
```

**Key Details:**
- Prefix: `pk_test_` = Test mode publishable key ✅
- For production: Will change to `pk_live_` prefix
- Mode: Currently in TEST mode (correct for UAT)

---

## How to Update in Deployed Code

### Method 1: Update Environment Variable in Deployment (Recommended)

#### Step 1: Get Your Stripe Publishable Key

1. **Login to Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/

2. **Ensure Test Mode:**
   - Toggle in top-right should show "Test mode" ✅

3. **Get Publishable Key:**
   - Click **"Developers"** in left sidebar
   - Click **"API keys"**
   - Find: **"Publishable key"**
   - Starts with: `pk_test_...`
   - Click to copy

#### Step 2: Update in Emergent Deployment

1. **Access Deployment Settings:**
   - Go to your Emergent dashboard
   - Find your deployed application
   - Navigate to **"Environment Variables"** or **"Settings"**

2. **Add/Update Variable:**
   ```
   Variable Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   Value: pk_test_51QgR12HbvQ7QfHylP2xJVuX4usoBn29k5Q8V0crpCyHg2LoWUYa3cPJmXBLCuiU219MnsLRwEjqievnCzwoeWWMW00KCDvsQ1U
   ```

3. **Save and Redeploy:**
   - Click Save
   - Trigger redeployment
   - New key will be used

#### Step 3: Verify Update

1. **Open checkout page** in browser
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Type:**
   ```javascript
   console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
   ```
5. **Should show:** Your new publishable key

---

### Method 2: Update .env File (If You Have Direct Access)

**Update `/app/.env`:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_NEW_KEY_HERE
```

**Then redeploy:**
```bash
# Trigger deployment
git push origin main
# Or use Emergent CLI/dashboard
```

---

## Test Mode vs Live Mode Keys

### Test Mode (Current - For UAT):
```
Publishable Key: pk_test_51QgR12HbvQ7QfHyl...
Secret Key:      sk_test_51QgR12HbvQ7QfHyl...
```

**Characteristics:**
- ✅ No real charges
- ✅ Test cards work (4242 4242 4242 4242)
- ✅ Perfect for UAT/testing
- ❌ Real cards won't work

### Live Mode (For Production - Future):
```
Publishable Key: pk_live_xxxxxxxxxxxxx
Secret Key:      sk_live_xxxxxxxxxxxxx
```

**Characteristics:**
- ✅ Real charges processed
- ✅ Real cards work
- ❌ Test cards won't work
- 🔒 Requires additional Stripe verification

---

## How the Key Flows Through the App

### Build Time:
```
1. Next.js reads .env file
2. Finds NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
3. Replaces process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY with actual value
4. Bundles JavaScript for browser
```

### Runtime (Browser):
```
1. User visits checkout page
2. JavaScript loads in browser
3. stripePromise = loadStripe("pk_test_...")
4. Stripe.js library initializes with your key
5. Card input fields appear
6. User can enter payment details
```

### Payment Flow:
```
1. User enters card details (in Stripe-hosted iframe)
2. Stripe creates payment method (client-side)
3. Payment method ID sent to your server
4. Server uses SECRET key to create payment intent
5. Payment processed
```

---

## Security Notes

### ✅ Safe to Expose (Publishable Key):
- Designed to be public
- Included in frontend JavaScript
- Visible in browser DevTools
- Only allows creating payment methods
- Cannot access funds or sensitive data

### 🔒 Must Keep Secret (Secret Key):
- NEVER put in frontend code
- NEVER expose to browser
- Only use on server-side
- Can process payments and access data

### 🚨 Never Do This:
```javascript
// ❌ WRONG - Never use secret key in frontend!
const stripe = require('stripe')('sk_test_...');
```

```javascript
// ✅ CORRECT - Use publishable key in frontend
const stripePromise = loadStripe('pk_test_...');
```

---

## Troubleshooting

### Issue 1: Checkout Page Shows "Stripe not initialized"

**Cause:** Publishable key not set or incorrect

**Solution:**
1. Check environment variable exists:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
2. Verify key starts with `pk_test_` or `pk_live_`
3. Redeploy application
4. Clear browser cache

### Issue 2: Card Input Fields Not Showing

**Cause:** Invalid publishable key

**Solution:**
1. Verify key is copied correctly (no extra spaces)
2. Check Stripe Dashboard → Developers → API Keys
3. Use the correct key for test/live mode
4. Ensure key is for the correct Stripe account

### Issue 3: "No such token" Error

**Cause:** Using test key with live mode or vice versa

**Solution:**
1. Match frontend and backend modes
2. Test frontend: `pk_test_...`
3. Test backend: `sk_test_...`
4. Both must be from same mode

### Issue 4: Changes Not Reflecting After Update

**Cause:** Browser cache or build cache

**Solution:**
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
2. Clear browser cache
3. Open in incognito window
4. Rebuild application: `yarn build`
5. Restart server

---

## Verification Checklist

After updating the publishable key:

- [ ] Key starts with `pk_test_` (for test mode)
- [ ] Key is in NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY variable
- [ ] Application redeployed
- [ ] Checkout page loads without errors
- [ ] Card input fields appear
- [ ] Console shows no Stripe errors
- [ ] Test payment works with 4242 4242 4242 4242
- [ ] Payment intent created successfully

---

## Current vs Production Configuration

### UAT/Testing (Current):
```env
# Frontend (Public)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QgR12HbvQ7QfHyl...

# Backend (Secret)
STRIPE_SECRET_KEY=sk_test_51QgR12HbvQ7QfHyl...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production (Future):
```env
# Frontend (Public)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# Backend (Secret)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx (new webhook for live mode)
```

**Important:** When switching to live mode, update ALL THREE keys!

---

## Testing Your Update

### Quick Test:

1. **Go to checkout page:**
   ```
   https://sanity-nextjs.preview.emergentagent.com/checkout?propertyId=84656&checkIn=2026-04-07&checkOut=2026-04-09&adults=2&children=0&infants=0
   ```

2. **Check Stripe Elements Load:**
   - You should see card input fields
   - Fields should be styled correctly
   - No console errors

3. **Test Payment:**
   - Fill guest details
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - Click Pay
   - Should process successfully

---

## Summary

**Where Used:** `/app/app/checkout/page.js` (line 16)

**Purpose:** Initialize Stripe.js in browser for payment processing

**Current Key:** `pk_test_51QgR12HbvQ7QfHylP2xJVuX4usoBn29k5Q8V0crpCyHg2LoWUYa3cPJmXBLCuiU219MnsLRwEjqievnCzwoeWWMW00KCDvsQ1U`

**To Update:**
1. Get key from Stripe Dashboard → Developers → API Keys
2. Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in deployment environment
3. Redeploy application
4. Test checkout flow

**Safe to Expose:** Yes! Publishable key is designed to be public.

**Verify Working:** Card input fields should appear on checkout page.
