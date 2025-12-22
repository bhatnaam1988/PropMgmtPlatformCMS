# Email Configuration Guide

**Date:** December 10, 2025  
**Admin Email Updated To:** journey@swissalpinejourney.ch

---

## 📧 All Emails Used in the Website

### 1. Admin/Operational Emails

#### A. Primary Admin Email (CRITICAL)
**Email:** `journey@swissalpinejourney.ch`  
**Purpose:** Receives all admin notifications, form submissions, alerts  
**Configuration:** Environment variable `ADMIN_EMAIL`  
**Used For:**
- Form submissions (Contact, Jobs, Cleaning, Rental inquiries)
- Missing price alerts from Uplisting
- System notifications
- Admin alerts

**Files Using This:**
- `/app/lib/email/index.js` (line 43)
- `/app/lib/email-alerts.js` (line 9)
- All form API routes

---

#### B. Sender Email (FROM address)
**Email:** `onboarding@resend.dev` (Default - SHOULD BE CHANGED)  
**Purpose:** Email sent "from" address  
**Configuration:** Environment variable `EMAIL_FROM`  
**Status:** ⚠️ Using Resend default - should be updated to your domain

**Recommended Value:** `noreply@swissalpinejourney.ch`

**File:** `/app/lib/email/providers/resend.js` (line 6)

---

#### C. Booking Notification Email
**Email:** `booking@swissalpinejourney.com`  
**Purpose:** Sender for booking-related alerts  
**Configuration:** Hardcoded in `/app/lib/email-alerts.js`  
**Used For:**
- Missing rate alerts
- Booking system notifications

**File:** `/app/lib/email-alerts.js` (line 10)

**Status:** ⚠️ Uses .com domain, might want to change to .ch

---

### 2. Display/Reference Emails (Not Functional)

#### A. Contact Page Email
**Email:** `info@swissalpinejourney.com`  
**Purpose:** Displayed on contact page as contact information  
**Configuration:** Fallback in `/app/app/contact/page.js`  
**Type:** Display only (not used for sending)

---

#### B. Schema.org Contact Email
**Email:** `hello@swissalpinejourney.com`  
**Purpose:** Structured data for SEO  
**Configuration:** `/app/lib/schemas.js`  
**Type:** Display only (not used for sending)

**Files:**
- `/app/lib/schemas.js` (lines 159, 183)
- `/app/app/booking/success/page.js`
- `/app/app/booking/failure/page.js`

---

#### C. Specialized Display Emails
**Email:** `privacy@swissalpinejourney.com`  
**Purpose:** Privacy policy contact (display only)  
**File:** Migration scripts

**Email:** `gdpr@swissalpinejourney.com`  
**Purpose:** GDPR contact (display only)  
**File:** Migration scripts

**Email:** `careers@swissalpinejourney.com`  
**Purpose:** Jobs page contact (display only)  
**File:** Migration scripts

---

## 🔧 Environment Variables

### Current Configuration

```bash
# Admin email - receives all notifications
ADMIN_EMAIL=journey@swissalpinejourney.ch

# Email service provider API key
RESEND_API_KEY=<your-resend-api-key>

# Sender email (FROM address) - RECOMMENDED TO ADD
EMAIL_FROM=noreply@swissalpinejourney.ch
```

---

## 📝 Files That Need Updating

### Files Modified in This Update:

1. **`/app/.env`** - Local development
   - Changed: `ADMIN_EMAIL=aman.bhatnagar11@gmail.com`
   - To: `ADMIN_EMAIL=journey@swissalpinejourney.ch`

2. **`/app/.env.local`** - Local development override
   - Changed: `ADMIN_EMAIL=aman.bhatnagar11@gmail.com`
   - To: `ADMIN_EMAIL=journey@swissalpinejourney.ch`

---

## 🌐 Production Deployment Configuration

### Where to Update for Production:

#### **Emergent Dashboard** (Primary Method)

**Steps:**
1. Go to your Emergent Dashboard
2. Navigate to your project
3. Click on **"Environment Variables"** or **"Settings"**
4. Update these variables:

```bash
ADMIN_EMAIL=journey@swissalpinejourney.ch
EMAIL_FROM=noreply@swissalpinejourney.ch
RESEND_API_KEY=<your-production-key>
```

5. Save changes
6. Restart/redeploy your application

---

### Important: Email Domain Configuration

⚠️ **Before using custom FROM emails, you need to:**

1. **Verify Your Domain in Resend:**
   - Go to Resend Dashboard: https://resend.com/domains
   - Add your domain: `swissalpinejourney.ch`
   - Add the required DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually takes a few minutes)

2. **Once Verified, You Can Use:**
   - `noreply@swissalpinejourney.ch`
   - `booking@swissalpinejourney.ch`
   - `info@swissalpinejourney.ch`
   - Any email `@swissalpinejourney.ch`

3. **Until Verified:**
   - Must use `onboarding@resend.dev`
   - Or any verified domain in your Resend account

