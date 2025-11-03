# 🚀 Detailed Implementation Plan - Uplisting Data-Driven Refactor

## 📊 Executive Summary

**Goal:** Make the entire booking system data-driven using Uplisting property attributes
**Duration:** 4-5 hours
**Token Budget:** ~45,000 tokens
**Files Modified:** 7 core files
**Risk Level:** Medium (pricing changes, but with thorough testing)

---

## 🎯 Phase-by-Phase Breakdown

### **PHASE 1: Rewrite Pricing Calculator** (Critical Priority)
**Time:** 1.5 hours | **Tokens:** ~15,000

#### **1.1 Create New Pricing Calculator**

**File:** `/app/lib/pricing-calculator.js`

**Current Function:**
```javascript
export function calculateBookingPrice({ accommodationTotal, cleaningFee, nights }) {
  const VAT_RATE = 7.7; // HARDCODED!
  const subtotal = accommodationTotal + cleaningFee;
  const vatAmount = Math.round(subtotal * (VAT_RATE / 100));
  return {
    subtotal,
    vatAmount,
    grandTotal: subtotal + vatAmount
  };
}
```

**New Function:**
```javascript
export function calculateBookingPrice({
  accommodationTotal,
  cleaningFee,
  nights,
  adults,
  children,
  infants,
  propertyFees,    // NEW: from Uplisting
  propertyTaxes    // NEW: from Uplisting
}) {
  // 1. Calculate base costs
  const totalGuests = adults + children + infants;
  
  // 2. Calculate extra guest fees
  const extraGuestFee = calculateExtraGuestFee(
    totalGuests,
    propertyFees
  );
  
  // 3. Calculate subtotal (before taxes)
  const subtotal = accommodationTotal + cleaningFee + extraGuestFee;
  
  // 4. Calculate all applicable taxes
  const taxes = calculateTaxes({
    subtotal,
    nights,
    guests: totalGuests,
    propertyTaxes
  });
  
  // 5. Calculate grand total
  const grandTotal = subtotal + taxes.totalTax;
  
  return {
    accommodationTotal,
    cleaningFee,
    extraGuestFee,
    subtotal,
    taxes: taxes.breakdown,
    totalTax: taxes.totalTax,
    grandTotal,
    nights,
    guests: totalGuests
  };
}
```

**Helper Functions to Add:**

```javascript
// Calculate extra guest fees
function calculateExtraGuestFee(totalGuests, propertyFees) {
  const extraGuestFeeConfig = propertyFees?.find(
    fee => fee.attributes?.label === 'extra_guest_charge' && 
           fee.attributes?.enabled === true
  );
  
  if (!extraGuestFeeConfig) return 0;
  
  const guestsIncluded = extraGuestFeeConfig.attributes.guests_included || 0;
  const feePerGuest = extraGuestFeeConfig.attributes.amount || 0;
  const extraGuests = Math.max(0, totalGuests - guestsIncluded);
  
  return extraGuests * feePerGuest;
}

// Calculate all taxes
function calculateTaxes({ subtotal, nights, guests, propertyTaxes }) {
  const breakdown = [];
  let totalTax = 0;
  
  if (!propertyTaxes || propertyTaxes.length === 0) {
    return { breakdown, totalTax: 0 };
  }
  
  propertyTaxes.forEach(tax => {
    const attrs = tax.attributes;
    let taxAmount = 0;
    
    switch (attrs.label) {
      case 'per_booking_percentage':
        // Percentage of subtotal
        if (attrs.type === 'percentage') {
          taxAmount = Math.round(subtotal * (attrs.amount / 100));
          breakdown.push({
            name: attrs.name,
            type: 'percentage',
            rate: attrs.amount,
            amount: taxAmount
          });
        }
        break;
        
      case 'per_booking_amount':
        // Fixed amount per booking
        if (attrs.type === 'fixed' && attrs.amount > 0) {
          taxAmount = attrs.amount;
          breakdown.push({
            name: attrs.name,
            type: 'fixed',
            amount: taxAmount
          });
        }
        break;
        
      case 'per_night':
        // Fixed amount per night
        if (attrs.type === 'fixed' && attrs.amount > 0) {
          taxAmount = attrs.amount * nights;
          breakdown.push({
            name: attrs.name,
            type: 'per_night',
            nights: nights,
            rate: attrs.amount,
            amount: taxAmount
          });
        }
        break;
        
      case 'per_person_per_night':
        // Tourist tax: per person per night
        if (attrs.type === 'fixed' && attrs.amount > 0) {
          taxAmount = attrs.amount * guests * nights;
          breakdown.push({
            name: attrs.name,
            type: 'per_person_per_night',
            guests: guests,
            nights: nights,
            rate: attrs.amount,
            amount: taxAmount
          });
        }
        break;
    }
    
    totalTax += taxAmount;
  });
  
  return { breakdown, totalTax };
}
```

