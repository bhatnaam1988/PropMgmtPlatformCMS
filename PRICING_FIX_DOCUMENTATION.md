# 🎯 Pricing Calculation Fix - Documentation

**Issue Fixed:** Date interpretation mismatch between website and Uplisting causing incorrect nightly rate calculations  
**Date:** December 2, 2025  
**Status:** ✅ FIXED & TESTED

---

## 🔍 Problem Description

### The Issue:
Our website and Uplisting were using different interpretations of "date" for nightly rates, causing price mismatches.

### Example Booking:
- **Check-in:** January 6, 2026
- **Check-out:** January 9, 2026  
- **Nights:** 3 nights

### Old (Incorrect) Calculation:
Our website used rates for: **6th, 7th, 8th January**
- Date 6th: CHF 212
- Date 7th: CHF 216
- Date 8th: CHF 218
- **Average:** (212 + 216 + 218) / 3 = **CHF 215.33**

### Correct Calculation (Uplisting):
Uplisting uses rates for: **7th, 8th, 9th January**
- Date 7th: CHF 216
- Date 8th: CHF 218
- Date 9th: CHF 222
- **Average:** (216 + 218 + 222) / 3 = **CHF 218.66**

### Why This Happens:
**Uplisting's Logic:** Calendar dates represent the **morning you wake up**, not the night you start sleeping.

When you check in on Jan 6th:
- You arrive afternoon/evening of the 6th
- **Night 1:** Sleep from 6th→7th (**uses 7th rate**)
- **Night 2:** Sleep from 7th→8th (**uses 8th rate**)
- **Night 3:** Sleep from 8th→9th (**uses 9th rate**)
- You leave morning of the 9th

So the calculation should use rates from **checkIn + 1 day** through **checkOut** (exclusive of departure date).

---

## ✅ Solution Implemented

### 1. New Function: `calculateAccommodationTotal()`

Created in `/app/lib/uplisting.js`:

```javascript
calculateAccommodationTotal(calendarData, checkInDate, checkOutDate)
```

**What it does:**
- Takes calendar data + specific check-in/check-out dates
- Calculates rates for the CORRECT nights (checkIn+1 through checkOut)
- Uses CHF 300 fallback for missing rates
- Returns detailed breakdown with fallback tracking
- Matches Uplisting's date interpretation exactly

**Logic:**
```
Check-in: Jan 6
Check-out: Jan 9

For each night (1 to 3):
  Night 1: Jan 6 + 1 day = Jan 7 → Use rate for Jan 7
  Night 2: Jan 6 + 2 days = Jan 8 → Use rate for Jan 8
  Night 3: Jan 6 + 3 days = Jan 9 → Use rate for Jan 9

Total = rate(Jan 7) + rate(Jan 8) + rate(Jan 9)
```

### 2. Old Function Preserved

The old `calculatePricing()` function is **still available** and marked with comments:
```javascript
// NOTE: This function is used for BROWSING/LISTING pages
// For BOOKING calculations, use calculateAccommodationTotal() instead
```

**Preserved for:**
- Property listing pages (Stay page)
- Average rate displays
- Calendar browsing
- Non-booking contexts

---

## 🚨 Fallback Rate Handling

### Strategy:
When rates are missing from Uplisting, we use fallback rates and notify admin.

### Scenarios:

**1. No rates available for entire stay**
- **Action:** Use CHF 300/night for all nights
- **Email:** Critical alert sent to admin
- **Booking:** Proceeds with fallback pricing

**2. Partial rates available**
- **Action:** Use actual rates where available, CHF 300 for missing dates
- **Email:** Warning alert sent to admin
- **Booking:** Proceeds with mixed pricing

### Email Notifications:

**Implemented in `/app/lib/email-alerts.js`:**

1. **`sendMissingRatesAlert()`** - For partial missing rates
   - Lists specific dates with missing rates
   - Shows fallback amounts used
   - Provides action steps for admin

2. **`sendNoRatesAlert()`** - For complete missing rates
   - Critical priority alert
   - Shows total fallback cost
   - Urgent action required

**Email Content Includes:**
- Property ID and name
- Check-in and check-out dates
- List of dates with missing rates
- Fallback rate used (CHF 300)
- Booking ID (if available)
- Action items for admin

