# Unified Email Configuration - Complete

**Date:** December 10, 2025  
**Single Email for All Communication:** `journey@swissalpinejourney.ch`

---

## ✅ Configuration Complete

### Single Email Strategy
Using **ONE email** for all website communication:
- **Sending emails (FROM):** journey@swissalpinejourney.ch
- **Receiving emails (TO):** journey@swissalpinejourney.ch

**Benefits:**
- ✅ Simple administration - one inbox to monitor
- ✅ Easy email management
- ✅ Consistent branding
- ✅ No confusion about which email to check
- ✅ All communication in one place

---

## 🔧 Files Updated

### 1. Environment Files

**File:** `/app/.env`
```bash
ADMIN_EMAIL=journey@swissalpinejourney.ch
EMAIL_FROM=journey@swissalpinejourney.ch
```

**File:** `/app/.env.local`
```bash
ADMIN_EMAIL=journey@swissalpinejourney.ch
EMAIL_FROM=journey@swissalpinejourney.ch
```

### 2. Email Alert Configuration

**File:** `/app/lib/email-alerts.js`

**Changed:**
```javascript
// OLD
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@swissalpinejourney.com';
const FROM_EMAIL = 'booking@swissalpinejourney.com';

// NEW
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'journey@swissalpinejourney.ch';
const FROM_EMAIL = process.env.EMAIL_FROM || 'journey@swissalpinejourney.ch';
```

---

## 📧 Email Flow Diagram

### Before (Multiple Emails)
```
User Action
    ↓
FROM: booking@swissalpinejourney.com
TO: aman.bhatnagar11@gmail.com
    ↓
Different sender for different types
Multiple places to check
Confusion! ❌
```

### After (Single Email)
```
User Action
    ↓
FROM: journey@swissalpinejourney.ch
TO: journey@swissalpinejourney.ch
    ↓
ONE inbox for everything
Simple and clear! ✅
```

---

## 📋 What Uses This Email

### Receiving (TO) - All notifications sent here:

1. **Contact Form Submissions**
   - User inquiries from `/contact` page
   - General questions

2. **Job Applications**
   - Applications from `/jobs` page
   - Resume/CV submissions

3. **Cleaning Service Inquiries**
   - Requests from `/cleaning-services` page
   - Service quotes

4. **Rental Service Inquiries**
   - Requests from `/rental-services` page
   - Property management inquiries

5. **Newsletter Signups**
   - New subscriber notifications

6. **System Alerts**
   - Missing price alerts from Uplisting
   - Fallback rate notifications
   - System errors or warnings

### Sending (FROM) - All emails sent from:

1. **Notification Emails**
   - Form submission confirmations to admin
   - Alert emails

2. **Booking Alerts**
   - Missing rate notifications
   - Pricing fallback alerts

3. **System Notifications**
   - Admin alerts
   - Error notifications

---

## 🌐 Production Deployment Configuration

### Emergent Dashboard Setup

**Environment Variables to Add/Update:**

```bash
# Single email for all communication
ADMIN_EMAIL=journey@swissalpinejourney.ch
EMAIL_FROM=journey@swissalpinejourney.ch

# Resend API Key (required for sending emails)
RESEND_API_KEY=<your-production-resend-api-key>
```

### Steps:

1. **Login to Emergent Dashboard**
   - Go to your project
   - Navigate to "Settings" or "Environment Variables"

2. **Add/Update Variables**
   ```
   ADMIN_EMAIL=journey@swissalpinejourney.ch
   EMAIL_FROM=journey@swissalpinejourney.ch
   RESEND_API_KEY=<your-key>
   ```

3. **Save Changes**
   - Click "Save" or "Update"

4. **Restart Application**
   - Restart or redeploy for changes to take effect

---

## 🔐 Email Domain Verification (CRITICAL)

### ⚠️ Before Going Live

**You MUST verify your domain in Resend to send emails from `journey@swissalpinejourney.ch`**

### Steps to Verify Domain:

#### 1. Access Resend Dashboard
- Go to: https://resend.com/domains
- Login with your account

#### 2. Add Domain
- Click "Add Domain"
- Enter: `swissalpinejourney.ch`
- Click "Add"

#### 3. Configure DNS Records
Resend will provide DNS records. Add these to your domain registrar:

**SPF Record (TXT):**
```
Name: @
Type: TXT
Value: v=spf1 include:amazonses.com ~all
```

