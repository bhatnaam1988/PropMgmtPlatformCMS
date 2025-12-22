# Testing Guide - MVP Missing Features Implementation

**Implementation Date:** December 10, 2025  
**Status:** ✅ ALL 3 FEATURES IMPLEMENTED  
**Testing Required:** Comprehensive validation of all changes

---

## 🎯 Overview of Changes

### Feature 1: Marketing Consent Storage (CRITICAL - GDPR)
- **Impact:** Booking records now store user consent for marketing communications
- **Files Modified:** 2
- **Risk Level:** LOW (additive only)

### Feature 2: Property Structured Data (HIGH - SEO)
- **Impact:** Property pages now have Accommodation schema.org markup
- **Files Created:** 1
- **Files Modified:** 0 (already implemented)
- **Risk Level:** VERY LOW (verified already working)

### Feature 3: Accessibility Enhancements (MEDIUM - WCAG 2.1 AA)
- **Impact:** Improved keyboard navigation, screen reader support, form validation
- **Files Modified:** 4
- **Risk Level:** LOW (non-breaking additions)

---

## 🧪 Test Suite 1: Marketing Consent Storage

### Test 1.1: Consent Granted - Full Booking Flow

**Steps:**
1. Open browser in incognito/private mode
2. Navigate to: `https://secure-forms-2.preview.emergentagent.com/property/84656`
3. Select dates (e.g., 2 weeks from today for 3 nights)
4. Enter guest details: 2 adults
5. Click "Reserve"
6. Fill checkout form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: +41791234567
7. **CHECK the marketing consent checkbox:** ✅ "Yes, I'd like to receive marketing emails"
8. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/26)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
9. Complete payment
10. Wait for success page

**Verification:**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use swissalpine

# Find the latest booking
db.bookings.find().sort({createdAt: -1}).limit(1).pretty()

# Expected output should include:
{
  ...
  "marketingConsent": {
    "granted": true,
    "capturedAt": ISODate("2025-12-10T..."),
    "source": "checkout_form",
    "version": "1.0"
  },
  ...
}
```

**Expected Result:**
- ✅ Payment succeeds
- ✅ Booking created in MongoDB
- ✅ `marketingConsent.granted` is `true`
- ✅ Timestamp captured
- ✅ Source is "checkout_form"
- ✅ Version is "1.0"

---

### Test 1.2: Consent Not Granted

**Steps:**
1. Repeat Test 1.1 but **DO NOT check** the marketing consent checkbox
2. Complete the booking

**Verification:**
```bash
# Find the latest booking
db.bookings.find().sort({createdAt: -1}).limit(1).pretty()

# Expected output:
{
  ...
  "marketingConsent": {
    "granted": false,  // Should be false
    "capturedAt": ISODate("..."),
    "source": "checkout_form",
    "version": "1.0"
  },
  ...
}
```

**Expected Result:**
- ✅ Payment succeeds
- ✅ Booking created
- ✅ `marketingConsent.granted` is `false`
- ✅ All other fields still captured

---

### Test 1.3: Backward Compatibility

**Purpose:** Ensure existing bookings still work

**Steps:**
1. Query old bookings (if any exist):
```bash
db.bookings.find({marketingConsent: {$exists: false}}).limit(5)
```

2. Try to fetch these bookings through the application

**Expected Result:**
- ✅ Old bookings without consent field still accessible
- ✅ No errors when displaying old bookings
- ✅ Application handles missing field gracefully

---

### Test 1.4: Stripe Metadata Verification

**Steps:**
1. Complete a booking (Test 1.1)
2. Go to Stripe Dashboard: https://dashboard.stripe.com/test/payments
3. Find the latest payment
4. Click on it to view details
5. Scroll to "Metadata" section

**Expected Result:**
- ✅ `marketingConsent: true` or `marketingConsent: false` present in metadata
- ✅ Other booking metadata intact

---

## 🧪 Test Suite 2: Property Structured Data

### Test 2.1: Schema Presence in Source Code

**Steps:**
1. Navigate to: `https://secure-forms-2.preview.emergentagent.com/property/84656`
2. Right-click → View Page Source (Ctrl+U / Cmd+Option+U)
3. Search for: `"@type": "Accommodation"`
4. Verify JSON-LD script tag is present

