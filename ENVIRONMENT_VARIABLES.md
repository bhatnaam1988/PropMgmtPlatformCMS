# Critical Environment Variables - Swiss Alpine Journey

**⚠️ IMPORTANT: Keep this file updated after ANY session change or credential rotation**

## 🔴 CRITICAL - DO NOT MODIFY WITHOUT BACKUP

These variables are ESSENTIAL for the application to function. If any of these are incorrect, the booking flow will fail.

### Uplisting API Credentials

```bash
# API Key (Base64 encoded)
UPLISTING_API_KEY=YzU5NjQ2YTUtYmRjYy00NTZjLWJiNGMtNWUxZjA0NzViMjU0

# API Base URL
UPLISTING_API_URL=https://connect.uplisting.io

# Client ID (UUID format - NOT the session name!)
# ⚠️ CRITICAL: This is NOT 'alpine-booking-1' or 'cozy-retreat'
# ⚠️ This should be: f4fd1410-9636-013e-aeff-2a9672a658e7
UPLISTING_CLIENT_ID=swisslodge-app
```

**How to verify Uplisting credentials:**
- Test endpoint: `GET /api/validate-env` (see below)
- Or manually: `curl -H "Authorization: Basic [API_KEY]" https://connect.uplisting.io/properties`

---

### Stripe Payment Credentials

```bash
# Test Mode Keys
STRIPE_SECRET_KEY=sk_test_51QgR12HbvQ7QfHylUoldzTlVQhrDIUa2u6AMu2HfMQcF1mNXrzBMhpK6Npr9d32iT8pcWjfth26WCnIUOWO4OBFM007KXBWYBv
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QgR12HbvQ7QfHylP2xJVuX4usoBn29k5Q8V0crpCyHg2LoWUYa3cPJmXBLCuiU219MnsLRwEjqievnCzwoeWWMW00KCDvsQ1U

# Webhook Signing Secret (changes when webhook endpoint is recreated)
# ⚠️ MUST match the endpoint configured in Stripe Dashboard
# Current endpoint: https://vacay-rentals-2.preview.emergentagent.com/api/stripe/webhook
STRIPE_WEBHOOK_SECRET=whsec_eWG9mHTjqFi8VTfPrheLrOGPA9zKgusW

# Stripe Settings
STRIPE_CURRENCY=chf
STRIPE_TAX_MODE=manual
MANUAL_VAT_RATE=7.7
```

**How to verify Stripe credentials:**
- Secret key: Check Stripe Dashboard → Developers → API Keys
- Webhook secret: Check Stripe Dashboard → Developers → Webhooks
- Or test: `GET /api/validate-env`

---

### Email Service (Resend)

```bash
# Resend API Key
RESEND_API_KEY=re_ERQXRMqa_DqmFAnpBk24a4nNCCYiFBhyM

# Email Configuration
EMAIL_PROVIDER=resend
EMAIL_FROM=onboarding@resend.dev

# Admin Alert Email
ADMIN_EMAIL=aman.bhatnagar11@gmail.com
ADMIN_ALERT_ENABLED=true
```

**How to verify Resend credentials:**
- Test endpoint: `GET /api/test-email`
- Or check Resend Dashboard → API Keys

---

### Database

```bash
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/swiss_alpine_journey
```

**How to verify MongoDB:**
- Test: `curl http://localhost:3000/api/properties`
- Should return 3 properties if working

---

### Application URLs

```bash
# Base URL (changes with session)
# Current session: alpine-booking-1
NEXT_PUBLIC_BASE_URL=https://vacay-rentals-2.preview.emergentagent.com

# Local development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔧 Validation & Testing

### Quick Validation Endpoint

Test all credentials at once:
```bash
curl http://localhost:3000/api/validate-env
```

**Expected Response:**
```json
{
  "status": "success",
  "checks": {
    "uplisting_api": "✅ Connected",
    "uplisting_client_id": "✅ Valid format",
    "stripe_keys": "✅ Valid",
    "stripe_webhook": "✅ Configured",
    "resend_api": "✅ Connected",
    "mongodb": "✅ Connected"
  }
}
```

---

## 🚨 Common Issues After Session Change

### Issue 1: Uplisting Client ID Reset

**Symptom:** 
```
❌ Non-JSON response from Uplisting: Your client ID does not appear to be valid.
```

**Cause:** `UPLISTING_CLIENT_ID` was reset to session name (e.g., `alpine-booking-1`)

**Fix:**
```bash
UPLISTING_CLIENT_ID=swisslodge-app
```

### Issue 2: Stripe Webhook Signature Mismatch

**Symptom:**
```
❌ Webhook signature verification failed
POST /api/stripe/webhook 400
```

**Cause:** Webhook endpoint URL changed but secret not updated

**Fix:**
1. Go to Stripe Dashboard → Webhooks
2. Update endpoint URL to new session URL
3. Copy new signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
5. Restart server

### Issue 3: Resend Email Fails

**Symptom:**
```
❌ Email send failed: Invalid API key
```

**Cause:** API key reset or changed

**Fix:**
1. Get key from Resend Dashboard
2. Update `RESEND_API_KEY`
3. Test with `GET /api/test-email`

---

## 📋 Session Change Checklist

When Emergent session changes (URL changes), follow these steps:

- [ ] **Backup current `.env.local`**
  ```bash
  cp /app/.env.local /app/.env.local.backup.$(date +%Y%m%d_%H%M%S)
  ```

- [ ] **Update Base URL**
  ```bash
  NEXT_PUBLIC_BASE_URL=https://vacay-rentals-2.preview.emergentagent.com
  ```

- [ ] **Verify Uplisting Client ID** (should NOT change)
  ```bash
  # Must be: f4fd1410-9636-013e-aeff-2a9672a658e7
  grep UPLISTING_CLIENT_ID /app/.env.local
  ```

- [ ] **Update Stripe Webhook**
  - Update endpoint in Stripe Dashboard
  - Copy new signing secret
  - Update `STRIPE_WEBHOOK_SECRET`

- [ ] **Test All Credentials**
  ```bash
  curl http://localhost:3000/api/validate-env
  ```

- [ ] **Restart Server**
  ```bash
  sudo supervisorctl restart nextjs
  ```

- [ ] **Test Complete Booking Flow**
  - Browse properties
  - Select dates and guests
  - Complete checkout
  - Verify Uplisting booking created
  - Check webhook logs

---

## 💾 Backup Strategy

### Automatic Backup

A backup is created automatically:
- Location: `/app/.env.local.backup.[timestamp]`
- Triggered: On validation endpoint call
- Retention: Keep last 5 backups

### Manual Backup

```bash
# Create timestamped backup
cp /app/.env.local /app/.env.local.backup.$(date +%Y%m%d_%H%M%S)

# List all backups
ls -la /app/.env.local.backup.*

# Restore from backup
cp /app/.env.local.backup.20250105_123456 /app/.env.local
sudo supervisorctl restart nextjs
```

---

## 🔒 Security Notes

- **NEVER commit `.env.local` to git**
- **NEVER share credentials in screenshots or logs**
- **Rotate credentials regularly**
- **Use test mode keys for development**
- **Switch to production keys only when deploying**

---

## 📞 Support

If credentials are lost or corrupted:

1. **Uplisting**: Contact Uplisting support for API credentials
2. **Stripe**: Regenerate keys in Stripe Dashboard
3. **Resend**: Regenerate keys in Resend Dashboard
4. **Restore from backup**: Use most recent `.env.local.backup.*` file

---

**Last Updated:** 2025-01-05
**Current Session:** alpine-booking-1
**Verified Working:** ✅
