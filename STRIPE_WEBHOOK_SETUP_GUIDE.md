# Stripe Webhook Setup Guide - Test Mode

Complete guide to configure Stripe webhooks for your deployed application.

---

## Overview

**Your Application URL:** `https://sanity-nextjs.preview.emergentagent.com`
**Webhook Endpoint:** `https://sanity-nextjs.preview.emergentagent.com/api/stripe/webhook`
**Mode:** Test Mode (for UAT testing)

---

## Step-by-Step Setup

### Step 1: Access Stripe Dashboard

1. **Login to Stripe:**
   - Go to: https://dashboard.stripe.com/
   - Login with your Stripe credentials

2. **Ensure Test Mode is ON:**
   - Look at the top-right corner
   - Toggle should show **"Test mode"** (not Live mode)
   - The toggle should be in the "off" position (showing test mode is active)

---

### Step 2: Navigate to Webhooks Section

1. **From Dashboard:**
   - Click on **"Developers"** in the left sidebar
   - Click on **"Webhooks"**

2. **Or Direct Link:**
   - Visit: https://dashboard.stripe.com/test/webhooks

---

### Step 3: Create New Webhook Endpoint

1. **Click "Add endpoint" button** (top-right corner)

2. **Enter Endpoint URL:**
   ```
   https://sanity-nextjs.preview.emergentagent.com/api/stripe/webhook
   ```
   
   **Important:** 
   - Make sure to use `https://` (not `http://`)
   - Include `/api/stripe/webhook` at the end
   - No trailing slash

3. **Enter Description (optional):**
   ```
   Swiss Alpine Journey - Production Webhook (Test Mode)
   ```

---

### Step 4: Select Events to Listen

You need to select which Stripe events your webhook should receive.

#### **Recommended Events for Booking System:**

Select the following events:

**Payment Intent Events:**
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.canceled`
- ✅ `payment_intent.created`

**Optional (for advanced features):**
- `charge.succeeded`
- `charge.failed`
- `charge.refunded`
- `customer.created`
- `customer.updated`

#### **How to Select Events:**

**Option A: Select Specific Events (Recommended)**
1. Click on **"Select events"** button
2. Search for and check each event listed above
3. Click **"Add events"**

**Option B: Listen to All Events (Not Recommended)**
- Select **"Listen to all events"**
- Note: This sends ALL Stripe events to your webhook (can be noisy)

---

### Step 5: Complete Setup

1. **Click "Add endpoint"** button at the bottom

2. **Webhook Created!** You should see:
   - Your webhook URL
   - Status: **"Enabled"**
   - Test mode indicator

---

### Step 6: Get Webhook Signing Secret

This is critical for security - it verifies that webhook calls are actually from Stripe.

1. **On the webhook details page**, you'll see:
   - **Signing secret:** `whsec_...` (starts with `whsec_`)

2. **Click "Reveal" or the eye icon** to see the full secret

3. **Copy the webhook signing secret**
   - It looks like: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Keep this secret! Don't share it publicly

---

### Step 7: Update Your Application Environment

You need to add this webhook secret to your deployed application.

#### **Option A: Update via Emergent Deployment Settings**

If you're using Emergent's native deployment:

1. Go to your Emergent dashboard
2. Find your deployed application
3. Navigate to **Environment Variables** or **Settings**
4. Add or update:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
   ```
5. **Save and redeploy** the application

#### **Option B: Update .env file**

If you manually manage environment variables:

1. **Update `/app/.env` file:**
   ```env
   # Add or update this line
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
   ```

2. **Important:** If using version control, make sure `.env` is in `.gitignore`

3. **Restart your application** for changes to take effect

---

### Step 8: Verify Webhook Configuration

After adding the webhook secret, verify everything is set up correctly.

#### **Current Environment Variables (Should Have):**

```env
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_51QgR12HbvQ7QfHyl...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QgR12HbvQ7QfHyl...
STRIPE_WEBHOOK_SECRET=whsec_... (NEW - from Step 6)
STRIPE_CURRENCY=chf
STRIPE_TAX_MODE=manual
```

---

### Step 9: Test the Webhook

Stripe provides a built-in testing tool:

1. **In Stripe Dashboard:**
   - Go to: Developers → Webhooks
   - Click on your webhook endpoint
   - Click **"Send test webhook"** button

2. **Select an event to test:**
   - Choose: `payment_intent.succeeded`
   - Click **"Send test webhook"**

3. **Check Response:**
   - Should show: **200 OK** (success)
   - If you see errors, check the logs

4. **View in Your Application:**
   - The test event should trigger your webhook handler
   - Check your application logs for webhook processing

---

### Step 10: Test with Real Test Payment

The best way to verify everything works:

1. **Make a Test Booking:**
   - Go to: `https://sanity-nextjs.preview.emergentagent.com/stay`
   - Select a property and dates
   - Proceed to checkout

2. **Use Test Card:**
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - Postal Code: Any valid code (e.g., `12345`)

3. **Complete Payment:**
   - Click "Pay"
   - Payment should process successfully

4. **Verify Webhook Triggered:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click on your webhook
   - Click **"Events"** tab
   - You should see the `payment_intent.succeeded` event
   - Status should be **"Succeeded"** with response code **200**

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Webhook Returns 401 or 403 Error