**Expected Result:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Accommodation",
  "name": "Sunny Alps View: Central Bliss",
  "description": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Grächen",
    "addressCountry": "Switzerland"
  },
  "numberOfRooms": 2,
  "occupancy": {
    "@type": "QuantitativeValue",
    "maxValue": 5
  },
  "amenityFeature": [...]
}
</script>
```

**Verification:**
- ✅ Script tag with `type="application/ld+json"` found
- ✅ `@type: "Accommodation"` present
- ✅ Property details included
- ✅ Valid JSON format

---

### Test 2.2: Google Rich Results Validation

**Steps:**
1. Go to: https://search.google.com/test/rich-results
2. Enter property URL: `https://secure-forms-2.preview.emergentagent.com/property/84656`
3. Click "Test URL"
4. Wait for results

**Expected Result:**
- ✅ "Accommodation" type detected
- ✅ No errors shown
- ✅ All property fields validated
- ✅ Green checkmark for structured data

**Screenshot:** Save the results for documentation

---

### Test 2.3: Schema.org Validator

**Steps:**
1. Go to: https://validator.schema.org/
2. Paste the property URL
3. Click "Run Test"

**Expected Result:**
- ✅ Valid schema detected
- ✅ No critical errors
- ✅ All required fields present

---

### Test 2.4: Multiple Property Pages

**Test on at least 3 different properties:**
1. Property 84656
2. Property 84654
3. Property 84652

**Steps for each:**
1. View page source
2. Verify Accommodation schema present
3. Check that property-specific data is correct

**Expected Result:**
- ✅ Each property has unique structured data
- ✅ Names, addresses, amenities are property-specific
- ✅ No duplicate or incorrect data

---

## 🧪 Test Suite 3: Accessibility Enhancements

### Test 3.1: Screen Reader - NVDA (Windows)

**Prerequisites:**
- Install NVDA: https://www.nvaccess.org/download/
- Start NVDA (Ctrl+Alt+N)

**Test 3.1a: Filter Dropdowns**

**Steps:**
1. Navigate to: `/stay`
2. Tab to Location dropdown
3. Listen for announcement
4. Tab to Date Range dropdown
5. Listen for announcement
6. Tab to Guests dropdown
7. Listen for announcement
8. Tab to Bedrooms dropdown
9. Listen for announcement
10. Tab to Amenities dropdown
11. Listen for announcement

**Expected NVDA Announcements:**
- ✅ "Select location filter, button"
- ✅ "Select date range, button"
- ✅ "Select number of guests, button"
- ✅ "Select number of bedrooms, button"
- ✅ "Select amenities filter, button"

---

**Test 3.1b: Search Results Announcement**

**Steps:**
1. On `/stay` page with NVDA running
2. Apply a filter (e.g., select Grächen location)
3. Listen for announcement

**Expected Announcement:**
- ✅ "X properties found" (where X is the result count)
- ✅ Announcement happens without manual focus

---

**Test 3.1c: Form Validation**

**Steps:**
1. Navigate to checkout page
2. Leave First Name empty
3. Tab to submit button
4. Press Enter
5. Listen for error announcement

**Expected Announcement:**
- ✅ "Invalid" or error message for empty field
- ✅ Field is marked as required

---

### Test 3.2: Keyboard Navigation

**Test 3.2a: Property Cards Focus**

**Steps:**
1. Navigate to `/stay`
2. Use Tab key only (no mouse)
3. Tab through property cards
4. Observe focus indicators

**Expected Result:**
- ✅ Blue outline visible on focused card
- ✅ Outline thickness: 2px
- ✅ Focus moves logically (left to right, top to bottom)
- ✅ Focus doesn't skip any interactive elements
- ✅ Pressing Enter on card navigates to property page

---

**Test 3.2b: Filter Navigation**

**Steps:**
1. Tab to Location filter
2. Press Enter or Space
3. Use arrow keys to navigate options
4. Press Escape to close
5. Repeat for all filters

**Expected Result:**
- ✅ Filters open with Enter/Space
- ✅ Arrow keys work inside dropdowns
- ✅ Escape closes dropdown
- ✅ Focus returns to trigger button after closing

---

**Test 3.2c: Complete Booking Without Mouse**

