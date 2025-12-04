# 📐 Per Night Rate Display - Ceiling Fix

**Issue:** Per night rates should display as whole numbers (rounded up)  
**Date:** December 2, 2025  
**Status:** ✅ IMPLEMENTED

---

## 🎯 Requirement

**Display Rule:** Per night rates must show whole numbers using ceiling (round up)  
**Calculation Rule:** Internal calculations must keep decimal precision  
**Tax Rule:** Tax calculations MUST use decimal values (no rounding)

---

## 📊 Examples

### Before Fix:
```
Average Rate: 218.66 CHF/night
Display: "CHF 218.66/night"
```

### After Fix:
```
Average Rate: 218.66 CHF/night (internal calculation)
Display: "CHF 219/night" (ceiling applied for display only)
```

### Tax Calculation (Unaffected):
```
Tourist Tax: 2.50 CHF per person per night
Calculation: 2.50 × 2 guests × 3 nights = 15.00 CHF
✅ Uses decimal precision (no rounding)
```

---

## 🔧 Implementation

### 1. New Function Created

**File:** `/app/lib/currency-formatter.js`

```javascript
/**
 * Format per night rate as whole number using ceiling (round up)
 * - Always rounds UP to nearest whole number for display
 * - Used specifically for per night rate displays
 * - Does NOT affect internal calculations (those use decimal precision)
 * 
 * Example: 218.66 → "219"
 */
export function formatPerNightRate(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  // Use Math.ceil to round up to nearest whole number
  return Math.ceil(value).toString();
}
```

**Also added:**
```javascript
/**
 * Format per night rate with symbol (using ceiling)
 */
export function formatPerNightRateWithSymbol(value, currency = 'CHF') {
  return `${currency} ${formatPerNightRate(value)}`;
}
```

---

## 📁 Files Modified

### 1. `/app/lib/currency-formatter.js`
**Changes:**
- Added `formatPerNightRate()` function
- Added `formatPerNightRateWithSymbol()` function

### 2. `/app/app/stay/page.js`
**Changes:**
- Import: Added `formatPerNightRate`
- Lines 294, 296: Changed from `formatCurrency()` to `formatPerNightRate()`

**Before:**
```javascript
priceDisplay = `${currency} ${formatCurrency(pricing.averageRate)}/night`;
```

**After:**
```javascript
priceDisplay = `${currency} ${formatPerNightRate(pricing.averageRate)}/night`;
```

### 3. `/app/app/checkout/page.js`
**Changes:**
- Import: Added `formatPerNightRate`
- Line 563: Changed from `formatCurrency()` to `formatPerNightRate()`

**Before:**
```javascript
{currency} {formatCurrency(pricing?.averageRate || 0)} x {nights} night{nights > 1 ? 's' : ''}
```

**After:**
```javascript
{currency} {formatPerNightRate(pricing?.averageRate || 0)} x {nights} night{nights > 1 ? 's' : ''}
```

### 4. `/app/app/property/[id]/page.js`
**Changes:**
- Import: Added `formatPerNightRate`
- Line 484: Per night rate display (large 3xl text)
- Line 790: Booking breakdown per night display

**Before:**
```javascript
<span className="text-3xl font-medium">{currency} {basePrice}</span>
```

**After:**
```javascript
<span className="text-3xl font-medium">{currency} {formatPerNightRate(basePrice)}</span>
```

---

## ✅ What Changed (Display Only)

### Changed to Ceiling:
1. **Property Listing Page** (Stay page)
   - Per night rate display: `219/night` (was `218.66/night`)

2. **Property Detail Page**
   - Large per night rate: `CHF 219 / night` (was `CHF 218.66 / night`)
   - Booking breakdown: `CHF 219 x 3 nights` (was `CHF 218.66 x 3 nights`)

3. **Checkout Page**
   - Price breakdown: `CHF 219 x 3 nights` (was `CHF 218.66 x 3 nights`)

---

## ✅ What Didn't Change (Decimal Preserved)

### Still Uses Decimals:
1. **Total Accommodation Price**
   - Still: `CHF 656.00` (216 + 218 + 222)
   - Calculation unchanged ✅

2. **Tax Calculations**
   - Tourist tax: `2.50 × guests × nights`
   - Percentage tax: `subtotal × (rate / 100)`
   - All use decimal precision ✅

3. **Subtotal Calculations**
   - Accommodation + Fees + Cleaning
   - All decimal math preserved ✅

4. **Final Total**
   - Sum of all components with decimals
   - Displayed with 2 decimal places ✅

---

## 🧪 Verification

### Test Case: Jan 6 → Jan 9, 2026 (3 nights)

**Internal Calculation:**
```json
{
  "total": 656,
  "averageRate": 218.66666666666666,
  "nightlyBreakdown": [
    {"date": "2026-01-07", "rate": 216},
    {"date": "2026-01-08", "rate": 218},
    {"date": "2026-01-09", "rate": 222}
  ]
}
```

