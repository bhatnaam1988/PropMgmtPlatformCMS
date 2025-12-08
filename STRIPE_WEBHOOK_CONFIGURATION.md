# 🔗 Stripe Webhook Configuration Guide

## 📍 WEBHOOK URLs

### Preview Environment (Test Mode):
```
https://secure-forms-2.preview.emergentagent.com/api/stripe/webhook
```

### Production Environment (Live Mode):
```
https://rental-insights-4.emergent.host/api/stripe/webhook
```

---

## 🛠️ SETUP INSTRUCTIONS FOR PREVIEW

### Step 1: Go to Stripe Dashboard
1. Log into your Stripe account: https://dashboard.stripe.com
2. Make sure you're in **TEST MODE** (toggle in top-left)
3. Navigate to: **Developers → Webhooks**

### Step 2: Add Webhook Endpoint
1. Click **"Add endpoint"** button
2. Enter the Endpoint URL:
   ```
   https://secure-forms-2.preview.emergentagent.com/api/stripe/webhook
   ```

### Step 3: Select Events to Listen For
Select these 2 events:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

**How to select:**
1. Click "Select events"
2. Search for "payment_intent.succeeded"
3. Check the checkbox
4. Search for "payment_intent.payment_failed"
5. Check the checkbox
6. Click "Add events"

### Step 4: Complete Setup
1. Click **"Add endpoint"** to save
2. You'll be redirected to the webhook details page

### Step 5: Get Webhook Signing Secret
1. On the webhook details page, look for **"Signing secret"**
2. Click **"Reveal"** to show the secret
3. Copy the value (starts with `whsec_`)
4. **IMPORTANT:** You'll need this for your `.env.local` file

### Step 6: Update Your Local `.env.local`
Add or update this line in `/app/.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_[the_secret_you_just_copied]
```

Example:
```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz789example
```

### Step 7: Restart Your Local Server
```bash
sudo supervisorctl restart nextjs
```

---

## 🛠️ SETUP INSTRUCTIONS FOR PRODUCTION

### Step 1: Go to Stripe Dashboard
1. Log into your Stripe account: https://dashboard.stripe.com
2. **IMPORTANT:** Switch to **LIVE MODE** (toggle in top-left)
3. Navigate to: **Developers → Webhooks**

### Step 2: Add Webhook Endpoint
1. Click **"Add endpoint"** button
2. Enter the Endpoint URL:
   ```
   https://rental-insights-4.emergent.host/api/stripe/webhook
   ```

### Step 3: Select Events to Listen For
Select these 2 events:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

### Step 4: Complete Setup
1. Click **"Add endpoint"** to save
2. You'll be redirected to the webhook details page

### Step 5: Get Webhook Signing Secret
1. On the webhook details page, look for **"Signing secret"**
2. Click **"Reveal"** to show the secret
3. Copy the value (starts with `whsec_`)

### Step 6: Update Emergent Dashboard
1. Go to: **Emergent Dashboard → Deployments → rental-insights-4**
2. Navigate to: **Environment Variables**
3. Find or add: `STRIPE_WEBHOOK_SECRET`
4. Paste the webhook signing secret you copied
5. Click **"Save"**

### Step 7: Re-Deploy
1. Click **"Re-Deploy"** button
2. Wait for deployment to complete

---

## 🎯 WEBHOOK EVENTS EXPLAINED

### `payment_intent.succeeded`
**When:** Payment is successfully completed
**Your app does:**
1. Updates booking status to "confirmed"
2. Creates booking in Uplisting system
3. Sends confirmation email to guest
4. Marks booking as successful

### `payment_intent.payment_failed`
**When:** Payment fails (card declined, insufficient funds, etc.)
**Your app does:**
1. Updates booking status to "failed"
2. Logs the error
3. Can send admin alert (if configured)
4. Guest sees error message on frontend

---

## 🧪 TESTING WEBHOOKS

### Test in Stripe Dashboard:
1. Go to: **Developers → Webhooks**
2. Click on your webhook endpoint
3. Click **"Send test webhook"**
4. Select event type: `payment_intent.succeeded`
5. Click **"Send test webhook"**
6. Check the **Response** tab to see if it succeeded (200 status)

### Test with Real Payment:
1. Go to your checkout page
2. Use a test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/26`)
   - CVC: Any 3 digits (e.g., `123`)
3. Complete payment
4. Check Stripe Dashboard → Events
5. Should see `payment_intent.succeeded` event delivered to your webhook

---

## 🔍 WEBHOOK LOGS & DEBUGGING

### View Webhook Delivery in Stripe:
1. Stripe Dashboard → **Developers → Webhooks**
2. Click on your webhook endpoint
3. Scroll to **"Webhook attempts"** section
4. Shows all webhook deliveries with:
   - Timestamp
   - Event type
   - HTTP status code
   - Response body

### Common Issues:

#### Issue 1: 401 Unauthorized
**Cause:** Webhook signing secret mismatch
**Fix:**
- Verify `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard
- For preview: Update `.env.local`
- For production: Update Emergent Dashboard env vars