**DKIM Record (TXT):**
```
Name: resend._domainkey
Type: TXT
Value: [provided by Resend]
```

**DMARC Record (TXT):**
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; pct=100; rua=mailto:journey@swissalpinejourney.ch
```

#### 4. Wait for Verification
- Usually takes 5-30 minutes
- Check status in Resend dashboard
- Once verified, you can send from any @swissalpinejourney.ch email

#### 5. Test Sending
- Send a test email from Resend
- Verify it arrives and doesn't go to spam

---

## 🧪 Testing Checklist

### Development Environment (Already Updated)

- [x] ADMIN_EMAIL set to journey@swissalpinejourney.ch
- [x] EMAIL_FROM set to journey@swissalpinejourney.ch
- [x] email-alerts.js updated
- [x] Environment variables reloaded

### Production Environment (To Do)

- [ ] Add ADMIN_EMAIL to Emergent Dashboard
- [ ] Add EMAIL_FROM to Emergent Dashboard
- [ ] Verify RESEND_API_KEY is set
- [ ] Verify domain in Resend
- [ ] Configure DNS records
- [ ] Wait for domain verification
- [ ] Test email sending
- [ ] Test email receiving

### Functional Testing

**Test 1: Contact Form**
1. Go to `/contact`
2. Fill and submit form
3. Check `journey@swissalpinejourney.ch` inbox
4. ✅ Should receive email FROM: journey@swissalpinejourney.ch

**Test 2: Job Application**
1. Go to `/jobs`
2. Submit application
3. Check inbox
4. ✅ Should receive email FROM: journey@swissalpinejourney.ch

**Test 3: Cleaning Services**
1. Go to `/cleaning-services`
2. Submit inquiry
3. Check inbox
4. ✅ Should receive email FROM: journey@swissalpinejourney.ch

**Test 4: Rental Services**
1. Go to `/rental-services`
2. Submit inquiry
3. Check inbox
4. ✅ Should receive email FROM: journey@swissalpinejourney.ch

**Test 5: Missing Price Alert**
1. Make a booking with missing rates (test scenario)
2. Check inbox
3. ✅ Should receive alert FROM: journey@swissalpinejourney.ch

---

## 📊 Current Status

### Local Development ✅

| Configuration | Value | Status |
|---------------|-------|--------|
| ADMIN_EMAIL | journey@swissalpinejourney.ch | ✅ Set |
| EMAIL_FROM | journey@swissalpinejourney.ch | ✅ Set |
| email-alerts.js | journey@swissalpinejourney.ch | ✅ Updated |
| .env | Updated | ✅ Done |
| .env.local | Updated | ✅ Done |

### Production Environment ⚠️

| Configuration | Value | Status |
|---------------|-------|--------|
| ADMIN_EMAIL | journey@swissalpinejourney.ch | ⚠️ Needs Emergent Dashboard update |
| EMAIL_FROM | journey@swissalpinejourney.ch | ⚠️ Needs Emergent Dashboard update |
| Domain Verification | swissalpinejourney.ch | ⚠️ Needs Resend verification |
| DNS Records | SPF, DKIM, DMARC | ⚠️ Needs configuration |

---

## 🎯 Advantages of Single Email Setup

### 1. Simplified Administration
- Only one inbox to monitor
- No confusion about which email to check
- All communication in one place

### 2. Easier Management
- Easier to set up forwarding if needed
- Simpler to configure email client
- One set of credentials to remember

### 3. Consistent Branding
- All emails come from the same address
- Professional appearance
- Users know where to reply

### 4. Better Organization
- Use email filters/labels within single inbox
- Easier to search all communication
- Simpler backup strategy

### 5. Cost Effective
- Only need one email account
- Simpler email service plan
- Less configuration overhead

---

## 🔍 Email Service Provider Details

### Resend Configuration

**Service:** Resend (https://resend.com)

**Features Used:**
- Transactional email sending
- Domain verification
- Email templates
- Delivery tracking

**API Integration:**
- Library: `resend` npm package
- Configuration: `/app/lib/email/providers/resend.js`
- Authentication: RESEND_API_KEY environment variable

**Pricing:**
- Check Resend dashboard for current plan
- Verify you have sufficient send quota
- Monitor usage in Resend analytics

---

## 📝 Email Templates

All emails use the following pattern:

### Contact Form Email
```
FROM: journey@swissalpinejourney.ch
TO: journey@swissalpinejourney.ch
SUBJECT: New Contact Form Submission