**Display Results:**

| Location | Display | Internal Value |
|----------|---------|----------------|
| Stay Page | `CHF 219/night` | 218.66 |
| Property Detail | `CHF 219 / night` | 218.66 |
| Booking Widget | `CHF 219 x 3 nights` | 218.66 |
| Checkout | `CHF 219 x 3 nights` | 218.66 |
| **Total** | `CHF 656` | 656 |

**Tax Calculation Example:**
```
Tourist Tax: CHF 2.50 per person per night
Guests: 2
Nights: 3

Calculation: 2.50 × 2 × 3 = 15.00 CHF
✅ Uses decimal: 2.50 (not rounded to 3)
```

---

## 💡 Why This Approach?

### Benefits of Display-Only Rounding:

1. **Clean UI:** Whole numbers easier to read
   - "CHF 219/night" cleaner than "CHF 218.66/night"

2. **Accurate Calculations:** Decimals preserved
   - Booking total: 656 (not 657 from 219 × 3)
   - Taxes calculated precisely

3. **Standard Practice:** Round up for per-unit prices
   - Hotels show per night rates as whole numbers
   - Internal calculations stay precise

4. **No Breaking Changes:**
   - Totals remain accurate
   - Tax calculations unaffected
   - Only display formatting changed

---

## 🎓 Technical Details

### Math.ceil() Usage

**Only used for display:**
```javascript
// Display formatting only
export function formatPerNightRate(value) {
  return Math.ceil(value).toString();
}
```

**NOT used in calculations:**
```javascript
// Tax calculation - uses decimals
taxAmount = attrs.amount * guests * nights; // e.g., 2.50 × 2 × 3 = 15.00

// Accommodation total - uses actual rates
total = 216 + 218 + 222; // = 656 (not 219 × 3 = 657)
```

### Existing formatCurrency() Unchanged

**Still used for:**
- Total prices
- Tax amounts
- Cleaning fees
- Final totals

**Behavior:**
- Shows decimals when needed: `28.42`
- Hides decimals for whole numbers: `169`

---

## 📋 Testing Checklist

- [x] Per night rates show whole numbers (ceiling)
- [x] Total accommodation price unchanged
- [x] Tax calculations use decimals
- [x] Percentage tax calculations accurate
- [x] Per person per night tax accurate
- [x] Final totals match calculations
- [x] No rounding errors in totals
- [x] Display consistent across all pages

---

## 🔄 Examples Across System

### Example 1: Average Rate 218.66

**Display:**
- Stay page: "CHF 219/night"
- Property page: "CHF 219 / night"
- Checkout: "CHF 219 x 3 nights"

**Calculation:**
- Actual rates used: 216 + 218 + 222 = 656
- Average: 656 ÷ 3 = 218.67
- Display ceiling: ⌈218.67⌉ = 219
- Total remains: 656 (not 219 × 3 = 657)

### Example 2: Average Rate 205.33

**Display:**
- Shows: "CHF 206/night"

**Calculation:**
- Actual rates: 200 + 205 + 211 = 616
- Average: 616 ÷ 3 = 205.33
- Display ceiling: ⌈205.33⌉ = 206
- Total remains: 616 (not 206 × 3 = 618)

### Example 3: Tourist Tax 2.50 CHF

**Display:**
- Shows: "CHF 2.50 per guest per night"

**Calculation:**
- 2.50 × 2 guests × 3 nights = 15.00
- ✅ Uses decimal 2.50 (not rounded to 3)
- Result: Exactly CHF 15.00

---

## ⚠️ Important Notes

### Do NOT Use formatPerNightRate() For:
- ❌ Total prices
- ❌ Tax amounts
- ❌ Cleaning fees
- ❌ Subtotals
- ❌ Any calculations

### Use formatPerNightRate() ONLY For:
- ✅ "Per night" rate displays
- ✅ "/night" labels
- ✅ Average nightly rate displays

### Always Use formatCurrency() For:
- ✅ Total amounts
- ✅ Tax line items
- ✅ Fee amounts
- ✅ Subtotal displays
- ✅ Final grand total

---

## 🎯 Success Criteria

| Criteria | Status |
|----------|--------|
| Per night rates show whole numbers | ✅ |
| Uses ceiling (round up) | ✅ |
| Internal calculations unchanged | ✅ |
| Tax calculations use decimals | ✅ |
| Total prices accurate | ✅ |
| No rounding errors | ✅ |
| UI cleaner and easier to read | ✅ |
| Backwards compatible | ✅ |

---

## 🚀 Deployment Status

**Ready for Production:** ✅ YES

**Changes:**
- Display formatting only
- No breaking changes
- No database changes
- Immediate effect

**Testing:**
- ✅ Verified per night displays
- ✅ Verified total calculations
- ✅ Verified tax calculations
- ✅ Verified decimal preservation

---

**Last Updated:** December 2, 2025  
**Status:** ✅ Complete  
**Impact:** Display only (calculations unchanged)
