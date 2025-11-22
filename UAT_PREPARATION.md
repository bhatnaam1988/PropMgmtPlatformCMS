# UAT Preparation Checklist - Swiss Alpine Journey

## Current Configuration Status

### ✅ Stripe Configuration (TEST MODE)
**Status:** Properly configured in TEST mode
- **Secret Key:** `sk_test_...` (Test mode confirmed)
- **Publishable Key:** `pk_test_...` (Test mode confirmed)
- **Webhook Secret:** Configured
- **Currency:** CHF
- **Tax Mode:** Manual

### ✅ Sanity CMS Configuration
**Status:** Configured and operational
- **Project ID:** vrhdu6hl
- **Dataset:** production
- **API Version:** 2024-01-01
- **Studio URL:** `https://gallery-update-1.preview.emergentagent.com/studio`

### ✅ Other Integrations
- **Uplisting API:** Configured (property management)
- **Resend Email:** Configured (notifications)
- **MongoDB:** Configured (booking storage)

---

## 📋 Pre-UAT Checklist

### 1. Stripe Console Actions Required

#### A. Verify Test Mode Settings
1. Login to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Ensure you are in TEST mode** (toggle in top right should show "Test mode")
3. Navigate to **Developers → Webhooks**
4. Verify webhook endpoint is configured:
   - **URL:** `https://gallery-update-1.preview.emergentagent.com/api/stripe/webhook`
   - **Events to listen:** `payment_intent.succeeded`, `payment_intent.payment_failed`
   - **Status:** Should be "Active"

#### B. Test Payment Methods
In TEST mode, use these test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184