**Challenge:** Complete entire booking using only keyboard

**Steps:**
1. Tab to property card
2. Press Enter
3. Tab to date inputs, enter dates
4. Tab to guests
5. Tab to Reserve button
6. Press Enter
7. Tab through checkout form
8. Fill all fields
9. Tab to payment fields
10. Complete payment

**Expected Result:**
- ✅ Entire flow possible with keyboard only
- ✅ No focus traps
- ✅ All interactive elements reachable
- ✅ Logical tab order maintained

---

### Test 3.3: Form Accessibility

**Test 3.3a: Label Associations**

**Steps:**
1. Go to checkout page
2. Inspect HTML of form fields
3. Verify each label has `htmlFor` matching input `id`

**Expected HTML:**
```html
<label htmlFor="firstName">First Name *</label>
<input id="firstName" name="firstName" ... />

<label htmlFor="lastName">Last Name *</label>
<input id="lastName" name="lastName" ... />

<label htmlFor="email">Email Address *</label>
<input id="email" name="email" ... />

<label htmlFor="phone">Phone Number *</label>
<input id="phone" name="phone" ... />
```

**Expected Result:**
- ✅ All labels properly associated
- ✅ Clicking label focuses input
- ✅ Screen readers announce label with input

---

**Test 3.3b: Required Field Indication**

**Inspect HTML:**
```html
<input 
  id="firstName" 
  required 
  aria-required="true" 
  ...
/>
```

**Expected Result:**
- ✅ Both `required` and `aria-required="true"` present
- ✅ Screen readers announce "required"
- ✅ Browser validation works

---

### Test 3.4: Color Contrast (WCAG AA)

**Tool:** Use WAVE Extension or Chrome DevTools

**Steps:**
1. Install WAVE: https://wave.webaim.org/extension/
2. Navigate to `/stay`
3. Click WAVE icon
4. Check for contrast errors

**WCAG AA Requirements:**
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio

**Expected Result:**
- ✅ No contrast errors on main content
- ✅ Property card text readable
- ✅ Button text has sufficient contrast
- ⚠️ Note any warnings for future improvement

---

### Test 3.5: Mobile Accessibility

**Test on Mobile Device or Emulator**

**Steps:**
1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro
4. Navigate to `/stay`
5. Test touch navigation
6. Test screen reader (VoiceOver on iOS)

**Expected Result:**
- ✅ All interactive elements tappable (44x44px minimum)
- ✅ No horizontal scrolling
- ✅ Zoom works properly
- ✅ Screen reader navigation logical

---

## 🔧 Test Suite 4: Regression Testing

### Test 4.1: Existing Functionality

**Purpose:** Ensure no existing features were broken

**Critical Flows to Test:**

**4.1a: Property Browsing**
1. Navigate to `/stay`
2. Verify all properties load
3. Apply each filter type
4. Verify filtering works correctly

**Expected:** ✅ All filters work as before

---

**4.1b: Property Detail Page**
1. Click on any property
2. Verify all sections load:
   - Images
   - Description
   - Amenities
   - Pricing
   - Availability calendar
   - Booking form

**Expected:** ✅ All sections display correctly

---

**4.1c: Booking Flow**
1. Select dates
2. Reserve property
3. Fill checkout form
4. Complete payment
5. Receive confirmation

**Expected:** ✅ Complete flow works without errors

---

**4.1d: Navigation**
1. Test header navigation
2. Test footer links
3. Test all menu items

**Expected:** ✅ All navigation works

---

### Test 4.2: Performance Check

**Use Chrome DevTools Lighthouse**

**Steps:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select categories: Performance, Accessibility, SEO
4. Click "Generate report"

**Expected Scores:**
- Performance: 80+ (acceptable for dev environment)
- Accessibility: 90+ (improved from before)
- SEO: 95+ (improved with structured data)

**Before vs After Comparison:**
- Document accessibility score before implementation
- Run Lighthouse after implementation
- Verify accessibility score increased

---

### Test 4.3: Cross-Browser Testing

**Test in These Browsers:**

**Desktop:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Mobile:**
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android

**For Each Browser:**
1. Navigate to `/stay`
2. Filter properties
3. Click on a property
4. Verify structured data in source
5. Complete a test booking
6. Verify consent stored in MongoDB

