# 🔧 ReCaptcha Domain Configuration - Fix 400 Error

**Issue:** ReCaptcha returns `400 Bad Request`  
**Cause:** Domain not registered in Google ReCaptcha Console  
**Solution:** Add domain to ReCaptcha key configuration

---

## 🚨 CRITICAL: Domain Registration Required

Your ReCaptcha keys need to be configured for the domain where the app is running.

### Current Domain:
```
rental-fix.preview.emergentagent.com
```

### Problem:
The ReCaptcha keys you provided are likely configured for a **different domain** (or no domain), which is why Google is rejecting the requests with `400 Bad Request`.

---

## ✅ Solution Steps

### Option 1: Update Existing Keys (Recommended)

1. **Go to Google ReCaptcha Admin Console:**
   ```
   https://www.google.com/recaptcha/admin
   ```

2. **Find Your Site:**
   - Look for the site with key: `6LcvyiQsAAAAAOteHnRWVpce40wmGNqh0UhWeUS2`
   - Click on the ⚙️ (Settings) icon

3. **Add Domains:**
   In the "Domains" section, add these domains:
   ```
   rental-fix.preview.emergentagent.com
   localhost (for local testing)
   ```

4. **Save Changes**
   - Click "Save"
   - Changes take effect immediately

5. **Test:**
   - Refresh your application
   - Try clicking "Reserve" button again
   - Should work now!

---

### Option 2: Create New Keys for This Domain

If you can't access the existing keys or they're for a different project:

1. **Go to ReCaptcha Admin:**
   ```
   https://www.google.com/recaptcha/admin/create
   ```

2. **Fill in the form:**
   - **Label:** Swiss Alpine Journey - Rental Fix
   - **reCAPTCHA type:** reCAPTCHA v3
   - **Domains:** 
     ```
     rental-fix.preview.emergentagent.com
     localhost
     ```
   - Accept terms and submit

3. **Copy the NEW keys:**
   - Site Key (starts with `6L...`)
   - Secret Key

4. **Update `.env` file:**
   ```bash
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<new_site_key>
   RECAPTCHA_SECRET_KEY=<new_secret_key>
   ```

5. **Restart the application:**
   ```bash
   sudo supervisorctl restart nextjs
   ```

---

## 🔍 How to Verify Domain Configuration

### Check in ReCaptcha Console:

1. Login to: https://www.google.com/recaptcha/admin
2. Click on your site
3. Under "Settings" → "Domains", you should see:
   ```
   ✅ rental-fix.preview.emergentagent.com
   ✅ localhost
   ```

### Common Domain Patterns:

For development and production, add:
```
localhost                                    (local development)
rental-fix.preview.emergentagent.com        (preview environment)
your-production-domain.com                   (production)
*.your-production-domain.com                 (all subdomains)
```

---

## 🛠️ Alternative: Temporary Bypass for Testing

If you need to test other features while waiting for domain configuration, you can **temporarily disable** ReCaptcha:

### Quick Bypass (Development Only):

1. **Edit `/app/hooks/useRecaptcha.js`:**

Add this at the top of the `executeRecaptcha` function:

```javascript
// TEMPORARY: Bypass ReCaptcha for testing
if (process.env.NODE_ENV === 'development') {
  console.warn('⚠️ ReCaptcha bypassed in development mode');
  return true;
}
```

2. **This will:**
   - Skip ReCaptcha verification in development
   - Allow you to test other features
   - Should be removed before production

**⚠️ WARNING:** Remove this bypass before production deployment!

---

## 📊 Error Codes Explained

### 400 Bad Request:
- **Meaning:** Domain not authorized
- **Fix:** Add domain to ReCaptcha console

### 403 Forbidden:
- **Meaning:** Invalid key or secret
- **Fix:** Check keys are correct

### "ReCaptcha not ready":
- **Meaning:** Script not loaded yet
- **Fix:** Already handled in updated hook (1-second delay)

---

## ✅ Verification Checklist

After updating domain configuration:

- [ ] Domain added to ReCaptcha console
- [ ] Keys updated in `.env` (if new keys created)
- [ ] Application restarted
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] Test "Reserve" button on property page
- [ ] Check browser console for ReCaptcha errors
- [ ] Verify no more 400 errors in Network tab

---

## 🎯 Quick Diagnostic

### Check if ReCaptcha is loading:

Open browser console and run:
```javascript
window.grecaptcha
```

**Expected:**
- Should show an object with ReCaptcha methods
- If `undefined`, script not loading

### Check for errors:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors related to:
   - `recaptcha__en.js`
   - `Invalid site key`
   - `This domain is not authorized`

---

## 💡 Recommended Configuration

### For Production Deployment:

**Domains to add:**
```
localhost                                    # Development
rental-fix.preview.emergentagent.com        # Preview/Staging
your-production-domain.com                   # Production
```

**Security Settings:**
- ✅ Enable domain validation
- ✅ Use reCAPTCHA v3
- ✅ Set score threshold: 0.5
- ✅ Enable analytics

---

## 🔒 Security Note

**Never commit real ReCaptcha secret keys to Git!**

✅ Good:
```bash
# In .env (gitignored)
RECAPTCHA_SECRET_KEY=your_secret_key
```

❌ Bad:
```javascript
// In code (committed to Git)
const secretKey = '6LcvyiQs...';
```

---

## 📞 Need Help?

### Google ReCaptcha Support:
- Admin Console: https://www.google.com/recaptcha/admin
- Documentation: https://developers.google.com/recaptcha/docs/v3
- Forum: https://groups.google.com/g/recaptcha

### Common Issues:
1. **Domain not added** → Most common, fix above
2. **Wrong environment** → Check domain matches
3. **Keys mismatch** → Verify site key and secret key pair
4. **Browser blocking** → Check ad blockers, privacy extensions

---

## ✨ After Fix

Once domain is configured correctly:

1. ReCaptcha will load automatically ✅
2. "Reserve" button will show "Verifying..." ✅
3. Verification will complete in 1-2 seconds ✅
4. No more 400 errors ✅
5. Smooth user experience ✅

---

**Next Steps:**
1. Add domain to Google ReCaptcha Console (5 minutes)
2. Test the Reserve button
3. If working, continue with remaining 6 forms
4. Full deployment with all protections

**Status:** Waiting for domain configuration  
**Blocker:** Domain authorization  
**Time to Fix:** ~5 minutes