#### C. Recommended Stripe Settings for UAT
Navigate to **Settings → Business settings** and verify:
- ✅ Business name: "Swiss Alpine Journey" or client's company name
- ✅ Support email configured
- ✅ Statement descriptor configured (appears on customer's bank statement)

Navigate to **Settings → Customer emails** and enable:
- ✅ Successful payments
- ✅ Refunded payments (if applicable)

#### D. Payment Intent Settings
Navigate to **Settings → Payment methods**:
- ✅ Enable card payments
- ✅ Consider enabling: Google Pay, Apple Pay (optional for UAT)

---

### 2. Sanity Studio Actions Required

#### A. Access Sanity Studio
1. Navigate to: `https://gallery-update-1.preview.emergentagent.com/studio`
2. Login with Sanity credentials

#### B. Content Verification Checklist
Verify all content is correctly populated:

**Homepage Settings:**
- ✅ Hero section content
- ✅ About section
- ✅ Features section
- ✅ Testimonials
- ✅ Call-to-action sections

**About Page:**
- ✅ Company story
- ✅ Values
- ✅ Statistics
- ✅ Team information (if applicable)

**Legal Page:**
- ✅ Terms & Conditions
- ✅ Privacy Policy
- ✅ GDPR information
- ⚠️ **CRITICAL:** Ensure legal content is reviewed by legal team before UAT

**Contact Page:**
- ✅ Contact information (phone, email)
- ✅ Office address
- ✅ Business hours

**Explore Pages:**
- ✅ Grächen location details
- ✅ Travel tips
- ✅ Behind the scenes
- ✅ Other locations

**Services Pages:**
- ✅ Cleaning services information
- ✅ Rental services information

**Jobs Page:**
- ✅ Current job openings
- ✅ Company values
- ✅ Application form settings

#### C. Sanity Schema Verification
Ensure all schemas are published:
1. Go to **Vision** tab in Sanity Studio
2. Run test queries to verify data structure
3. Check for any "draft" documents that need publishing

---

### 3. Property Data Verification

#### Primary Images Configuration
Verify these 3 properties show correct showcase images:

**Property 84656 (Sunny Alps View: Central Bliss):**
- Primary image: Kitchen/dining with mountain view
- ✅ Check on homepage
- ✅ Check on listings page
- ✅ Check on detail page

**Property 186289 (The Liftside Terrace Retreat):**
- Primary image: Modern kitchen/dining
- ✅ Check on all views

**Property 174947 (Central & Cozy Alpine Flat):**
- Primary image: Cozy bedroom with mountain view
- ✅ Check on all views

#### Property Gallery Verification
- ✅ Airbnb-style layout displaying correctly
- ✅ Main image loads properly
- ✅ Thumbnail grid scrollable
- ✅ Image selection working
- ✅ All images load without errors

---

### 4. Booking Flow Testing

#### Complete Booking Test Journey
**Test 1: Successful Booking**
1. ✅ Browse properties on homepage
2. ✅ Navigate to Stay page
3. ✅ Apply filters (location, dates, guests)
4. ✅ View property details
5. ✅ Select dates and guests
6. ✅ Check pricing calculation (accommodation + cleaning + taxes)
7. ✅ Click "Reserve" button
8. ✅ Fill guest information on checkout page
9. ✅ Complete payment with test card: **4242 4242 4242 4242**
10. ✅ Verify success page displays
11. ✅ Check admin email received (aman.bhatnagar11@gmail.com)
12. ✅ Verify booking created in MongoDB

**Test 2: Failed Payment**
1. ✅ Complete steps 1-8 from above
2. ✅ Use test card: **4000 0000 0000 0002**
3. ✅ Verify failure page displays with proper error message
4. ✅ Check email alert sent to admin

**Test 3: Validation Tests**
- ✅ Try booking with past dates (should fail)
- ✅ Try exceeding max guests (should show warning)
- ✅ Try booking unavailable dates (should show warning)
- ✅ Try submitting form with missing fields (should show validation errors)

---

### 5. Form Submissions Testing

#### Contact Form
1. Navigate to `/contact`
2. ✅ Fill all required fields
3. ✅ Submit form
4. ✅ Verify success toast/message
5. ✅ Check admin email received
6. ✅ Verify submission saved in MongoDB

#### Cleaning Services Form
1. Navigate to `/cleaning-services`
2. ✅ Complete same testing as contact form

#### Rental Services Form
1. Navigate to `/rental-services`
2. ✅ Complete same testing as contact form

#### Jobs Application Form
1. Navigate to `/jobs`
2. ✅ Fill application with resume and cover letter
3. ✅ Submit form
4. ✅ Verify success notification
5. ✅ Check admin email received

---

### 6. Email Configuration Verification

**Current Email Settings:**
- Provider: Resend
- Admin Email: aman.bhatnagar11@gmail.com
- From Address: (verify in Resend console)

**⚠️ ACTION REQUIRED:**
1. Login to [Resend Dashboard](https://resend.com/dashboard)
2. Verify domain is configured (or using Resend's default domain for testing)
3. Check email delivery logs
4. Consider adding client's email for UAT: Update `ADMIN_EMAIL` in `.env.local`

**Email Templates to Test:**
- ✅ Contact form submission
- ✅ Cleaning service request
- ✅ Rental service inquiry
- ✅ Job application
- ✅ Booking success notification
- ✅ Payment failure alert

---

### 7. Environment Variables Review

**Current Configuration:** ✅ All set correctly

**⚠️ Before Client UAT - Consider Updating:**
```env
# Update admin email if client wants to receive notifications
ADMIN_EMAIL=client@example.com  # or keep current for now

# Verify these are set (already configured):
STRIPE_SECRET_KEY=sk_test_... ✅
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... ✅
STRIPE_WEBHOOK_SECRET=whsec_... ✅
UPLISTING_API_KEY=... ✅
RESEND_API_KEY=... ✅
SANITY_API_TOKEN=... ✅
```

**🔒 Security Note:**
- All sensitive keys are in `.env.local` (not committed to git) ✅
- Stripe is in TEST mode ✅
- Production keys should only be added when going live

---

### 8. Content Review Checklist

#### Text & Copy
- ✅ All placeholder text replaced with real content
- ✅ Spelling and grammar check
- ✅ Brand name consistency
- ✅ Contact information accuracy
- ⚠️ **Legal content reviewed by legal team**

#### Images
- ✅ All images loading properly
- ✅ No placeholder images remaining
- ✅ Image quality acceptable
- ✅ All property images displaying correctly

#### Links & Navigation
- ✅ All navigation menu items working
- ✅ Footer links working
- ✅ Social media links (if any) correct
- ✅ "Back to listings" and internal navigation working

---

### 9. Performance & SEO Verification

#### Performance
- ✅ Page load times acceptable (< 3 seconds)
- ✅ Images optimized
- ✅ No console errors in browser

#### SEO (Optional for UAT)
- Check meta titles and descriptions in Sanity
- Verify structured data is outputting correctly
- Test Open Graph tags for social sharing

---

### 10. Mobile Responsiveness Testing

**Test on multiple devices/viewports:**
- ✅ Mobile (375px - iPhone)
- ✅ Tablet (768px - iPad)
- ✅ Desktop (1920px)

**Key pages to test:**
- ✅ Homepage
- ✅ Property listings
- ✅ Property detail page (especially new gallery)
- ✅ Checkout flow
- ✅ All forms

---

### 11. Browser Compatibility

**Test on:**
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)

---

### 12. Known Limitations for UAT

**Stripe Test Mode:**
- Only test cards will work
- No real money will be processed
- Webhook events are simulated
- Some Stripe features may behave differently in test mode

**Uplisting Integration:**
- Using live Uplisting data
- Property availability is real-time
- Booking creation attempts will be made (test carefully)

**Email Notifications:**
- All emails go to configured admin email
- Client won't receive customer emails in test mode

---

## 🚨 Critical Actions Before UAT

### Must Do Before Sharing with Client:

1. **Update Admin Email (Optional):**
   ```bash
   # In /app/.env.local, update:
   ADMIN_EMAIL=client-uat-email@example.com
   ```

2. **Clear Test Data (if needed):**
   - Review MongoDB for any test bookings
   - Clear if necessary to start fresh for UAT

3. **Verify Stripe Webhook:**
   - Test webhook by making a test payment
   - Check Stripe logs to confirm events are received

4. **Final Content Review:**
   - ⚠️ Ensure all legal content is approved
   - Verify contact information is correct
   - Check all forms are working

5. **Communication Plan:**
   - Prepare list of test accounts/credentials for client
   - Share test card details
   - Provide UAT testing script/scenarios
   - Set expectations about test mode limitations

---

## 📧 UAT Testing Credentials to Share with Client

**Sanity Studio:**
- URL: `https://gallery-update-1.preview.emergentagent.com/studio`
- Email: [Provide if client needs CMS access]
- Password: [Provide if applicable]

**Test Payment Cards (Stripe Test Mode):**
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

**Test Scenarios Document:**
- Create a simple Google Doc with step-by-step UAT scenarios
- Include expected results for each test
- Provide feedback form/template

---

## 🎯 UAT Success Criteria

**Before signing off on UAT, verify:**
- ✅ All pages load without errors
- ✅ All forms submit successfully
- ✅ Email notifications are received
- ✅ Booking flow works end-to-end
- ✅ Payment processing works (test mode)
- ✅ Mobile experience is good
- ✅ Content is accurate and approved
- ✅ Client is satisfied with functionality
- ✅ Bug list documented (if any)

---

## 📝 Post-UAT Actions

**After UAT feedback:**
1. Document all bugs/issues found
2. Prioritize fixes (critical vs nice-to-have)
3. Implement fixes
4. Retest affected areas
5. Get client approval
6. Prepare for production deployment

**Before Production Deployment:**
- [ ] Switch Stripe to LIVE mode
- [ ] Update webhook URL for production
- [ ] Configure production domain
- [ ] Set up monitoring/error tracking
- [ ] Backup database
- [ ] Prepare rollback plan

---

## 🆘 Support & Troubleshooting

**If issues occur during UAT:**

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for errors in Console tab
   - Screenshot and report

2. **Check Stripe Logs:**
   - Dashboard → Developers → Logs
   - Look for webhook failures

3. **Check Email Logs:**
   - Resend Dashboard → Logs
   - Verify emails are being sent

4. **Check MongoDB:**
   - Verify data is being saved
   - Check for any data inconsistencies

**Common Issues & Solutions:**

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Payment fails | Stripe webhook not configured | Verify webhook URL in Stripe |
| Emails not received | Wrong admin email | Update ADMIN_EMAIL in .env.local |
| Properties not loading | Uplisting API issue | Check API key and connectivity |
| Images not loading | CDN/URL issue | Check image URLs in browser |
| Forms not submitting | Validation errors | Check browser console |

---

## ✅ Final Checklist Before UAT Handoff

- [ ] All environment variables configured
- [ ] Stripe in TEST mode and working
- [ ] Sanity content populated and reviewed
- [ ] Primary images configured for all properties
- [ ] All forms tested and working
- [ ] Email notifications working
- [ ] Complete booking flow tested
- [ ] Mobile responsiveness verified
- [ ] All console errors fixed
- [ ] Legal content approved
- [ ] Contact information verified
- [ ] Test credentials prepared for client
- [ ] UAT testing guide created
- [ ] Support plan in place

---

**UAT Environment URL:** https://gallery-update-1.preview.emergentagent.com
**UAT Ready:** Pending final review of this checklist
**Last Updated:** [Current Date]