**Expected Output Example:**
```javascript
// Input:
{
  accommodationTotal: 190,
  cleaningFee: 169,
  nights: 2,
  adults: 5,
  children: 0,
  infants: 0,
  propertyFees: [...],
  propertyTaxes: [...]
}

// Output:
{
  accommodationTotal: 190,
  cleaningFee: 169,
  extraGuestFee: 30,        // NEW
  subtotal: 389,
  taxes: [
    { name: "Per booking percentage", type: "percentage", rate: 3.8, amount: 15 },
    { name: "Per person per night", type: "per_person_per_night", guests: 5, nights: 2, rate: 3, amount: 30 }
  ],
  totalTax: 45,              // NEW
  grandTotal: 434,
  nights: 2,
  guests: 5
}
```

---

#### **1.2 Update Payment Intent Creation**

**File:** `/app/app/api/stripe/create-payment-intent/route.js`

**Changes:**
```javascript
// OLD: Pass simple params
const pricing = calculateBookingPrice({
  accommodationTotal,
  cleaningFee: cleaningFee || 0,
  nights,
});

// NEW: Pass complete data including property attributes
const pricing = calculateBookingPrice({
  accommodationTotal,
  cleaningFee: cleaningFee || 0,
  nights,
  adults,
  children,
  infants,
  propertyFees: property.fees,      // NEW: from property data
  propertyTaxes: property.taxes     // NEW: from property data
});
```

**Add Property Fetching:**
```javascript
// Fetch property data to get fees and taxes
const propertyResponse = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`
);
const { property } = await propertyResponse.json();

if (!property) {
  throw new Error('Property not found');
}
```

**Update Metadata:**
```javascript
metadata: {
  // ... existing fields
  extraGuestFee: pricing.extraGuestFee?.toString() || '0',
  totalTax: pricing.totalTax?.toString() || '0',
  taxBreakdown: JSON.stringify(pricing.taxes),
}
```

---

#### **1.3 Update Checkout Page Display**

**File:** `/app/app/checkout/page.js`

**Replace Calculation:**
```javascript
// OLD:
const VAT_RATE = 7.7;
const subtotal = accommodationTotal + cleaningFee;
const vatAmount = Math.round(subtotal * (VAT_RATE / 100));
const grandTotal = subtotal + vatAmount;

// NEW: Use pricing calculator
import { calculateBookingPrice } from '@/lib/pricing-calculator';

const [calculatedPricing, setCalculatedPricing] = useState(null);