---

## 📁 Files Modified

### 1. `/app/lib/uplisting.js`
**Changes:**
- Added `calculateAccommodationTotal()` function
- Preserved `calculatePricing()` with comment for reference
- Implements Uplisting's date logic correctly

### 2. `/app/lib/email-alerts.js` (NEW FILE)
**Purpose:**
- Email notification system for missing rates
- Two alert types: partial and complete missing rates
- Uses Resend API for email delivery

### 3. `/app/app/api/availability/[propertyId]/route.js`
**Changes:**
- Added `forBooking` query parameter
- Routes to `calculateAccommodationTotal()` when `forBooking=true`
- Triggers email alerts when fallback rates used
- Keeps old logic for browsing context

### 4. `/app/app/property/[id]/page.js`
**Changes:**
- Updated `fetchPricing()` to include `forBooking=true` parameter
- Now gets accurate accommodation total

### 5. `/app/app/checkout/page.js`
**Changes:**
- Updated pricing fetch to include `forBooking=true` parameter
- Ensures checkout uses correct calculation

---

## 🧪 Testing

### Test Case 1: Normal Booking with All Rates Available
**Scenario:** Book Jan 6 → Jan 9 (3 nights), all rates present

**Expected Behavior:**
- Uses rates for Jan 7, 8, 9
- Matches Uplisting dashboard exactly
- No fallback rates used
- No email alerts sent

**Test:**
```bash
GET /api/availability/84656?from=2026-01-06&to=2026-01-09&forBooking=true

Expected Response:
{
  "pricing": {
    "total": 656,  // 216 + 218 + 222
    "averageRate": 218.66,
    "totalNights": 3,
    "nightlyBreakdown": [
      { "date": "2026-01-07", "rate": 216, "isFallback": false },
      { "date": "2026-01-08", "rate": 218, "isFallback": false },
      { "date": "2026-01-09", "rate": 222, "isFallback": false }
    ],
    "usedFallback": false
  }
}
```

### Test Case 2: Booking with Partial Missing Rates
**Scenario:** Book Jan 6 → Jan 9, rate for Jan 8 missing

**Expected Behavior:**
- Uses actual rates for Jan 7 and Jan 9
- Uses CHF 300 fallback for Jan 8
- Email alert sent to admin about missing rate
- Booking proceeds

**Expected Response:**
```json
{
  "pricing": {
    "total": 738,  // 216 + 300 + 222
    "averageRate": 246,
    "totalNights": 3,
    "nightlyBreakdown": [
      { "date": "2026-01-07", "rate": 216, "isFallback": false },
      { "date": "2026-01-08", "rate": 300, "isFallback": true },
      { "date": "2026-01-09", "rate": 222, "isFallback": false }
    ],
    "usedFallback": true,
    "missingRates": [
      { "date": "2026-01-08", "nightNumber": 2, "fallbackRate": 300 }
    ]
  }
}
```

**Email Alert:** ⚠️ Warning email sent to admin

### Test Case 3: Booking with All Missing Rates
**Scenario:** Book dates with no rates in Uplisting

**Expected Behavior:**
- Uses CHF 300 for all nights
- Critical email alert sent to admin
- Booking proceeds

**Expected Response:**
```json
{
  "pricing": {
    "total": 900,  // 300 + 300 + 300
    "averageRate": 300,
    "totalNights": 3,
    "nightlyBreakdown": [
      { "date": "2026-01-07", "rate": 300, "isFallback": true },
      { "date": "2026-01-08", "rate": 300, "isFallback": true },
      { "date": "2026-01-09", "rate": 300, "isFallback": true }
    ],
    "usedFallback": true
  }
}
```

**Email Alert:** 🚨 Critical email sent to admin

---

## 🎯 Date Calculation Examples

### Example 1: 3-Night Stay
```
Check-in: 2026-01-06
Check-out: 2026-01-09
Nights: 3

Rates calculated for:
- Night 1: Jan 7 (check-in + 1 day)
- Night 2: Jan 8 (check-in + 2 days)
- Night 3: Jan 9 (check-in + 3 days)
```

### Example 2: 1-Night Stay
```
Check-in: 2026-01-06
Check-out: 2026-01-07
Nights: 1

Rates calculated for:
- Night 1: Jan 7 (check-in + 1 day)
```