---

## 📊 Email Flow Diagram

```
User submits form on website
        ↓
Form API route receives submission
        ↓
Stores in MongoDB
        ↓
Calls getEmailService()
        ↓
ResendProvider.sendEmail()
        ↓
Sends email FROM: EMAIL_FROM (or onboarding@resend.dev)
               TO: ADMIN_EMAIL (journey@swissalpinejourney.ch)
        ↓
Admin receives notification email
```

---

## 🔍 Complete Email Inventory

### Functional Emails (Actually Send/Receive)

| Email | Purpose | Type | Configuration | Priority |
|-------|---------|------|---------------|----------|
| `journey@swissalpinejourney.ch` | Admin inbox | TO (recipient) | ADMIN_EMAIL | 🔴 CRITICAL |
| `onboarding@resend.dev` | Default sender | FROM (sender) | EMAIL_FROM (default) | 🟡 Should change |
| `booking@swissalpinejourney.com` | Booking alerts | FROM (sender) | Hardcoded | 🟡 Should update |

### Display Emails (Reference Only)

| Email | Purpose | Where Shown | Functional? |
|-------|---------|-------------|-------------|
| `info@swissalpinejourney.com` | Contact info | Contact page | No |
| `hello@swissalpinejourney.com` | General contact | Booking pages, schemas | No |
| `privacy@swissalpinejourney.com` | Privacy contact | Legal page | No |
| `gdpr@swissalpinejourney.com` | GDPR contact | Legal page | No |
| `careers@swissalpinejourney.com` | Jobs contact | Jobs page | No |

---

## ⚙️ Recommended Updates

### Priority 1: CRITICAL (Done ✅)
- [x] Update ADMIN_EMAIL to journey@swissalpinejourney.ch
- [x] Update in .env and .env.local

### Priority 2: HIGH (Recommended)
- [ ] Add EMAIL_FROM environment variable
- [ ] Set to: `noreply@swissalpinejourney.ch`
- [ ] Verify domain in Resend
- [ ] Update production environment variables

### Priority 3: MEDIUM (Optional)
- [ ] Update booking@swissalpinejourney.com to .ch domain
- [ ] Update all display emails from .com to .ch
- [ ] Consolidate email addresses to use .ch consistently

---

## 🧪 Testing Email Configuration

### Test 1: Contact Form
1. Go to `/contact` page
2. Fill out form
3. Submit
4. Check `journey@swissalpinejourney.ch` inbox
5. ✅ Should receive notification email

### Test 2: Job Application
1. Go to `/jobs` page
2. Submit application
3. Check admin inbox
4. ✅ Should receive application email

### Test 3: Missing Rate Alert
1. Complete a booking with missing rates
2. Check admin inbox
3. ✅ Should receive alert about fallback rates

---

## 🔐 Security Notes

### Email Best Practices:

1. **Never commit actual email credentials to Git**
   - Use environment variables only
   - Keep API keys secret

2. **Use different emails for dev/prod**
   - Dev: Can use test emails
   - Prod: Use real business email

3. **Set up SPF/DKIM/DMARC**
   - Prevents your emails from being marked as spam
   - Required for custom domain emails

4. **Monitor bounce rates**
   - Check Resend dashboard regularly
   - Ensure emails are being delivered

---

## 📋 Deployment Checklist

### Before Deploying to Production:

- [x] Update ADMIN_EMAIL in code (.env files)
- [ ] Update ADMIN_EMAIL in Emergent Dashboard
- [ ] Add EMAIL_FROM in Emergent Dashboard
- [ ] Verify domain in Resend (if using custom FROM)
- [ ] Test email delivery in production
- [ ] Verify admin receives form submissions
- [ ] Check spam folder if emails not arriving
- [ ] Update all display emails to .ch domain (optional)

---

## 🆘 Troubleshooting

### Emails Not Being Received?

**Check:**
1. ADMIN_EMAIL is set correctly in environment
2. RESEND_API_KEY is valid and active
3. Resend account has credits/is active
4. Email not in spam folder
5. Resend dashboard shows email was sent
6. Domain is verified if using custom FROM address

### "Authentication failed" errors?

**Solution:**
- Check RESEND_API_KEY is correct
- Verify API key has send permissions
- Check Resend account is active

### Emails sent but not received?

**Check:**
1. Spam/junk folder
2. Email address spelled correctly
3. Resend dashboard delivery status
4. SPF/DKIM records if using custom domain

---

## 📞 Support Resources

**Resend Documentation:**
- Dashboard: https://resend.com/
- Docs: https://resend.com/docs
- Domain Setup: https://resend.com/docs/dashboard/domains/introduction

**Environment Variables:**
- Emergent Dashboard: https://emergentagent.com (check your project settings)
- Local: `/app/.env` and `/app/.env.local`

---

**Last Updated:** December 10, 2025  
**Status:** Admin email updated, ready for production deployment  
**Next Action:** Update production environment variables in Emergent Dashboard