useEffect(() => {
  if (property && pricing) {
    const calculated = calculateBookingPrice({
      accommodationTotal: pricing.total || 0,
      cleaningFee: property.fees?.find(f => 
        f.attributes?.label === 'cleaning_fee'
      )?.attributes?.amount || 0,
      nights: calculateNights(),
      adults,
      children,
      infants,
      propertyFees: property.fees || [],
      propertyTaxes: property.taxes || []
    });
    setCalculatedPricing(calculated);
  }
}, [property, pricing, adults, children, infants]);
```

**Update Price Breakdown Display:**
```jsx
{/* Price Breakdown */}
<div className="space-y-3">
  <div className="flex justify-between text-sm">
    <span className="text-gray-700">
      {currency} {pricing?.averageRate || 0} x {nights} night{nights > 1 ? 's' : ''}
    </span>
    <span className="font-medium">{currency} {calculatedPricing?.accommodationTotal}</span>
  </div>

  <div className="flex justify-between text-sm">
    <span className="text-gray-700">Cleaning fee</span>
    <span className="font-medium">{currency} {calculatedPricing?.cleaningFee}</span>
  </div>

  {/* NEW: Extra Guest Fee */}
  {calculatedPricing?.extraGuestFee > 0 && (
    <div className="flex justify-between text-sm">
      <span className="text-gray-700">Extra guest fee</span>
      <span className="font-medium">{currency} {calculatedPricing.extraGuestFee}</span>
    </div>
  )}

  <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
    <span className="text-gray-700">Subtotal</span>
    <span className="font-medium">{currency} {calculatedPricing?.subtotal}</span>
  </div>

  {/* NEW: Tax Breakdown */}
  {calculatedPricing?.taxes?.map((tax, index) => (
    <div key={index} className="flex justify-between text-sm">
      <span className="text-gray-700">
        {tax.name}
        {tax.type === 'percentage' && ` (${tax.rate}%)`}
        {tax.type === 'per_person_per_night' && ` (${tax.guests} guests × ${tax.nights} nights)`}
      </span>
      <span className="font-medium">{currency} {tax.amount}</span>
    </div>
  ))}

  <div className="flex justify-between pt-3 border-t border-gray-200">
    <span className="font-medium text-lg">Total</span>
    <span className="font-medium text-lg">{currency} {calculatedPricing?.grandTotal}</span>
  </div>
</div>
```

---

### **PHASE 2: Add Booking Validation** (High Priority)
**Time:** 1 hour | **Tokens:** ~12,000

#### **2.1 Create Validation Utilities**

**File:** `/app/lib/booking-validation.js` (NEW FILE)

```javascript
/**
 * Validate booking against property constraints
 */
