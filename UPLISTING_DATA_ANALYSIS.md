# 🔍 Uplisting Property Data Analysis & Implementation Plan

## 📊 Current vs. Required Implementation

### ❌ What We're MISSING (Critical Issues)

Based on actual Uplisting API data, we are **NOT using**:

#### 1. **Dynamic Taxes (Currently Broken)**
**What Uplisting Provides:**
```json
"taxes": [
  {
    "name": "Per booking percentage",
    "type": "percentage",
    "per": "booking",
    "amount": 3.8  // ← This is the actual tax rate!
  },
  {
    "name": "Per person per night",
    "type": "fixed",
    "per": "person_per_night",
    "amount": 3  // ← Tourist tax per person per night
  }
]
```

**What We're Using:**
```javascript
const VAT_RATE = 7.7;  // ← HARDCODED WRONG!
```

**Reality Check:**
- Property has **3.8% booking tax** + **CHF 3 per person/night tourist tax**
- We're charging **7.7% flat** = INCORRECT PRICING!

---

#### 2. **Extra Guest Charges (Not Applied)**
**What Uplisting Provides:**
```json
"fees": [
  {
    "name": "Extra guest charge",
    "guests_included": 4,
    "amount": 30  // ← CHF 30 per extra guest beyond 4
  }
]
```

**What We're Doing:**
```javascript
// Nothing! We ignore extra guest fees completely
```

**Impact:**
- If 5 guests book, we should charge +CHF 30
- Currently: We charge same as 4 guests = REVENUE LOSS!

---

#### 3. **Minimum Stay Requirements (Not Enforced)**
**What Uplisting Provides:**
```json
"minimum_length_of_stay": 2  // ← Must book at least 2 nights
```

**What We're Doing:**
- Allow 1-night bookings ❌
- No validation on frontend ❌
- No validation on backend ❌

**Impact:**
- Users can book 1 night when property requires 2 nights
- Booking will fail in Uplisting = BAD UX!

---

#### 4. **Maximum Capacity (Not Enforced)**
**What Uplisting Provides:**
```json
"maximum_capacity": 5  // ← Max 5 guests total
```

**What We're Doing:**
- Allow unlimited guests ❌
- No validation ❌

**Impact:**
- User can select 10 guests, proceed to payment
- Booking fails = WASTED TIME!

---

#### 5. **Daily Rate Variations (Partially Used)**
**What Uplisting Provides:**
```json
"days": [
  {"date": "2025-11-07", "day_rate": 95},
  {"date": "2025-11-08", "day_rate": 95},
  {"date": "2025-11-09", "day_rate": 99}  // ← Weekend rate higher
]
```

**What We're Using:**
- Total only (sum is correct)
- But we don't show daily breakdown

**Better UX:**
- Show daily rates to users
- Highlight weekend/peak pricing

---

## 🎯 Complete List of Uplisting Attributes

### **Property Data (`/api/properties/[id]`)**

| Attribute | Current Use | Should Use |
|-----------|-------------|------------|
| `maximum_capacity` | ❌ Not enforced | ✅ Validate guest count |
| `bedrooms` | ✅ Display only | ✅ Keep |
| `beds` | ✅ Display only | ✅ Keep |
| `bathrooms` | ✅ Display only | ✅ Keep |
| `check_in_time` | ❌ Not shown | ✅ Show on booking |
| `check_out_time` | ❌ Not shown | ✅ Show on booking |
| `type` | ✅ Display | ✅ Keep |
| `currency` | ✅ Used | ✅ Keep |

### **Fees (`property.fees`)**

| Fee Type | Current Use | Should Use |
|----------|-------------|------------|
| `cleaning_fee` | ✅ Added to total | ✅ Keep |
| `extra_guest_charge` | ❌ IGNORED | ✅ Calculate if guests > guests_included |

### **Taxes (`property.taxes`)**

| Tax Type | Current Use | Should Use |
|----------|-------------|------------|
| `per_booking_percentage` | ❌ Using 7.7% hardcoded | ✅ Use actual rate (3.8%) |
| `per_booking_amount` | ❌ Not used | ✅ Add fixed tax if > 0 |
| `per_night` | ❌ Not used | ✅ Add per-night tax if > 0 |
| `per_person_per_night` | ❌ Not used | ✅ Add tourist tax (CHF 3/person/night) |

### **Availability Constraints (`/api/availability/[propertyId]`)**

| Constraint | Current Use | Should Use |
|------------|-------------|------------|
| `minimum_length_of_stay` | ❌ Not enforced | ✅ Block bookings < min nights |
| `maximum_available_nights` | ❌ Not enforced | ✅ Block bookings > max nights |
| `closed_for_arrival` | ❌ Not checked | ✅ Disable check-in on these dates |
| `closed_for_departure` | ❌ Not checked | ✅ Disable check-out on these dates |
| `available` | ✅ Checked | ✅ Keep |
| `day_rate` | ✅ Summed | ✅ Also show breakdown |

---

## 💰 Correct Pricing Formula

### **Current (WRONG):**
```
Accommodation Total = Sum of day_rates
Cleaning Fee = 169
Subtotal = Accommodation + Cleaning
VAT (7.7%) = Subtotal × 0.077
Total = Subtotal + VAT
```

