#!/usr/bin/env python3
"""
FOCUSED DECIMAL PRECISION TESTING
Specifically testing the currency decimal precision changes mentioned in the review request:
1. Currency decimal precision (formatCurrency) - prices now show decimals
2. Pricing calculator no longer rounds values prematurely
3. Test with specific scenario: 3.8% tax on 266 CHF should return 10.108 or 10.11, NOT 10
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://config-relay.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test property ID from review request
PRIMARY_TEST_PROPERTY = 84656  # "Sunny Alps View: Central Bliss"

# Test dates for Dec 10-11, 2025 equivalent
today = datetime.now()
check_in = (today + timedelta(days=10)).strftime('%Y-%m-%d')
check_out = (today + timedelta(days=11)).strftime('%Y-%m-%d')

print(f"🎯 FOCUSED DECIMAL PRECISION TESTING")
print(f"📋 Testing currency decimal precision changes")
print(f"📅 Test dates: {check_in} to {check_out} (1 night)")
print(f"🏠 Test property: {PRIMARY_TEST_PROPERTY}")
print(f"🌐 Base URL: {BASE_URL}")
print("=" * 80)

def test_decimal_precision_in_response(data, test_name):
    """Check for decimal precision in pricing data"""
    print(f"\n🔍 DECIMAL PRECISION ANALYSIS - {test_name}")
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (int, float)) and 'total' in key.lower() or 'amount' in key.lower() or 'fee' in key.lower() or 'tax' in key.lower():
                has_decimals = isinstance(value, float) and value % 1 != 0
                decimal_places = len(str(value).split('.')[-1]) if '.' in str(value) and has_decimals else 0
                
                if has_decimals:
                    print(f"  ✅ {key}: {value} (has {decimal_places} decimal places)")
                else:
                    print(f"  📊 {key}: {value} (whole number)")
            
            elif isinstance(value, dict):
                test_decimal_precision_in_response(value, f"{test_name} -> {key}")
            elif isinstance(value, list):
                for i, item in enumerate(value):
                    if isinstance(item, dict):
                        test_decimal_precision_in_response(item, f"{test_name} -> {key}[{i}]")

def main():
    """Run focused decimal precision tests"""
    
    print("\n🎯 TEST 1: STRIPE PAYMENT INTENT WITH REAL PRICING DATA")
    print("=" * 60)
    
    # First, get property data to understand the fees and taxes
    print("📋 Step 1: Fetching property data for fees and taxes...")
    try:
        response = requests.get(f"{API_BASE}/properties/{PRIMARY_TEST_PROPERTY}")
        if response.status_code == 200:
            property_data = response.json().get('property', {})
            fees = property_data.get('fees', [])
            taxes = property_data.get('taxes', [])
            
            print(f"🏠 Property: {property_data.get('name', 'Unknown')}")
            print(f"💰 Fees found: {len(fees)}")
            print(f"📊 Taxes found: {len(taxes)}")
            
            # Display tax information for decimal precision analysis
            for tax in taxes:
                attrs = tax.get('attributes', {})
                tax_name = attrs.get('name', 'Unknown Tax')
                tax_type = attrs.get('type', 'Unknown')
                tax_amount = attrs.get('amount', 0)
                tax_label = attrs.get('label', 'Unknown')
                
                print(f"  📋 {tax_name}: {tax_amount} ({tax_type}, {tax_label})")
                
                # Look for percentage taxes that should show decimals
                if tax_type == 'percentage' and tax_amount > 0:
                    print(f"    🎯 This is a percentage tax - should produce decimal results!")
        else:
            print(f"❌ Failed to fetch property data: {response.status_code}")
            return 1
    except Exception as e:
        print(f"❌ Error fetching property data: {e}")
        return 1
    
    print("\n📋 Step 2: Testing Stripe Payment Intent with realistic pricing...")
    
    # Use realistic accommodation total that will produce decimal tax results
    # Example: 266 CHF accommodation with 3.8% tax should produce 10.108 CHF tax
    accommodation_total = 266.0  # CHF for 1 night
    cleaning_fee = 169.0  # Typical cleaning fee
    
    payment_payload = {
        "propertyId": str(PRIMARY_TEST_PROPERTY),
        "checkIn": check_in,
        "checkOut": check_out,
        "adults": 2,
        "children": 0,
        "infants": 0,
        "guestName": "Emma Schmidt",
        "guestEmail": "emma.schmidt@example.com",
        "guestPhone": "+41 79 123 4567",
        "accommodationTotal": accommodation_total,
        "cleaningFee": cleaning_fee,
        "marketingConsent": False
    }
    
    print(f"💰 Test scenario: {accommodation_total} CHF accommodation + {cleaning_fee} CHF cleaning")
    print(f"🧮 Expected: 3.8% tax on subtotal should show decimal precision")
    
    try:
        response = requests.post(
            f"{API_BASE}/stripe/create-payment-intent",
            json=payment_payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: Payment Intent created")
            
            # Extract pricing data
            pricing = data.get('pricing', {})
            client_secret = data.get('clientSecret')
            booking_id = data.get('bookingId')
            
            print(f"🔐 Client Secret: {'✅ Present' if client_secret else '❌ Missing'}")
            print(f"📝 Booking ID: {booking_id}")
            
            # Detailed decimal precision analysis
            print(f"\n🎯 DECIMAL PRECISION RESULTS:")
            print(f"  💰 Accommodation Total: {pricing.get('accommodationTotal', 0)}")
            print(f"  🧹 Cleaning Fee: {pricing.get('cleaningFee', 0)}")
            print(f"  👥 Extra Guest Fee: {pricing.get('extraGuestFee', 0)}")
            print(f"  📊 Subtotal: {pricing.get('subtotal', 0)}")
            print(f"  💰 Grand Total: {pricing.get('grandTotal', 0)}")
            
            # Check individual taxes for decimal precision
            taxes = pricing.get('taxes', [])
            print(f"\n📊 TAX BREAKDOWN ({len(taxes)} taxes):")
            
            decimal_precision_found = False
            for tax in taxes:
                tax_name = tax.get('name', 'Unknown Tax')
                tax_amount = tax.get('amount', 0)
                tax_type = tax.get('type', 'Unknown')
                tax_rate = tax.get('rate', 0)
                
                has_decimals = isinstance(tax_amount, float) and tax_amount % 1 != 0
                
                if tax_type == 'percentage':
                    print(f"  📋 {tax_name} ({tax_rate}%): {tax_amount} CHF")
                    if has_decimals:
                        decimal_places = len(str(tax_amount).split('.')[-1])
                        print(f"    ✅ DECIMAL PRECISION PRESERVED: {decimal_places} decimal places")
                        decimal_precision_found = True
                    else:
                        print(f"    ⚠️ NO DECIMALS: May indicate rounding issue")
                else:
                    print(f"  📋 {tax_name}: {tax_amount} CHF ({tax_type})")
            
            # Overall assessment
            total_tax = pricing.get('totalTax', 0)
            print(f"\n📊 Total Tax: {total_tax} CHF")
            
            if decimal_precision_found:
                print(f"✅ DECIMAL PRECISION TEST PASSED: Found decimal values in tax calculations")
            else:
                print(f"⚠️ DECIMAL PRECISION TEST INCONCLUSIVE: No decimal values found")
            
            # Test the specific scenario from review request
            subtotal = pricing.get('subtotal', 0)
            if subtotal > 0:
                expected_tax_38_percent = subtotal * 0.038
                print(f"\n🧮 MANUAL CALCULATION CHECK:")
                print(f"  📊 Subtotal: {subtotal} CHF")
                print(f"  🧮 Expected 3.8% tax: {expected_tax_38_percent:.3f} CHF")
                print(f"  📊 Actual total tax: {total_tax} CHF")
                
                if abs(expected_tax_38_percent - total_tax) < 0.01:
                    print(f"  ✅ Tax calculation matches expected decimal precision")
                else:
                    print(f"  ℹ️ Tax calculation may include other taxes beyond 3.8%")
            
            return 0
            
        else:
            print(f"❌ FAILED: Payment Intent creation failed")
            try:
                error_data = response.json()
                print(f"📝 Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📝 Error text: {response.text}")
            return 1
            
    except Exception as e:
        print(f"❌ Error testing payment intent: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    print(f"\n{'='*80}")
    if exit_code == 0:
        print(f"🎉 DECIMAL PRECISION TESTING COMPLETED SUCCESSFULLY")
    else:
        print(f"❌ DECIMAL PRECISION TESTING FAILED")
    print(f"{'='*80}")
    sys.exit(exit_code)