export function validateBooking({
  property,
  checkIn,
  checkOut,
  adults,
  children,
  infants,
  availabilityData
}) {
  const errors = [];
  const warnings = [];
  
  // 1. Validate guest count
  const totalGuests = adults + children + infants;
  const maxCapacity = property.maximum_capacity || 10;
  
  if (totalGuests > maxCapacity) {
    errors.push({
      field: 'guests',
      message: `This property can accommodate maximum ${maxCapacity} guests. You selected ${totalGuests} guests.`
    });
  }
  
  if (totalGuests === 0) {
    errors.push({
      field: 'guests',
      message: 'Please select at least 1 guest.'
    });
  }
  
  // 2. Validate minimum stay
  const nights = calculateNights(checkIn, checkOut);
  const minStay = availabilityData?.calendar?.days?.[0]?.minimum_length_of_stay || 1;
  
  if (nights < minStay) {
    errors.push({
      field: 'dates',
      message: `This property requires a minimum stay of ${minStay} night${minStay > 1 ? 's' : ''}. You selected ${nights} night${nights > 1 ? 's' : ''}.`
    });
  }
  
  // 3. Validate maximum stay
  const maxStay = availabilityData?.calendar?.days?.[0]?.maximum_available_nights;
  if (maxStay && nights > maxStay) {
    errors.push({
      field: 'dates',
      message: `Maximum stay for this property is ${maxStay} nights. You selected ${nights} nights.`
    });
  }
  
  // 4. Check for closed dates
  const closedForArrival = availabilityData?.calendar?.days?.find(
    day => day.date === checkIn && day.closed_for_arrival
  );
  
  if (closedForArrival) {
    errors.push({
      field: 'checkIn',
      message: 'Check-in is not available on the selected date. Please choose a different date.'
    });
  }
  
  const closedForDeparture = availabilityData?.calendar?.days?.find(
    day => day.date === checkOut && day.closed_for_departure
  );
  
  if (closedForDeparture) {
    errors.push({
      field: 'checkOut',
      message: 'Check-out is not available on the selected date. Please choose a different date.'
    });
  }
  
  // 5. Check availability
  if (availabilityData?.pricing?.available === false) {
    errors.push({
      field: 'dates',
      message: 'These dates are not available. Please select different dates.'
    });
  }
  
  // 6. Warnings for extra guests
  const extraGuestFee = property.fees?.find(
    f => f.attributes?.label === 'extra_guest_charge' && f.attributes?.enabled
  );
  
  if (extraGuestFee && totalGuests > extraGuestFee.attributes.guests_included) {
    const extraGuests = totalGuests - extraGuestFee.attributes.guests_included;
    const extraCost = extraGuests * extraGuestFee.attributes.amount;
    warnings.push({
      field: 'guests',
      message: `Note: ${extraGuests} extra guest${extraGuests > 1 ? 's' : ''} will incur an additional fee of CHF ${extraCost}.`
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}
```

---

#### **2.2 Add Validation to Property Page**

**File:** `/app/app/property/[id]/page.js`

**Add Validation on Reserve Button Click:**
```javascript
import { validateBooking } from '@/lib/booking-validation';

const [validationErrors, setValidationErrors] = useState([]);
const [validationWarnings, setValidationWarnings] = useState([]);

const handleReserve = () => {
  // Validate before navigation
  const validation = validateBooking({
    property,
    checkIn,
    checkOut,
    adults,
    children,
    infants,
    availabilityData: availability
  });
  
  if (!validation.valid) {
    setValidationErrors(validation.errors);
    setValidationWarnings(validation.warnings);
    return; // Don't navigate
  }
  
  // If valid, proceed to checkout
  const params = new URLSearchParams({
    propertyId: property.id,
    checkIn,
    checkOut,
    adults: adults.toString(),
    children: children.toString(),
    infants: infants.toString()
  });
  
  router.push(`/checkout?${params.toString()}`);
};
```

**Display Validation Errors:**
```jsx
{/* Validation Errors */}
{validationErrors.length > 0 && (
  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-start gap-2">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-red-900 mb-2">Cannot proceed with booking:</p>
        <ul className="space-y-1">
          {validationErrors.map((error, index) => (
            <li key={index} className="text-sm text-red-700">• {error.message}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}

{/* Validation Warnings */}
{validationWarnings.length > 0 && (
  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-start gap-2">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {validationWarnings.map((warning, index) => (
          <p key={index} className="text-sm text-yellow-700">{warning.message}</p>
        ))}
      </div>
    </div>
  </div>
)}
```

**Add Guest Count Constraints:**
```jsx
{/* Guest Selection with Max Capacity */}
<div>
  <label className="text-sm font-medium">Adults</label>
  <select
    value={adults}
    onChange={(e) => setAdults(parseInt(e.target.value))}
    className="..."
  >
    {Array.from({ length: property.maximum_capacity || 10 }, (_, i) => i + 1).map(num => (
      <option key={num} value={num}>{num}</option>
    ))}
  </select>
  <p className="text-xs text-gray-500 mt-1">
    Maximum capacity: {property.maximum_capacity || 10} guests
  </p>
</div>
```

---

#### **2.3 Add Validation to Checkout Page**

**File:** `/app/app/checkout/page.js`

**Add Validation Before Payment:**
```javascript
const handleGuestDetailsSubmit = async (e) => {
  e.preventDefault();
  
  // Validate booking constraints
  const validation = validateBooking({
    property,
    checkIn,
    checkOut,
    adults,
    children,
    infants,
    availabilityData: availability
  });
  
  if (!validation.valid) {
    setError(validation.errors[0].message);
    return;
  }
  
  // ... rest of payment intent creation
};
```

---

### **PHASE 3: Improve Display & UX** (Medium Priority)
**Time:** 1 hour | **Tokens:** ~10,000

#### **3.1 Add Booking Constraints to Property Page**

**File:** `/app/app/property/[id]/page.js`

**Add Constraints Section:**
```jsx
{/* Booking Requirements */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <h3 className="font-medium text-blue-900 mb-3">Booking Requirements</h3>
  <div className="space-y-2 text-sm text-blue-800">
    {availability?.calendar?.days?.[0]?.minimum_length_of_stay > 1 && (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>Minimum stay: {availability.calendar.days[0].minimum_length_of_stay} nights</span>
      </div>
    )}
    
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4" />
      <span>Maximum guests: {property.maximum_capacity}</span>
    </div>
    
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4" />
      <span>Check-in: {property.check_in_time}:00 | Check-out: {property.check_out_time}:00</span>
    </div>
    
    {property.fees?.find(f => f.attributes?.label === 'extra_guest_charge')?.attributes && (
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4" />
        <span>
          Extra guest fee: CHF {property.fees.find(f => f.attributes?.label === 'extra_guest_charge').attributes.amount} 
          per guest beyond {property.fees.find(f => f.attributes?.label === 'extra_guest_charge').attributes.guests_included}
        </span>
      </div>
    )}
  </div>
</div>
```

---

#### **3.2 Add Daily Rate Breakdown**

**File:** `/app/app/checkout/page.js`

**Add Expandable Daily Rates:**
```jsx
{/* Daily Rate Breakdown (Collapsible) */}
<details className="mb-3">
  <summary className="cursor-pointer text-sm text-gray-700 hover:text-black">
    View daily rate breakdown
  </summary>
  <div className="mt-2 space-y-1 pl-4 border-l-2 border-gray-200">
    {availability?.calendar?.days?.map((day, index) => (
      <div key={index} className="flex justify-between text-xs text-gray-600">
        <span>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{currency} {day.day_rate}</span>
      </div>
    ))}
  </div>
</details>
```

---

#### **3.3 Add Constraints to Listings Page**

**File:** `/app/components/PropertyCard.js`

**Add Constraint Badges:**
```jsx
{/* Property Constraints */}
<div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
  <span className="flex items-center gap-1">
    <Users className="w-3 h-3" />
    Up to {property.maximum_capacity} guests
  </span>
  
  {minStay > 1 && (
    <span className="flex items-center gap-1">
      <Calendar className="w-3 h-3" />
      {minStay} night min
    </span>
  )}
</div>
```

---

### **PHASE 4: Testing & Verification** (Required)
**Time:** 1 hour | **Tokens:** ~8,000

#### **4.1 Test Scenarios**

**Scenario 1: Basic Booking (2 guests, 2 nights)**
```
Property: 84656
Dates: Nov 7-9, 2025
Guests: 2 adults, 0 children, 0 infants

Expected Calculation:
- Accommodation: CHF 190 (95+95)
- Cleaning: CHF 169
- Extra Guest: CHF 0 (2 guests ≤ 4 included)
- Subtotal: CHF 359
- Booking Tax (3.8%): CHF 14
- Tourist Tax (2 guests × 2 nights × CHF 3): CHF 12
- Total Tax: CHF 26
- Grand Total: CHF 385
```

**Scenario 2: Extra Guest (5 guests, 2 nights)**
```
Property: 84656
Dates: Nov 7-9, 2025
Guests: 5 adults, 0 children, 0 infants

Expected Calculation:
- Accommodation: CHF 190
- Cleaning: CHF 169
- Extra Guest: CHF 30 (5 guests - 4 included = 1 extra)
- Subtotal: CHF 389
- Booking Tax (3.8%): CHF 15
- Tourist Tax (5 guests × 2 nights × CHF 3): CHF 30
- Total Tax: CHF 45
- Grand Total: CHF 434
```

**Scenario 3: Minimum Stay Violation**
```
Property: 84656
Dates: Nov 7-8, 2025 (1 night)
Guests: 2 adults

Expected Result:
❌ Validation Error: "This property requires a minimum stay of 2 nights."
Reserve button disabled or shows error
```

**Scenario 4: Maximum Capacity Violation**
```
Property: 84656
Dates: Nov 7-9, 2025
Guests: 6 adults

Expected Result:
❌ Validation Error: "This property can accommodate maximum 5 guests."
Cannot proceed to checkout
```

---

#### **4.2 Testing Checklist**

```
Manual Testing:
□ Test pricing with 1-5 guests (verify extra guest fee)
□ Test 1-10 night bookings (verify minimum stay)
□ Test different properties (verify property-specific rules)
□ Verify all tax lines appear correctly
□ Verify total matches Stripe payment
□ Test validation error messages
□ Test warning messages (extra guest fee)
□ Verify checkout page price breakdown
□ Verify property page constraints display

Backend Testing:
□ Test Payment Intent creation with new pricing
□ Verify metadata includes all fees/taxes
□ Test webhook with corrected amounts
□ Verify MongoDB stores correct totals
□ Test Uplisting booking creation with correct amounts

Integration Testing:
□ Complete booking end-to-end
□ Verify Stripe charge matches calculated total
□ Verify Uplisting booking has correct amounts
□ Verify success page displays correct total
□ Test payment failure scenarios
```

---

## 🔄 Implementation Order

### **Step 1: Backup Current Code**
```bash
cd /app
git add .
git commit -m "Backup before Uplisting data-driven refactor"
```

### **Step 2: Phase 1 - Pricing (Critical)**
1. Create new pricing calculator with all helpers
2. Test pricing calculator independently
3. Update Payment Intent API
4. Update Checkout page display
5. Test with various scenarios
6. Verify Stripe amounts

### **Step 3: Phase 2 - Validation (High)**
1. Create validation utilities
2. Add to Property page
3. Add to Checkout page
4. Test all validation scenarios
5. Verify error messages

### **Step 4: Phase 3 - Display (Medium)**
1. Add constraints to Property page
2. Add daily breakdown to Checkout
3. Add constraint badges to listings
4. Test UI/UX

### **Step 5: Phase 4 - Testing (Required)**
1. Run all test scenarios
2. Fix any issues found
3. Verify end-to-end flow
4. Document any property-specific quirks

---

## 🚨 Rollback Plan

If issues arise:

**Rollback Pricing Only:**
```javascript
// In pricing-calculator.js, temporarily revert to:
const VAT_RATE = 7.7;
const vatAmount = Math.round(subtotal * (VAT_RATE / 100));
```

**Full Rollback:**
```bash
git reset --hard HEAD~1
sudo supervisorctl restart nextjs
```

---

## 📊 Success Metrics

**After implementation, verify:**

✅ Pricing accuracy: Within CHF 1 of manual calculation
✅ Validation: All constraints enforced
✅ UX: Clear error/warning messages
✅ Integration: Stripe + Uplisting bookings match
✅ No regressions: Existing features still work

---

## 💰 Token Budget Breakdown

| Phase | Task | Estimated Tokens |
|-------|------|------------------|
| 1 | Pricing Calculator | 8,000 |
| 1 | Payment Intent Update | 3,000 |
| 1 | Checkout Display | 4,000 |
| 2 | Validation Utils | 5,000 |
| 2 | Property Page Validation | 4,000 |
| 2 | Checkout Validation | 3,000 |
| 3 | Constraints Display | 3,000 |
| 3 | Daily Breakdown | 2,000 |
| 3 | Listings Updates | 2,000 |
| 4 | Testing | 5,000 |
| 4 | Bug Fixes | 3,000 |
| Buffer | Unexpected Issues | 3,000 |
| **Total** | | **45,000 tokens** |

---

## ✅ Ready to Execute

This plan provides:
- ✅ Step-by-step implementation
- ✅ Complete code examples
- ✅ Testing scenarios
- ✅ Rollback strategy
- ✅ Clear success metrics

**Confirm to proceed with implementation!** 🚀
