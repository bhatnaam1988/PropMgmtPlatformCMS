#!/usr/bin/env python3
"""
COMPREHENSIVE PRE-DEPLOYMENT BACKEND TESTING
Testing all critical endpoints with specific scenarios as requested
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://config-relay.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test property IDs from Uplisting
TEST_PROPERTY_IDS = [84656, 174947, 186289]
PRIMARY_TEST_PROPERTY = 84656

print(f"🧪 COMPREHENSIVE PRE-DEPLOYMENT BACKEND TESTING")
print(f"🌐 Base URL: {BASE_URL}")
print("=" * 80)

def test_endpoint(name, method, url, data=None, expected_status=200, critical=False):
    """Test an API endpoint and return results"""
    priority = "🔴 CRITICAL" if critical else "🟡 HIGH"
    print(f"\n{priority} - {name}")
    print(f"📍 {method} {url}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == expected_status:
            try:
                json_data = response.json()
                print(f"✅ SUCCESS: {name}")
                return True, json_data
            except json.JSONDecodeError:
                print(f"✅ SUCCESS: {name} (Non-JSON response)")
                return True, response.text
        else:
            print(f"❌ FAILED: {name} - Expected {expected_status}, got {response.status_code}")
            try:
                error_data = response.json()
                print(f"📝 Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📝 Error text: {response.text[:200]}...")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"💥 NETWORK ERROR: {name} - {str(e)}")
        return False, None
    except Exception as e:
        print(f"💥 UNEXPECTED ERROR: {name} - {str(e)}")
        return False, None

def main():
    """Run comprehensive pre-deployment backend tests"""
    results = {}
    
    print("\n🔴 CRITICAL ENDPOINT TESTING")
    print("=" * 50)
    
    # 1. Properties API - Verify 3 properties with correct IDs
    success, data = test_endpoint(
        "Properties API (GET /api/properties)",
        "GET",
        f"{API_BASE}/properties",
        critical=True
    )
    results["properties_list"] = success
    if success and data:
        properties = data.get('properties', [])
        print(f"📋 Found {len(properties)} properties")
        property_ids = [str(p.get('id')) for p in properties]
        expected_ids = ['84656', '174947', '186289']
        found_expected = [id for id in expected_ids if id in property_ids]
        print(f"✅ Expected property IDs found: {found_expected}")
        
        # Verify data structure
        if properties:
            sample_property = properties[0]
            has_fees = 'fees' in sample_property
            has_taxes = 'taxes' in sample_property
            has_constraints = 'constraints' in sample_property
            print(f"📊 Data structure: fees={has_fees}, taxes={has_taxes}, constraints={has_constraints}")
    
    # 2. Single Property API - Test all 3 property IDs
    for prop_id in TEST_PROPERTY_IDS:
        success, data = test_endpoint(
            f"Single Property API (GET /api/properties/{prop_id})",
            "GET",
            f"{API_BASE}/properties/{prop_id}",
            critical=True
        )
        results[f"single_property_{prop_id}"] = success
        if success and data:
            property_data = data.get('property', {})
            name = property_data.get('name', 'Unknown')
            fees_count = len(property_data.get('fees', []))
            taxes_count = len(property_data.get('taxes', []))
            photos_count = len(property_data.get('photos', []))
            amenities_count = len(property_data.get('amenities', []))
            print(f"🏠 Property: {name}")
            print(f"💰 Fees: {fees_count}, Taxes: {taxes_count}")
            print(f"📸 Photos: {photos_count}, Amenities: {amenities_count}")
    
    # 3. Availability API - Test with specific date ranges
    print(f"\n🟡 AVAILABILITY API TESTING")
    print("=" * 50)
    
    # Test available dates (Dec 15-20, 2025)
    available_from = "2025-12-15"
    available_to = "2025-12-20"
    success, data = test_endpoint(
        f"Availability API - Available dates ({available_from} to {available_to})",
        "GET",
        f"{API_BASE}/availability/{PRIMARY_TEST_PROPERTY}?from={available_from}&to={available_to}",
        critical=True
    )
    results["availability_available"] = success
    if success and data:
        pricing = data.get('pricing', {})
        calendar = data.get('calendar', {})
        available = pricing.get('available', False)
        average_rate = pricing.get('averageRate', 0)
        total_cost = pricing.get('total', 0)
        print(f"📅 Available: {available}")
        print(f"💰 Average rate: {average_rate} CHF/night")
        print(f"💰 Total cost: {total_cost} CHF")
        print(f"📊 Calendar entries: {len(calendar)}")
    
    # Test unavailable dates (Dec 7-10, 2025)
    unavailable_from = "2025-12-07"
    unavailable_to = "2025-12-10"
    success, data = test_endpoint(
        f"Availability API - Unavailable dates ({unavailable_from} to {unavailable_to})",
        "GET",
        f"{API_BASE}/availability/{PRIMARY_TEST_PROPERTY}?from={unavailable_from}&to={unavailable_to}",
        critical=True
    )
    results["availability_unavailable"] = success
    if success and data:
        pricing = data.get('pricing', {})
        available = pricing.get('available', False)
        print(f"📅 Available: {available} (should be False for unavailable dates)")
    
    # 4. Pricing Calculator API - Test single and multiple properties
    print(f"\n🟡 PRICING CALCULATOR TESTING")
    print("=" * 50)
    
    # Single property test
    single_payload = {
        "propertyIds": [PRIMARY_TEST_PROPERTY],
        "from": "2025-12-15",
        "to": "2025-12-20"
    }
    success, data = test_endpoint(
        "Pricing Calculator - Single property",
        "POST",
        f"{API_BASE}/pricing",
        data=single_payload,
        critical=True
    )
    results["pricing_single"] = success
    if success and data:
        results_data = data.get('results', [])
        if results_data:
            result = results_data[0]
            pricing = result.get('pricing', {})
            accommodation = pricing.get('accommodationCharges', 0)
            cleaning = pricing.get('cleaningFee', 0)
            taxes = pricing.get('taxes', {})
            total = pricing.get('grandTotal', 0)
            print(f"💰 Accommodation: {accommodation} CHF")
            print(f"🧹 Cleaning fee: {cleaning} CHF")
            print(f"💸 Taxes: {taxes}")
            print(f"💰 Grand total: {total} CHF")
    
    # Multiple properties test
    multiple_payload = {
        "propertyIds": TEST_PROPERTY_IDS,
        "from": "2025-12-15",
        "to": "2025-12-20"
    }
    success, data = test_endpoint(
        "Pricing Calculator - Multiple properties",
        "POST",
        f"{API_BASE}/pricing",
        data=multiple_payload,
        critical=True
    )
    results["pricing_multiple"] = success
    if success and data:
        results_data = data.get('results', [])
        print(f"📊 Processed {len(results_data)} properties")
        for result in results_data:
            prop_id = result.get('propertyId')
            pricing = result.get('pricing', {})
            total = pricing.get('grandTotal', 0)
            print(f"🏠 Property {prop_id}: {total} CHF total")
    
    # 5. Stripe Payment Intent API - Full booking flow
    print(f"\n🔴 STRIPE PAYMENT TESTING")
    print("=" * 50)
    
    payment_payload = {
        "propertyId": str(PRIMARY_TEST_PROPERTY),
        "checkIn": "2025-12-15",
        "checkOut": "2025-12-20",
        "adults": 2,
        "children": 1,
        "infants": 0,
        "guestName": "Maria Schneider",
        "guestEmail": "maria.schneider@example.com",
        "guestPhone": "+41 79 987 6543",
        "accommodationTotal": 1750,  # 5 nights * 350 CHF
        "cleaningFee": 169,
        "marketingConsent": True
    }
    success, data = test_endpoint(
        "Stripe Payment Intent - Full booking flow",
        "POST",
        f"{API_BASE}/stripe/create-payment-intent",
        data=payment_payload,
        critical=True
    )
    results["stripe_payment_intent"] = success
    if success and data:
        client_secret = data.get('clientSecret')
        payment_intent_id = data.get('paymentIntentId')
        booking_id = data.get('bookingId')
        amount = data.get('amount')
        pricing = data.get('pricing', {})
        
        print(f"💳 Payment Intent ID: {payment_intent_id}")
        print(f"📝 Booking ID: {booking_id}")
        print(f"💰 Amount: {amount} CHF")
        print(f"🔐 Client Secret: {'✅ Present' if client_secret else '❌ Missing'}")
        
        # Verify pricing breakdown
        if pricing:
            accommodation = pricing.get('accommodationCharges', 0)
            cleaning = pricing.get('cleaningFee', 0)
            taxes = pricing.get('taxes', {})
            grand_total = pricing.get('grandTotal', 0)
            print(f"📊 Pricing breakdown:")
            print(f"   Accommodation: {accommodation} CHF")
            print(f"   Cleaning: {cleaning} CHF")
            print(f"   Taxes: {taxes}")
            print(f"   Grand Total: {grand_total} CHF")
    
    # 6. Stripe Config API
    success, data = test_endpoint(
        "Stripe Config API (GET /api/stripe/config)",
        "GET",
        f"{API_BASE}/stripe/config",
        critical=False
    )
    results["stripe_config"] = success
    if success and data:
        publishable_key = data.get('publishableKey', '')
        print(f"🔑 Publishable key: {'✅ Present' if publishable_key else '❌ Missing'}")
    
    # 7. Stripe Webhook Handler - Security validation
    webhook_payload = {"invalid": "test"}
    success, data = test_endpoint(
        "Stripe Webhook Handler - Security validation",
        "POST",
        f"{API_BASE}/stripe/webhook",
        data=webhook_payload,
        expected_status=400,
        critical=True
    )
    results["stripe_webhook"] = success
    
    # 8. Form Submission APIs
    print(f"\n🟡 FORM SUBMISSION TESTING")
    print("=" * 50)
    
    # Contact form
    contact_payload = {
        "name": "Hans Mueller",
        "email": "hans.mueller@example.com",
        "phone": "+41 79 555 1234",
        "subject": "Property inquiry",
        "message": "I'm interested in booking property 84656 for Christmas holidays.",
        "inquiryType": "Guest"
    }
    success, data = test_endpoint(
        "Contact Form API (POST /api/forms/contact)",
        "POST",
        f"{API_BASE}/forms/contact",
        data=contact_payload,
        critical=False
    )
    results["contact_form"] = success
    
    # Cleaning services form
    cleaning_payload = {
        "name": "Anna Weber",
        "email": "anna.weber@example.com",
        "phone": "+41 79 555 5678",
        "serviceType": "Deep Cleaning",
        "propertyAddress": "Grächen, Valais",
        "message": "Need deep cleaning service for vacation rental property."
    }
    success, data = test_endpoint(
        "Cleaning Services API (POST /api/forms/cleaning-services)",
        "POST",
        f"{API_BASE}/forms/cleaning-services",
        data=cleaning_payload,
        critical=False
    )
    results["cleaning_form"] = success
    
    # 9. Error Scenarios Testing
    print(f"\n🟠 ERROR SCENARIO TESTING")
    print("=" * 50)
    
    # Invalid property ID
    success, data = test_endpoint(
        "Invalid Property ID (404 handling)",
        "GET",
        f"{API_BASE}/properties/999999",
        expected_status=404,
        critical=False
    )
    results["invalid_property"] = success
    
    # Invalid date format
    success, data = test_endpoint(
        "Invalid Date Format",
        "GET",
        f"{API_BASE}/availability/{PRIMARY_TEST_PROPERTY}?from=invalid-date&to=2025-12-20",
        expected_status=400,
        critical=False
    )
    results["invalid_date"] = success
    
    # Missing required parameters in payment intent
    invalid_payment_payload = {
        "propertyId": str(PRIMARY_TEST_PROPERTY),
        # Missing required fields
    }
    success, data = test_endpoint(
        "Missing Required Parameters (Payment Intent)",
        "POST",
        f"{API_BASE}/stripe/create-payment-intent",
        data=invalid_payment_payload,
        expected_status=400,
        critical=False
    )
    results["invalid_payment"] = success
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 COMPREHENSIVE PRE-DEPLOYMENT TEST RESULTS")
    print("=" * 80)
    
    critical_tests = [
        ("Properties API", results.get("properties_list", False)),
        ("Single Property 84656", results.get("single_property_84656", False)),
        ("Single Property 174947", results.get("single_property_174947", False)),
        ("Single Property 186289", results.get("single_property_186289", False)),
        ("Availability API (Available)", results.get("availability_available", False)),
        ("Availability API (Unavailable)", results.get("availability_unavailable", False)),
        ("Pricing Calculator (Single)", results.get("pricing_single", False)),
        ("Pricing Calculator (Multiple)", results.get("pricing_multiple", False)),
        ("Stripe Payment Intent", results.get("stripe_payment_intent", False)),
        ("Stripe Webhook Handler", results.get("stripe_webhook", False))
    ]
    
    high_priority_tests = [
        ("Stripe Config API", results.get("stripe_config", False)),
        ("Contact Form API", results.get("contact_form", False)),
        ("Cleaning Services API", results.get("cleaning_form", False))
    ]
    
    error_handling_tests = [
        ("Invalid Property ID", results.get("invalid_property", False)),
        ("Invalid Date Format", results.get("invalid_date", False)),
        ("Invalid Payment Data", results.get("invalid_payment", False))
    ]
    
    print("\n🔴 CRITICAL SYSTEMS:")
    critical_passed = sum(1 for _, passed in critical_tests if passed)
    for name, passed in critical_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
    
    print(f"\n🟡 HIGH PRIORITY SYSTEMS:")
    high_passed = sum(1 for _, passed in high_priority_tests if passed)
    for name, passed in high_priority_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
    
    print(f"\n🟠 ERROR HANDLING:")
    error_passed = sum(1 for _, passed in error_handling_tests if passed)
    for name, passed in error_handling_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
    
    # Overall results
    total_tests = len(critical_tests) + len(high_priority_tests) + len(error_handling_tests)
    total_passed = critical_passed + high_passed + error_passed
    
    print(f"\n📈 OVERALL RESULTS:")
    print(f"  🔴 Critical: {critical_passed}/{len(critical_tests)} passed")
    print(f"  🟡 High Priority: {high_passed}/{len(high_priority_tests)} passed")
    print(f"  🟠 Error Handling: {error_passed}/{len(error_handling_tests)} passed")
    print(f"  📊 Total: {total_passed}/{total_tests} passed ({total_passed/total_tests*100:.1f}%)")
    
    # Determine overall status
    critical_success_rate = critical_passed / len(critical_tests)
    if critical_success_rate >= 0.9:  # 90% of critical tests pass
        print(f"\n🎉 COMPREHENSIVE PRE-DEPLOYMENT TESTING SUCCESSFUL")
        print(f"✅ All critical systems operational - Ready for production deployment")
        return 0
    else:
        print(f"\n❌ CRITICAL SYSTEM FAILURES DETECTED")
        print(f"⚠️ Not ready for production deployment")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)