### **Correct (According to Uplisting):**
```
Accommodation Total = Sum of day_rates
Cleaning Fee = 169

Extra Guest Fee = IF (guests > guests_included) THEN 
                    (guests - guests_included) × 30
                  ELSE 0

Subtotal = Accommodation + Cleaning + Extra Guest

Percentage Tax (3.8%) = Subtotal × 0.038
Fixed Booking Tax = 0 (if amount > 0)
Per Night Tax = nights × amount (if amount > 0)
Tourist Tax = guests × nights × 3

Total Tax = Percentage Tax + Fixed Booking Tax + Per Night Tax + Tourist Tax

Grand Total = Subtotal + Total Tax
```

---

## 📋 Example Calculation

### **Scenario:** 2 nights, 5 guests (Nov 7-9)

**Current Calculation (WRONG):**
```
Accommodation: CHF 190 (95+95)
Cleaning: CHF 169
Subtotal: CHF 359
VAT (7.7%): CHF 28
Total: CHF 387 ← WRONG!
```

**Correct Calculation:**
```
Accommodation: CHF 190 (95+95)
Cleaning: CHF 169
Extra Guest: CHF 30 (5 guests - 4 included = 1 extra)
Subtotal: CHF 389

Taxes:
- Booking Tax (3.8%): CHF 15 (389 × 0.038)
- Tourist Tax: CHF 30 (5 guests × 2 nights × CHF 3)
Total Tax: CHF 45

Grand Total: CHF 434 ← CORRECT!
```

**Difference:** CHF 47 (12% error!)

---

## 🎯 Implementation Impact

### **Files That Need Changes:**

#### **1. Pricing Calculation**
- `/app/lib/pricing-calculator.js` - Complete rewrite
- `/app/app/api/stripe/create-payment-intent/route.js` - Use new calculator
- `/app/app/checkout/page.js` - Display all fee/tax lines

#### **2. Validation**
- `/app/app/property/[id]/page.js` - Enforce max capacity
- `/app/components/SearchBar.js` - Validate guest count
- `/app/app/checkout/page.js` - Validate before payment

#### **3. Constraints**
- `/app/app/property/[id]/page.js` - Show min/max nights
- `/app/app/checkout/page.js` - Enforce min nights
- Date picker - Disable invalid dates

#### **4. Display**
- `/app/components/PropertyCard.js` - Show constraints
- `/app/app/stay/page.js` - Filter by guest capacity
- `/app/app/checkout/page.js` - Complete fee/tax breakdown

---

## 🚀 Implementation Plan

### **Phase 1: Fix Pricing (CRITICAL)**
1. Rewrite pricing calculator to use Uplisting taxes/fees
2. Add extra guest fee calculation
3. Add tourist tax (per person/night)
4. Update checkout price breakdown
5. Verify Stripe payment matches

**Estimated Time:** 2-3 hours
**Token Budget:** ~25,000 tokens

### **Phase 2: Add Validation (HIGH)**
1. Enforce maximum capacity
2. Enforce minimum stay
3. Enforce maximum stay
4. Block closed dates
5. Show error messages

**Estimated Time:** 1-2 hours
**Token Budget:** ~15,000 tokens

### **Phase 3: Improve UX (MEDIUM)**
1. Show check-in/check-out times
2. Show daily rate breakdown
3. Show booking constraints on property page
4. Add constraint filters to listings page

**Estimated Time:** 1-2 hours
**Token Budget:** ~15,000 tokens

### **Phase 4: Testing (REQUIRED)**
1. Test all property types
2. Test different guest counts
3. Test different night lengths
4. Test constraint enforcement
5. Verify pricing accuracy

**Estimated Time:** 1 hour
**Token Budget:** ~10,000 tokens

**Total Estimated:** 5-8 hours, 65,000 tokens

---

## ⚠️ Critical Issues to Fix First

### **Priority 1: Incorrect Tax Calculation**
- **Impact:** Charging wrong amounts
- **Risk:** Legal compliance, revenue loss
- **Fix:** Use Uplisting tax rates

### **Priority 2: Missing Extra Guest Fees**
- **Impact:** Revenue loss on 5-guest bookings
- **Risk:** Financial
- **Fix:** Calculate extra guest charges

### **Priority 3: No Minimum Stay Enforcement**
- **Impact:** Bookings fail, bad UX
- **Risk:** Customer satisfaction
- **Fix:** Validate minimum nights

### **Priority 4: No Max Capacity Enforcement**
- **Impact:** Invalid bookings
- **Risk:** Customer frustration
- **Fix:** Validate guest count

---

## ✅ Recommendation

**Should we proceed with:**

**Option A: Complete Rewrite** (Recommended)
- Fix ALL issues in one go
- Estimated 65,000 tokens
- 5-8 hours of work
- Clean, correct implementation

**Option B: Incremental Fix**
- Phase 1 first (pricing)
- Then Phase 2 (validation)
- Then Phase 3 (UX)
- Spread across multiple sessions

**Option C: Quick Fix**
- Just fix tax calculation (use 3.8% + tourist tax)
- Leave other issues for later
- ~10,000 tokens, 1 hour

---

## 📊 Current Token Budget

- **Used:** ~107,000 / 200,000
- **Remaining:** ~93,000 tokens
- **Needed for Complete Fix:** ~65,000 tokens
- **Buffer Remaining:** ~28,000 tokens

✅ **We have enough tokens for complete implementation!**

---

## 🎯 Next Steps

Please confirm:
1. Which option do you prefer? (A, B, or C)
2. Should I proceed with implementation?
3. Any specific properties/scenarios to prioritize?

I recommend **Option A** - let's fix everything properly in one go!