#### Issue 2: 500 Internal Server Error
**Cause:** Error in webhook handler code
**Fix:**
- Check server logs: `tail -f /var/log/supervisor/nextjs.out.log`
- Look for error messages in webhook handler

#### Issue 3: Webhook Not Received
**Cause:** URL incorrect or server not accessible
**Fix:**
- Verify webhook URL is correct
- Test URL is accessible: `curl https://your-domain.com/api/stripe/webhook`
- Check firewall/network settings

---

## 📋 VERIFICATION CHECKLIST

### Preview Environment:
- [ ] Webhook added in Stripe (TEST mode)
- [ ] URL: `https://secure-forms-2.preview.emergentagent.com/api/stripe/webhook`
- [ ] Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Signing secret copied
- [ ] `.env.local` updated with secret
- [ ] Server restarted
- [ ] Test webhook sent successfully (200 response)

### Production Environment:
- [ ] Webhook added in Stripe (LIVE mode)
- [ ] URL: `https://rental-insights-4.emergent.host/api/stripe/webhook`
- [ ] Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Signing secret copied
- [ ] Emergent Dashboard updated with secret
- [ ] Re-deployed
- [ ] Test payment completed
- [ ] Webhook delivered successfully
- [ ] Booking created in Uplisting
- [ ] Guest received confirmation email

---

## 🔒 SECURITY NOTES

### Webhook Signature Verification:
Your webhook handler automatically verifies that webhooks come from Stripe using the signing secret. This prevents:
- ❌ Fake webhook requests
- ❌ Man-in-the-middle attacks
- ❌ Replay attacks

### Development vs Production:
- **Development:** Webhook verification is optional (for local testing)
- **Production:** Webhook verification is REQUIRED (enforced in code)

### Secret Rotation:
If you need to rotate webhook secrets:
1. Generate new secret in Stripe Dashboard
2. Update your environment variables
3. Re-deploy (production) or restart (local)
4. Old webhooks will fail until secret is updated

---

## 📊 WEBHOOK FLOW DIAGRAM

```
┌─────────────────────────────────────────────┐
│  Customer Completes Payment                 │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  Stripe Processes Payment                   │
│  - Charges card                             │
│  - Creates payment_intent.succeeded event   │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  Stripe Sends Webhook                       │
│  POST /api/stripe/webhook                   │
│  - Event data in body                       │
│  - Signature in header                      │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  Your Webhook Handler                       │
│  1. Verify signature ✓                      │
│  2. Parse event data                        │
│  3. Update booking status                   │
│  4. Create Uplisting booking                │
│  5. Send confirmation email                 │
│  6. Return 200 OK                           │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  Stripe Records Delivery                    │
│  - Logs 200 response                        │
│  - Marks webhook as delivered               │
└─────────────────────────────────────────────┘
```

---

## 🆘 TROUBLESHOOTING

### "Unable to verify webhook signature"
**Problem:** Signing secret mismatch
**Solution:**
1. Copy secret from Stripe Dashboard
2. Paste EXACTLY into environment variable
3. No extra spaces or line breaks
4. Restart server / re-deploy

### "Webhook endpoint returned 500"
**Problem:** Error in webhook handler
**Solution:**
1. Check server logs for error details
2. Common issues:
   - Database connection error
   - Missing environment variables
   - Uplisting API error
3. Fix the issue and test again

### "No webhook events received"
**Problem:** Webhook URL incorrect or not accessible
**Solution:**
1. Verify URL is exactly: `https://your-domain.com/api/stripe/webhook`
2. Test with curl: `curl -X POST https://your-domain.com/api/stripe/webhook`
3. Should return 400 (missing signature) not 404

---

## 📞 SUPPORT

If you continue to have webhook issues:
1. Check Stripe Dashboard webhook logs for error details
2. Review server logs for error messages
3. Verify all environment variables are set correctly
4. Test with Stripe's "Send test webhook" feature

---

## ✅ QUICK REFERENCE

| Environment | Webhook URL | Mode | Secret Location |
|-------------|-------------|------|-----------------|
| **Preview** | `gallery-update-1.preview.emergentagent.com/api/stripe/webhook` | TEST | `.env.local` |
| **Production** | `rental-insights-4.emergent.host/api/stripe/webhook` | LIVE | Emergent Dashboard |

**Events to Select:** `payment_intent.succeeded`, `payment_intent.payment_failed`

**Signing Secret Format:** `whsec_...` (starts with "whsec_")