**Expected:** ✅ Consistent behavior across all browsers

---

### Test 4.4: Database Integrity

**Steps:**
```bash
# Check booking schema
db.bookings.findOne({}, {marketingConsent: 1})

# Count bookings with consent
db.bookings.countDocuments({marketingConsent: {$exists: true}})

# Count bookings without consent (old ones)
db.bookings.countDocuments({marketingConsent: {$exists: false}})

# Verify indexes still work
db.bookings.getIndexes()

# Test query performance
db.bookings.find({propertyId: "84656"}).explain("executionStats")
```

**Expected:**
- ✅ New bookings have marketingConsent field
- ✅ Old bookings still queryable
- ✅ No performance degradation
- ✅ All indexes intact

---

## 📊 Test Results Template

### Test Execution Log

**Tester:** _______________  
**Date:** _______________  
**Environment:** Production / Staging / Local

| Test ID | Test Name | Status | Notes | Tester |
|---------|-----------|--------|-------|--------|
| 1.1 | Consent Granted | ⬜ | | |
| 1.2 | Consent Not Granted | ⬜ | | |
| 1.3 | Backward Compatibility | ⬜ | | |
| 1.4 | Stripe Metadata | ⬜ | | |
| 2.1 | Schema in Source | ⬜ | | |
| 2.2 | Google Rich Results | ⬜ | | |
| 2.3 | Schema.org Validator | ⬜ | | |
| 2.4 | Multiple Properties | ⬜ | | |
| 3.1a | Filter ARIA Labels | ⬜ | | |
| 3.1b | Results Announcement | ⬜ | | |
| 3.1c | Form Validation | ⬜ | | |
| 3.2a | Card Focus | ⬜ | | |
| 3.2b | Filter Navigation | ⬜ | | |
| 3.2c | Keyboard Booking | ⬜ | | |
| 3.3a | Label Associations | ⬜ | | |
| 3.3b | Required Fields | ⬜ | | |
| 3.4 | Color Contrast | ⬜ | | |
| 3.5 | Mobile Accessibility | ⬜ | | |
| 4.1a | Property Browsing | ⬜ | | |
| 4.1b | Detail Page | ⬜ | | |
| 4.1c | Booking Flow | ⬜ | | |
| 4.1d | Navigation | ⬜ | | |
| 4.2 | Performance | ⬜ | | |
| 4.3 | Cross-Browser | ⬜ | | |
| 4.4 | Database Integrity | ⬜ | | |

**Legend:**  
✅ Pass | ❌ Fail | ⚠️ Warning | ⬜ Not Tested

---

## 🚨 Issue Tracking

If any test fails, document here:

### Issue Template

**Issue #:** ___  
**Test ID:** ___  
**Severity:** Critical / High / Medium / Low  
**Description:** ___  
**Steps to Reproduce:** ___  
**Expected:** ___  
**Actual:** ___  
**Browser/Device:** ___  
**Screenshots:** ___  

---

## ✅ Sign-Off

### Development Team
- [ ] All code changes reviewed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] No console errors

**Signed:** _______________ Date: _______________

### QA Team
- [ ] All test cases executed
- [ ] No critical bugs found
- [ ] Accessibility verified
- [ ] Cross-browser tested

**Signed:** _______________ Date: _______________

### Product Owner
- [ ] All MVP requirements met
- [ ] GDPR compliance verified
- [ ] SEO improvements confirmed
- [ ] Ready for production

**Signed:** _______________ Date: _______________

---

## 📚 Additional Resources

**Accessibility Testing Tools:**
- NVDA: https://www.nvaccess.org/
- WAVE: https://wave.webaim.org/
- axe DevTools: https://www.deque.com/axe/devtools/
- Lighthouse: Chrome DevTools

**Schema.org Validators:**
- Google Rich Results: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

**Stripe Testing:**
- Test Cards: https://stripe.com/docs/testing
- Dashboard: https://dashboard.stripe.com/test/payments

**MongoDB Queries:**
- Connection: `mongosh`
- Database: `use swissalpine`
- Collections: `show collections`

---

**Last Updated:** December 10, 2025  
**Version:** 1.0  
**Status:** Ready for Testing