BODY:
- Inquiry Type
- Name
- Email
- Phone
- Subject
- Message
```

### Job Application Email
```
FROM: journey@swissalpinejourney.ch
TO: journey@swissalpinejourney.ch
SUBJECT: New Job Application

BODY:
- Position
- Name
- Email
- Phone
- Cover Letter
- Experience
```

### Missing Rate Alert Email
```
FROM: journey@swissalpinejourney.ch
TO: journey@swissalpinejourney.ch
SUBJECT: ⚠️ Missing Price Data in Uplisting

BODY:
- Property ID
- Property Name
- Check-in Date
- Check-out Date
- Missing Dates List
- Fallback Rates Used
```

---

## ⚠️ Important Notes

### Email Deliverability

**To ensure emails don't go to spam:**

1. ✅ Verify domain in Resend
2. ✅ Configure SPF, DKIM, DMARC records
3. ✅ Use professional email content
4. ✅ Include unsubscribe links where required
5. ✅ Monitor bounce rates in Resend dashboard

### Reply-To Consideration

When you reply to notification emails, they will come back to the same inbox. This is intentional and keeps all communication in one thread.

If you need to separate replies, consider:
- Using email filters/labels
- Creating separate folders
- Using email client features

---

## 🚨 Troubleshooting

### Problem: Emails not being sent

**Solution:**
1. Check RESEND_API_KEY is valid
2. Verify domain in Resend dashboard
3. Check Resend account has credits
4. Verify DNS records are configured correctly

### Problem: Emails going to spam

**Solution:**
1. Complete domain verification in Resend
2. Add all three DNS records (SPF, DKIM, DMARC)
3. Wait 24-48 hours for DNS propagation
4. Test with mail-tester.com
5. Check email content isn't too spammy

### Problem: Domain verification pending

**Solution:**
1. DNS records can take 5-30 minutes to propagate
2. Check DNS records with online tools (whatsmydns.net)
3. Verify records were added correctly
4. Contact your domain registrar if issues persist

### Problem: Not receiving emails

**Solution:**
1. Check spam/junk folder
2. Verify ADMIN_EMAIL is set correctly
3. Check Resend dashboard for delivery status
4. Test with a simple email client first
5. Verify inbox isn't full

---

## 📞 Support Resources

**Resend:**
- Dashboard: https://resend.com
- Documentation: https://resend.com/docs
- Domain Setup: https://resend.com/docs/dashboard/domains/introduction
- API Reference: https://resend.com/docs/api-reference/introduction

**DNS Configuration:**
- DNS Checker: https://whatsmydns.net
- Mail Tester: https://www.mail-tester.com
- MX Toolbox: https://mxtoolbox.com

**Emergent Dashboard:**
- Access your project's environment variables
- Update configuration without code changes

---

## ✅ Final Checklist

### Development (Done ✅)
- [x] Update ADMIN_EMAIL in .env
- [x] Update EMAIL_FROM in .env
- [x] Update ADMIN_EMAIL in .env.local
- [x] Update EMAIL_FROM in .env.local
- [x] Update email-alerts.js fallbacks
- [x] Test environment variable reload

### Production (To Do ⚠️)
- [ ] Add ADMIN_EMAIL to Emergent Dashboard
- [ ] Add EMAIL_FROM to Emergent Dashboard
- [ ] Verify domain in Resend
- [ ] Configure DNS records
- [ ] Wait for domain verification (5-30 min)
- [ ] Test sending email in production
- [ ] Test receiving email
- [ ] Verify emails not in spam
- [ ] Monitor Resend dashboard for issues

### Documentation (Done ✅)
- [x] Complete email inventory
- [x] Document configuration steps
- [x] Create testing procedures
- [x] Provide troubleshooting guide

---

## 🎉 Summary

**Single Email:** `journey@swissalpinejourney.ch`

**Used For:**
- ✅ Receiving all admin notifications
- ✅ Sending all website emails
- ✅ Contact forms
- ✅ Job applications
- ✅ Service inquiries
- ✅ System alerts
- ✅ Booking notifications

**Configuration:**
- ✅ Local environment: Complete
- ⚠️ Production environment: Awaiting Emergent Dashboard update
- ⚠️ Domain verification: Required before sending emails

**Status:** Ready for production deployment after domain verification

---

**Last Updated:** December 10, 2025  
**Next Action:** Update Emergent Dashboard environment variables  
**Critical:** Verify domain in Resend before going live