**Problem:** Webhook secret mismatch or incorrect configuration

**Solution:**
1. Verify webhook secret in Stripe matches your `.env` file
2. Make sure there are no extra spaces or quotes
3. Restart your application after updating environment variables
4. Check that `STRIPE_WEBHOOK_SECRET` is properly loaded

#### Issue 2: Webhook Returns 500 Error

**Problem:** Server error processing the webhook

**Solution:**
1. Check your application logs for error details
2. Verify webhook handler code at `/app/app/api/stripe/webhook/route.js`
3. Ensure database connection is working
4. Check if booking creation logic is functioning

#### Issue 3: No Webhook Events Showing

**Problem:** Webhooks not being triggered

**Solution:**
1. Verify webhook endpoint URL is correct (no typos)
2. Check that endpoint is accessible (try visiting in browser - should return 405 Method Not Allowed)
3. Ensure your application is deployed and running
4. Verify Stripe is in Test mode (not Live mode)

#### Issue 4: "Webhook signature verification failed"

**Problem:** Incorrect webhook secret

**Solution:**
1. Go to Stripe Dashboard → Webhooks → Your endpoint
2. Click "Reveal" on the signing secret
3. Copy the EXACT secret (no extra characters)
4. Update `STRIPE_WEBHOOK_SECRET` in your environment
5. Redeploy application

---

## Viewing Webhook Logs

### In Stripe Dashboard:

1. **Navigate to:** Developers → Webhooks
2. **Click** on your webhook endpoint
3. **View Tabs:**
   - **Overview:** Shows status and configuration
   - **Events:** Shows all webhook events sent
   - **Logs:** Shows detailed request/response logs

### In Your Application:

Check server logs to see webhook processing:

```bash
# If using terminal access
tail -f /var/log/supervisor/nextjs.out.log | grep webhook

# Or check Emergent logs if available
```

---

## Security Best Practices

### ✅ Do's:

1. ✅ Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
2. ✅ Use HTTPS (required by Stripe)
3. ✅ Keep webhook secrets confidential
4. ✅ Log webhook events for debugging
5. ✅ Return 200 status quickly (process async if needed)
6. ✅ Handle duplicate events (webhooks can be sent multiple times)

### ❌ Don'ts:

1. ❌ Don't commit webhook secrets to version control
2. ❌ Don't process webhooks without signature verification
3. ❌ Don't expose webhook secrets in client-side code
4. ❌ Don't rely solely on webhooks (implement polling fallback)
5. ❌ Don't process long-running tasks in webhook handler

---

## Webhook Endpoint Code Reference

Your webhook handler is located at:
```
/app/app/api/stripe/webhook/route.js
```

**What it does:**
1. Receives webhook event from Stripe
2. Verifies signature using webhook secret
3. Processes payment events (success, failure)
4. Creates/updates booking records
5. Sends confirmation emails
6. Returns 200 response to Stripe

---

## Testing Checklist

Before going live, test these scenarios:

- [ ] Successful payment creates booking
- [ ] Failed payment sends error notification
- [ ] Duplicate webhooks are handled properly
- [ ] Booking confirmation email is sent
- [ ] Database record is created correctly
- [ ] Webhook signature verification works
- [ ] 500 errors are handled gracefully
- [ ] Logs show proper webhook processing

---

## Moving to Live Mode (Future)

When ready to accept real payments:

1. **Switch Stripe to Live Mode:**
   - Toggle in Stripe Dashboard
   - Generate new Live mode API keys

2. **Create New Webhook for Live Mode:**
   - Same URL: `https://sanity-nextjs.preview.emergentagent.com/api/stripe/webhook`
   - Same events: `payment_intent.succeeded`, etc.
   - Get new webhook signing secret

3. **Update Environment Variables:**
   ```env
   STRIPE_SECRET_KEY=sk_live_... (new live key)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (new live key)
   STRIPE_WEBHOOK_SECRET=whsec_... (new live webhook secret)
   ```

4. **Test thoroughly** before accepting real payments!

---

## Quick Reference

### Webhook URL:
```
https://sanity-nextjs.preview.emergentagent.com/api/stripe/webhook
```

### Required Events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### Test Card:
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

### Stripe Dashboard URLs:
- Webhooks: https://dashboard.stripe.com/test/webhooks
- Events: https://dashboard.stripe.com/test/events
- Logs: https://dashboard.stripe.com/test/logs

---

## Support

**Stripe Documentation:**
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing
- Events: https://stripe.com/docs/api/events

**Need Help?**
- Stripe Support: https://support.stripe.com/
- Check webhook logs in Stripe Dashboard
- Review application logs for errors

---

## Summary

✅ **Setup Steps:**
1. Login to Stripe (Test Mode)
2. Create webhook endpoint
3. Add events (payment_intent.succeeded, payment_intent.payment_failed)
4. Copy webhook signing secret
5. Update STRIPE_WEBHOOK_SECRET environment variable
6. Redeploy application
7. Test with test payment

**Estimated Time:** 10-15 minutes

**Status After Setup:** Ready for UAT testing with real payment flow!
