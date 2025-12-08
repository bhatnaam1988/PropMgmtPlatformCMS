# 🔐 CRITICAL CONFIGURATION - DO NOT LOSE

**This file contains critical configuration values that must be preserved across all deployments and code migrations.**

---

## 🚨 UPLISTING CONFIGURATION

### Client ID (CRITICAL - DO NOT CHANGE)
```
UPLISTING_CLIENT_ID=secure-forms-2
```

**⚠️ WARNING:**
- This Client ID is **required** for all Uplisting API calls
- Changing this will cause **ALL BOOKINGS TO FAIL**
- This value is specific to your Uplisting account
- Must be set in both `.env.local` (development) and Deployment Dashboard (production)

**🔒 SECURITY CLASSIFICATION:**
- **Client ID:** Not a secret (like username) - Safe to document
- **API Key:** SECRET - Never commit to git, only in deployment dashboard
- **API URL:** Public endpoint - Safe to document

### Other Uplisting Variables
```
UPLISTING_API_KEY=[SECRET - Set in deployment dashboard only]
UPLISTING_API_URL=https://connect.uplisting.io
```

### Security Best Practices
1. **Local Development:** Values in `.env.local` (gitignored)
2. **Production:** Values in Deployment Dashboard only
3. **Documentation:** Client ID safe to document, API Key is SECRET
4. **Version Control:** `.env.local` is gitignored - never commit
5. **Rotation:** If API Key is compromised, rotate immediately in Uplisting dashboard

---

## 📋 DEPLOYMENT CHECKLIST

When deploying to production, ensure these environment variables are set in Deployment Dashboard:

### 🔒 Security Protocol
**CRITICAL:** All API keys and secrets MUST be set in Deployment Dashboard
**NEVER:** Commit API keys to git or share in documentation
**SAFE TO DOCUMENT:** URLs, Client IDs (not secrets)

### Required for Bookings to Work:
- [ ] `UPLISTING_API_KEY` - [SECRET - From Uplisting Dashboard]
- [ ] `UPLISTING_CLIENT_ID` - **f4fd1410-9636-013e-aeff-2a9672a658e7** (Required, not secret)
- [ ] `UPLISTING_API_URL` - https://connect.uplisting.io (Public endpoint)

### Other Required Variables:
- [ ] `STRIPE_SECRET_KEY` - [SECRET - From Stripe Dashboard]
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - [PUBLIC - From Stripe Dashboard]
- [ ] `STRIPE_WEBHOOK_SECRET` - [SECRET - From Stripe Webhooks]
- [ ] `SANITY_API_TOKEN` - [SECRET - From Sanity Dashboard]
- [ ] `RESEND_API_KEY` - [SECRET - From Resend Dashboard]

### Configuration Variables (Not Secrets):
- [ ] `UPLISTING_API_URL` - https://connect.uplisting.io
- [ ] `MONGO_URL` - mongodb://localhost:27017
- [ ] `MONGO_DB_NAME` - swissalpine
- [ ] `NEXT_PUBLIC_BASE_URL` - Your production domain
- [ ] `CORS_ORIGINS` - Your production domain

---

## 🔍 TROUBLESHOOTING

### Bookings Not Creating in Uplisting

**Symptom:** Stripe payment succeeds, but booking not created in Uplisting

**Most Common Cause:** Incorrect `UPLISTING_CLIENT_ID`

**Solution:**
1. Verify `UPLISTING_CLIENT_ID=secure-forms-2`
2. Check logs for "Your client ID does not appear to be valid"
3. Ensure environment variables are loaded (restart server)

**Test Command:**
```bash
# Should return 200 OK (or booking created response)
curl -X POST https://connect.uplisting.io/v2/bookings \
  -H "Authorization: Basic YzU5NjQ2YTUtYmRjYy00NTZjLWJiNGMtNWUxZjA0NzViMjU0" \
  -H "X-Uplisting-Client-Id: f4fd1410-9636-013e-aeff-2a9672a658e7" \
  -H "Content-Type: application/json" \
  -d '{...booking data...}'
```

---

## 📝 FILES TO CHECK

If bookings are failing, verify these files have correct values:

1. `/app/.env.local` (development)
   ```bash
   UPLISTING_CLIENT_ID=secure-forms-2
   ```

2. `/app/.env` (production reference)
   ```bash
   # UPLISTING_CLIENT_ID=secure-forms-2
   ```

3. Deployment Dashboard (production)
   - Go to Environment Variables
   - Set: `UPLISTING_CLIENT_ID=secure-forms-2`

4. Code Files Using Uplisting:
   - `/app/lib/uplisting.js` - Main client
   - `/app/app/api/stripe/webhook/route.js` - Booking creation after payment
   - `/app/app/api/bookings/route.js` - Direct booking API

---

## 🔄 MIGRATION CHECKLIST

When moving to a new environment or context:

- [ ] Copy this file to new environment
- [ ] Set `UPLISTING_CLIENT_ID=secure-forms-2` in .env.local
- [ ] Set all environment variables in deployment dashboard
- [ ] Test booking flow end-to-end
- [ ] Verify booking appears in Uplisting dashboard

---

## 🆘 EMERGENCY CONTACT

If bookings are failing and you can't fix it:

1. **Check Uplisting Status:** https://status.uplisting.io (if exists)
2. **Contact Uplisting Support:** support@uplisting.io
3. **Provide:**
   - Client ID: f4fd1410-9636-013e-aeff-2a9672a658e7
   - API Key: (first 10 chars) YzU5NjQ2YTU...
   - Error message from logs

---

## 📊 CURRENT STATUS

**Last Updated:** December 2024
**Uplisting Client ID:** f4fd1410-9636-013e-aeff-2a9672a658e7
**Status:** ✅ Verified and working
**Last Tested:** After security implementation

---

## ⚠️ IMPORTANT NOTES

1. **Never commit API keys to git** - Keep in .env files (gitignored)
2. **Client ID is not a secret** - But must be exact for API to work
3. **API Key is a secret** - Treat like a password
4. **Test after any changes** - Always test booking flow after environment changes
5. **Document any changes** - Update this file if values change

---

**DO NOT DELETE THIS FILE**

This file serves as permanent documentation for critical configuration that must survive:
- Code migrations
- Context window changes
- Team handoffs
- Deployment changes
- Emergency recovery

---

**File Location:** `/app/CRITICAL_CONFIGURATION.md`
**Importance:** 🔴 CRITICAL
**Action if Lost:** Bookings will fail with 401 error from Uplisting