### Example 3: 7-Night Stay
```
Check-in: 2026-01-06
Check-out: 2026-01-13
Nights: 7

Rates calculated for:
- Night 1: Jan 7
- Night 2: Jan 8
- Night 3: Jan 9
- Night 4: Jan 10
- Night 5: Jan 11
- Night 6: Jan 12
- Night 7: Jan 13
```

---

## 📊 API Changes

### New Query Parameter: `forBooking`

**Usage:**
```
GET /api/availability/{propertyId}?from={date}&to={date}&forBooking=true
```

**When to use:**
- **`forBooking=true`** → Use for booking/checkout calculations (accurate accommodation total)
- **`forBooking=false`** or omitted → Use for browsing/listing pages (average rates)

**Response Differences:**

**Browsing Mode (forBooking=false):**
```json
{
  "pricing": {
    "averageRate": 215,
    "total": 645,
    "available": true
  }
}
```

**Booking Mode (forBooking=true):**
```json
{
  "pricing": {
    "total": 656,
    "averageRate": 218.66,
    "totalNights": 3,
    "nightlyBreakdown": [...],
    "usedFallback": false,
    "available": true
  }
}
```

---

## ⚠️ Important Notes

### Backwards Compatibility:
- ✅ Old `calculatePricing()` still works for listings
- ✅ No breaking changes to existing functionality
- ✅ Property listing pages unaffected
- ✅ Only booking flow uses new calculation

### Email Configuration:
**Required Environment Variables:**
```bash
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@swissalpinejourney.com
```

### Fallback Rate:
- Default: **CHF 300 per night**
- Can be adjusted in `calculateAccommodationTotal()` function
- Constant: `FALLBACK_RATE` in `/app/lib/uplisting.js`

---

## 🔄 Migration Notes

### No Migration Required:
- Changes are transparent to existing bookings
- No database changes needed
- No data migration required
- Immediate effect on new bookings

### Testing Checklist:
- [x] Verify date calculation matches Uplisting
- [x] Test with all rates available
- [x] Test with partial missing rates
- [x] Test with all missing rates
- [x] Verify email alerts sent
- [x] Check fallback rate applied correctly
- [x] Confirm old listing pages still work

---

## 📧 Email Alert Examples

### Partial Missing Rates Alert:
```
Subject: ⚠️ Missing Price Data in Uplisting - Property 84656

A booking was made with missing rate data from Uplisting.

Property Details:
- Property ID: 84656
- Check-in: 2026-01-06
- Check-out: 2026-01-09

Missing Rates for Dates:
  • 2026-01-08 (Night 2) - Used fallback: CHF 300

ACTION REQUIRED:
1. Log into Uplisting dashboard
2. Navigate to property: 84656
3. Update pricing for the missing dates
```

### Complete Missing Rates Alert:
```
Subject: 🚨 No Price Data in Uplisting - Property 84656

All rates were missing for a booking. Complete fallback pricing was used.

Property Details:
- Property ID: 84656
- Check-in: 2026-01-06
- Check-out: 2026-01-09
- Nights: 3
- Total Fallback Cost: CHF 900

⚠️ URGENT ACTION REQUIRED:
1. IMMEDIATELY check Uplisting calendar
2. Verify pricing is set for these dates
3. Update any missing rates
4. Review calendar sync settings
```

---

## 🎓 Key Takeaways

1. **Date Interpretation:** Uplisting dates = morning you wake up (not night you start sleeping)
2. **Calculation:** Use checkIn+1 through checkOut for nightly rates
3. **Fallback Strategy:** CHF 300/night when rates missing + email admin
4. **Backwards Compatible:** Old logic preserved for non-booking contexts
5. **Email Alerts:** Admin notified immediately when fallback used
6. **No Data Migration:** Changes transparent to existing system

---

## 📚 Related Documentation

- **Uplisting API:** https://connect.uplisting.io/docs
- **Booking Flow:** See `/app/BOOKING_FLOW.md`
- **Security:** See `/app/SECURITY_SUMMARY.md`

---

**Last Updated:** December 2, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready

**Fix Verified:** Pricing now matches Uplisting dashboard exactly
