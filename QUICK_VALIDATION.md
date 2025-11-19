# Quick Validation Guide

## 🚀 One-Command Validation

Test all credentials instantly:

```bash
curl http://localhost:3000/api/validate-env | jq '.'
```

## ✅ What It Checks

1. **Uplisting API** - Connection & property count
2. **Uplisting Client ID** - Format validation & session name detection
3. **Stripe Keys** - Secret & publishable keys
4. **Stripe Webhook** - Webhook secret configuration
5. **Resend Email** - API key validation
6. **Admin Email** - Email format check
7. **MongoDB** - Database connection
8. **Base URL** - Session URL verification

## 📊 Expected Output

### ✅ Success (All Green)
```json
{
  "status": "success",
  "checks": {
    "uplisting_api": "✅ Connected (3 properties)",
    "uplisting_client_id": "✅ Valid format",
    "stripe_secret": "✅ Valid (test mode)",
    "stripe_publishable": "✅ Valid (test mode)",
    "stripe_webhook": "✅ Configured",
    "resend_api": "✅ Configured",
    "admin_email": "✅ aman.bhatnagar11@gmail.com",
    "mongodb": "✅ Connected",
    "base_url": "✅ https://sanity-nextjs-pages.preview.emergentagent.com"
  },
  "summary": {
    "total_checks": 9,
    "passed": 9,
    "failed": 0,
    "warnings": 0
  }
}
```

### ❌ Failure (Issues Detected)
```json
{
  "status": "error",
  "checks": {
    "uplisting_client_id": "❌ Invalid (session name detected)"
  },
  "errors": [
    "UPLISTING_CLIENT_ID is set to session name (INVALID!)"
  ]
}
```

## 🔧 Common Fixes

### Client ID is Session Name
```bash
# Fix in .env.local:
UPLISTING_CLIENT_ID=swisslodge-app

# Restart:
sudo supervisorctl restart nextjs
```

### Stripe Webhook Secret Invalid
```bash
# Update in Stripe Dashboard first, then:
STRIPE_WEBHOOK_SECRET=whsec_[new_secret]

# Restart:
sudo supervisorctl restart nextjs
```

## 💾 Automatic Backup

Every time you run validation:
- ✅ `.env.local` is backed up automatically
- ✅ Location: `/app/.env.local.backup.[timestamp]`
- ✅ Last 5 backups are kept

### View Backups
```bash
ls -lh /app/.env.local.backup.*
```

### Restore from Backup
```bash
# Copy specific backup
cp /app/.env.local.backup.2025-11-05_10-03-53-478Z /app/.env.local

# Restart server
sudo supervisorctl restart nextjs
```

## ⚡ Quick Commands

```bash
# Validate credentials
curl http://localhost:3000/api/validate-env | jq '.summary'

# Check only errors
curl http://localhost:3000/api/validate-env | jq '.errors'

# Check only warnings
curl http://localhost:3000/api/validate-env | jq '.warnings'

# View session info
curl http://localhost:3000/api/validate-env | jq '.session'

# Manual backup
cp /app/.env.local /app/.env.local.backup.$(date +%Y%m%d_%H%M%S)
```

## 📅 When to Run Validation

Run validation after:
- ✅ Session changes (URL changes)
- ✅ Updating any credentials
- ✅ Seeing booking failures
- ✅ Webhook errors in logs
- ✅ Before demos or testing
- ✅ After deployment

## 🎯 Pro Tip

Add to your workflow:
```bash
# After any .env.local change:
1. Save the file
2. Run: curl http://localhost:3000/api/validate-env | jq '.'
3. Fix any errors
4. Restart: sudo supervisorctl restart nextjs
5. Test booking flow
```

---

**Quick Access:**
- Full documentation: `/app/ENVIRONMENT_VARIABLES.md`
- Validation endpoint: `GET /api/validate-env`
- Backups location: `/app/.env.local.backup.*`
