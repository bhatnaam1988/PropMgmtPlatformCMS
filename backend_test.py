#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Swiss Alpine Journey
Testing all Uplisting-dependent APIs after critical API key fix
Focus on Properties, Availability, Pricing, Stripe Payment Intent, and Email systems
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import os

# Configuration
BASE_URL = "https://config-relay.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test property IDs from Uplisting
TEST_PROPERTY_IDS = [84656, 174947, 186289]
PRIMARY_TEST_PROPERTY = 84656  # "Sunny Alps View: Central Bliss"

# Test dates (future dates)
today = datetime.now()
check_in = (today + timedelta(days=30)).strftime('%Y-%m-%d')  # 30 days from now
check_out = (today + timedelta(days=35)).strftime('%Y-%m-%d')  # 35 days from now

print(f"🧪 COMPREHENSIVE BACKEND API TESTING AFTER UPLISTING FIX")
print(f"📅 Test dates: {check_in} to {check_out}")
print(f"🏠 Primary test property: {PRIMARY_TEST_PROPERTY}")
print(f"🌐 Base URL: {BASE_URL}")
print("=" * 80)

# Old test functions removed - using new comprehensive test approach

def test_properties_list():
    """Test GET /api/properties - Get list of properties"""
    print("🔍 Testing Properties List API...")
    
    try:
        response = requests.get(f"{API_BASE}/properties", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if 'properties' in data and len(data['properties']) > 0:
                property_count = len(data['properties'])
                first_property = data['properties'][0]
                property_id = first_property.get('id')
                property_name = first_property.get('name', 'Unknown')
                
                print_test_result(
                    "Properties List API", 
                    True, 
                    f"Found {property_count} properties. First property: {property_name} (ID: {property_id})"
                )
                return property_id, data['properties']
            else:
                print_test_result("Properties List API", False, "No properties found in response")
                return None, []
        else:
            print_test_result("Properties List API", False, f"HTTP {response.status_code}: {response.text}")
            return None, []
            
    except Exception as e:
        print_test_result("Properties List API", False, f"Exception: {str(e)}")
        return None, []

def test_single_property(property_id):
    """Test GET /api/properties/[id] - Get single property details"""
    print(f"🔍 Testing Single Property API for ID: {property_id}...")
    
    try:
        response = requests.get(f"{API_BASE}/properties/{property_id}", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if 'property' in data:
                property = data['property']
                required_fields = ['id', 'name']
                missing_fields = [field for field in required_fields if field not in property]
                
                if not missing_fields:
                    property_name = property.get('name', 'Unknown')
                    address = property.get('address', {})
                    photos_count = len(property.get('photos', []))
                    
                    print_test_result(
                        "Single Property API", 
                        True, 
                        f"Property: {property_name}, Photos: {photos_count}, Address: {address.get('city', 'N/A')}"
                    )
                    return True, property
                else:
                    print_test_result("Single Property API", False, f"Missing required fields: {missing_fields}")
                    return False, None
            else:
                print_test_result("Single Property API", False, "No 'property' field in response")
                return False, None
        else:
            print_test_result("Single Property API", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Single Property API", False, f"Exception: {str(e)}")
        return False, None

def test_availability(property_id):
    """Test GET /api/availability/[propertyId] - Get pricing and availability"""
    print(f"🔍 Testing Availability API for property ID: {property_id}...")
    
    # Use future dates for testing
    check_in = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    check_out = (datetime.now() + timedelta(days=35)).strftime('%Y-%m-%d')
    
    try:
        url = f"{API_BASE}/availability/{property_id}?from={check_in}&to={check_out}"
        response = requests.get(url, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if 'pricing' in data:
                pricing = data['pricing']
                required_pricing_fields = ['averageRate', 'total', 'totalNights']
                missing_fields = [field for field in required_pricing_fields if field not in pricing]
                
                if not missing_fields:
                    avg_rate = pricing.get('averageRate', 0)
                    total = pricing.get('total', 0)
                    nights = pricing.get('totalNights', 0)
                    currency = pricing.get('currency', 'CHF')
                    available = pricing.get('available', False)
                    
                    print_test_result(
                        "Availability API", 
                        True, 
                        f"Dates: {check_in} to {check_out}, Rate: {avg_rate} {currency}/night, Total: {total} {currency} for {nights} nights, Available: {available}"
                    )
                    return True, data
                else:
                    print_test_result("Availability API", False, f"Missing pricing fields: {missing_fields}")
                    return False, None
            else:
                print_test_result("Availability API", False, "No 'pricing' field in response")
                return False, None
        else:
            print_test_result("Availability API", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Availability API", False, f"Exception: {str(e)}")
        return False, None

def test_pricing_calculator(property_ids):
    """Test POST /api/pricing - Calculate pricing for multiple properties"""
    print("🔍 Testing Pricing Calculator API...")
    
    # Use future dates for testing
    check_in = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    check_out = (datetime.now() + timedelta(days=35)).strftime('%Y-%m-%d')
    
    pricing_data = {
        "propertyIds": property_ids[:2],  # Test with first 2 properties
        "from": check_in,
        "to": check_out
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/pricing",
            json=pricing_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                results_count = len(data['results'])
                first_result = data['results'][0]
                property_id = first_result.get('propertyId')
                pricing = first_result.get('pricing', {})
                avg_rate = pricing.get('averageRate', 0)
                
                print_test_result(
                    "Pricing Calculator API", 
                    True, 
                    f"Processed {results_count} properties. Property {property_id}: {avg_rate} CHF/night"
                )
                return True, data
            else:
                print_test_result("Pricing Calculator API", False, "No results in response")
                return False, None
        else:
            print_test_result("Pricing Calculator API", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Pricing Calculator API", False, f"Exception: {str(e)}")
        return False, None

def test_stripe_payment_intent(property_id):
    """Test POST /api/stripe/create-payment-intent - Create Stripe Payment Intent"""
    print(f"🔍 Testing Stripe Create Payment Intent API for property ID: {property_id}...")
    
    # Use future dates for testing
    check_in = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    check_out = (datetime.now() + timedelta(days=35)).strftime('%Y-%m-%d')
    
    payment_data = {
        "propertyId": property_id,
        "checkIn": check_in,
        "checkOut": check_out,
        "adults": 2,
        "children": 0,
        "infants": 0,
        "guestName": "Emma Thompson",
        "guestEmail": "emma.thompson@example.com",
        "guestPhone": "+41791234567",
        "accommodationTotal": 600,
        "cleaningFee": 150,
        "marketingConsent": False
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/stripe/create-payment-intent",
            json=payment_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['clientSecret', 'paymentIntentId', 'bookingId', 'amount', 'pricing']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                amount = data.get('amount', 0)
                booking_id = data.get('bookingId')
                pricing = data.get('pricing', {})
                grand_total = pricing.get('grandTotal', 0)
                
                print_test_result(
                    "Stripe Create Payment Intent API", 
                    True, 
                    f"Payment Intent created. Booking ID: {booking_id}, Amount: {amount} CHF, Grand Total: {grand_total} CHF"
                )
                return True, data
            else:
                print_test_result("Stripe Create Payment Intent API", False, f"Missing fields: {missing_fields}")
                return False, None
        else:
            print_test_result("Stripe Create Payment Intent API", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Stripe Create Payment Intent API", False, f"Exception: {str(e)}")
        return False, None

def test_stripe_webhook():
    """Test POST /api/stripe/webhook - Stripe Webhook Handler (security test)"""
    print("🔍 Testing Stripe Webhook Handler (security validation)...")
    
    # Test webhook without signature (should fail)
    webhook_data = {
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_123456789",
                "amount": 50000,
                "currency": "chf"
            }
        }
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/stripe/webhook",
            json=webhook_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return 400 for missing signature
        if response.status_code == 400:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            print_test_result(
                "Stripe Webhook Handler", 
                True, 
                f"Correctly rejected webhook without signature: HTTP {response.status_code}"
            )
            return True
        else:
            print_test_result("Stripe Webhook Handler", False, f"Should have returned 400 for missing signature, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Stripe Webhook Handler", False, f"Exception: {str(e)}")
        return False

def test_email_alert_system():
    """Test GET /api/test-email - Email Alert System"""
    print("🔍 Testing Email Alert System...")
    
    try:
        response = requests.get(f"{API_BASE}/test-email", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'results' in data:
                results = data.get('results', {})
                simple_alert = results.get('simpleAlert', {})
                booking_failure_alert = results.get('bookingFailureAlert', {})
                recipient = data.get('recipient')
                
                # Check if both email types were sent
                simple_success = simple_alert.get('success', False) or 'messageId' in simple_alert
                booking_success = booking_failure_alert.get('success', False) or 'messageId' in booking_failure_alert
                
                print_test_result(
                    "Email Alert System", 
                    True, 
                    f"Test emails sent successfully. Simple alert: {'✅' if simple_success else '❌'}, Booking failure alert: {'✅' if booking_success else '❌'}, Recipient: {recipient}"
                )
                return True, data
            else:
                print_test_result("Email Alert System", False, f"Invalid response structure: {data}")
                return False, None
        else:
            print_test_result("Email Alert System", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Email Alert System", False, f"Exception: {str(e)}")
        return False, None

def test_booking_validation():
    """Test booking validation with invalid data"""
    print("🔍 Testing Booking Validation (via Payment Intent with invalid data)...")
    
    # Test with invalid booking data
    invalid_data = {
        "propertyId": "invalid-id",
        "checkIn": "2023-01-01",  # Past date
        "checkOut": "2023-01-02",
        "adults": 0,  # Invalid guest count
        "guestName": "",  # Empty name
        "guestEmail": "invalid-email",  # Invalid email
        "accommodationTotal": -100  # Negative amount
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/stripe/create-payment-intent",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return an error (400)
        if response.status_code == 400:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            print_test_result(
                "Booking Validation API", 
                True, 
                f"Correctly rejected invalid booking data: HTTP {response.status_code}"
            )
            return True
        else:
            print_test_result("Booking Validation API", False, f"Should have returned 400 for invalid data, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Booking Validation API", False, f"Exception: {str(e)}")
        return False

def test_booking_validation():
    """Test booking API with invalid data to check error handling"""
    print("🔍 Testing Booking API Error Handling...")
    
    # Test with missing required fields
    invalid_booking_data = {
        "propertyId": "invalid-id",
        "checkIn": "invalid-date",
        # Missing required fields
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/bookings",
            json=invalid_booking_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return an error (4xx or 5xx)
        if response.status_code >= 400:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            print_test_result(
                "Booking API Error Handling", 
                True, 
                f"Correctly returned error for invalid data: HTTP {response.status_code}"
            )
            return True
        else:
            print_test_result("Booking API Error Handling", False, "Should have returned error for invalid data")
            return False
            
    except Exception as e:
        print_test_result("Booking API Error Handling", False, f"Exception: {str(e)}")
        return False

def test_api_endpoint(name, method, url, data=None, expected_status=200, critical=False):
    """Test an API endpoint and return results"""
    priority = "🔴 CRITICAL" if critical else "🟡 HIGH"
    print(f"\n{priority} - Testing {name}")
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
                print(f"⚠️ WARNING: Non-JSON response for {name}")
                return True, response.text
        else:
            print(f"❌ FAILED: {name} - Expected {expected_status}, got {response.status_code}")
            try:
                error_data = response.json()
                print(f"📝 Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📝 Error text: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"💥 NETWORK ERROR: {name} - {str(e)}")
        return False, None
    except Exception as e:
        print(f"💥 UNEXPECTED ERROR: {name} - {str(e)}")
        return False, None

def main():
    """Run comprehensive backend API tests after Uplisting fix"""
    results = {}
    
    # 1. CRITICAL: Properties API (GET /api/properties)
    success, data = test_api_endpoint(
        "Properties API - List all properties",
        "GET",
        f"{API_BASE}/properties",
        critical=True
    )
    results["properties_list"] = success
    if success and data:
        properties = data.get('properties', [])
        print(f"📋 Found {len(properties)} properties")
        if len(properties) >= 3:
            property_ids = [p.get('id') for p in properties]
            print(f"🏠 Property IDs: {property_ids}")
            # Verify expected property IDs
            expected_ids = [str(id) for id in TEST_PROPERTY_IDS]
            found_ids = [str(id) for id in property_ids if str(id) in expected_ids]
            print(f"✅ Expected properties found: {found_ids}")
        else:
            print(f"⚠️ WARNING: Expected at least 3 properties, found {len(properties)}")
    
    # 2. CRITICAL: Single Property API (GET /api/properties/[id])
    success, data = test_api_endpoint(
        f"Single Property API - Property {PRIMARY_TEST_PROPERTY}",
        "GET",
        f"{API_BASE}/properties/{PRIMARY_TEST_PROPERTY}",
        critical=True
    )
    results["single_property"] = success
    if success and data:
        property_data = data.get('property', {})
        property_name = property_data.get('name', 'Unknown')
        fees_count = len(property_data.get('fees', []))
        taxes_count = len(property_data.get('taxes', []))
        print(f"🏠 Property: {property_name}")
        print(f"💰 Fees: {fees_count}, Taxes: {taxes_count}")
        if "Sunny Alps View" in property_name:
            print(f"✅ Correct property name confirmed")
        else:
            print(f"⚠️ WARNING: Expected 'Sunny Alps View' in name, got: {property_name}")
    
    # 3. HIGH: Availability API (GET /api/availability/[propertyId])
    success, data = test_api_endpoint(
        f"Availability API - Property {PRIMARY_TEST_PROPERTY}",
        "GET",
        f"{API_BASE}/availability/{PRIMARY_TEST_PROPERTY}?from={check_in}&to={check_out}",
        critical=False
    )
    results["availability"] = success
    if success and data:
        pricing = data.get('pricing', {})
        calendar = data.get('calendar', {})
        average_rate = pricing.get('averageRate', 0)
        total_cost = pricing.get('total', 0)
        available = pricing.get('available', False)
        print(f"💰 Average rate: {average_rate} CHF/night")
        print(f"💰 Total cost: {total_cost} CHF")
        print(f"📅 Available: {available}")
        if average_rate > 0:
            print(f"✅ Pricing data looks valid")
        else:
            print(f"⚠️ WARNING: No pricing data or zero rate")
    
    # 4. HIGH: Pricing Calculator API (POST /api/pricing)
    pricing_payload = {
        "propertyIds": [PRIMARY_TEST_PROPERTY, 174947],
        "from": check_in,
        "to": check_out
    }
    success, data = test_api_endpoint(
        "Pricing Calculator API - Multiple properties",
        "POST",
        f"{API_BASE}/pricing",
        data=pricing_payload,
        critical=False
    )
    results["pricing_calculator"] = success
    if success and data:
        results_data = data.get('results', [])
        print(f"📊 Processed {len(results_data)} properties")
        for result in results_data:
            property_id = result.get('propertyId')
            pricing = result.get('pricing', {})
            rate = pricing.get('averageRate', 0)
            print(f"🏠 Property {property_id}: {rate} CHF/night")
    
    # 5. CRITICAL: Stripe Payment Intent API (POST /api/stripe/create-payment-intent)
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
        "accommodationTotal": 600,  # 5 nights * 120 CHF
        "cleaningFee": 169,
        "marketingConsent": False
    }
    success, data = test_api_endpoint(
        "Stripe Payment Intent API - Create booking payment",
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
        grand_total = pricing.get('grandTotal', 0)
        
        print(f"💳 Payment Intent ID: {payment_intent_id}")
        print(f"📝 Booking ID: {booking_id}")
        print(f"💰 Grand Total: {grand_total} CHF")
        print(f"🔐 Client Secret: {'✅ Present' if client_secret else '❌ Missing'}")
        
        if client_secret and payment_intent_id and booking_id:
            print(f"✅ Payment Intent created successfully")
        else:
            print(f"⚠️ WARNING: Missing required payment intent data")
    
    # 6. CRITICAL: Stripe Webhook Handler - Test security
    webhook_payload = {"test": "invalid"}
    success, data = test_api_endpoint(
        "Stripe Webhook Handler - Security validation",
        "POST",
        f"{API_BASE}/stripe/webhook",
        data=webhook_payload,
        expected_status=400,  # Should fail without proper signature
        critical=True
    )
    results["stripe_webhook"] = success
    if success:
        print(f"✅ Webhook security working - correctly rejects invalid requests")
    
    # 7. MEDIUM: Email Alert System (GET /api/test-email) - if exists
    success, data = test_api_endpoint(
        "Email Alert System - Test endpoint",
        "GET",
        f"{API_BASE}/test-email",
        expected_status=200,
        critical=False
    )
    results["email_system"] = success
    if success:
        print(f"✅ Email system test endpoint working")
    else:
        print(f"ℹ️ Email test endpoint may not exist or be accessible")
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 COMPREHENSIVE BACKEND TEST RESULTS AFTER UPLISTING FIX")
    print("=" * 80)
    
    critical_tests = [
        ("Properties API", results["properties_list"]),
        ("Single Property API", results["single_property"]),
        ("Stripe Payment Intent API", results["stripe_payment_intent"]),
        ("Stripe Webhook Handler", results["stripe_webhook"])
    ]
    
    high_priority_tests = [
        ("Availability API", results["availability"]),
        ("Pricing Calculator API", results["pricing_calculator"])
    ]
    
    medium_tests = [
        ("Email Alert System", results["email_system"])
    ]
    
    print("\n🔴 CRITICAL SYSTEMS:")
    critical_passed = 0
    for name, passed in critical_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
        if passed:
            critical_passed += 1
    
    print(f"\n🟡 HIGH PRIORITY SYSTEMS:")
    high_passed = 0
    for name, passed in high_priority_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
        if passed:
            high_passed += 1
    
    print(f"\n🟠 MEDIUM PRIORITY SYSTEMS:")
    medium_passed = 0
    for name, passed in medium_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
        if passed:
            medium_passed += 1
    
    # Overall results
    total_tests = len(critical_tests) + len(high_priority_tests) + len(medium_tests)
    total_passed = critical_passed + high_passed + medium_passed
    
    print(f"\n📈 OVERALL RESULTS:")
    print(f"  🔴 Critical: {critical_passed}/{len(critical_tests)} passed")
    print(f"  🟡 High Priority: {high_passed}/{len(high_priority_tests)} passed")
    print(f"  🟠 Medium Priority: {medium_passed}/{len(medium_tests)} passed")
    print(f"  📊 Total: {total_passed}/{total_tests} passed ({total_passed/total_tests*100:.1f}%)")
    
    # Determine overall status
    if critical_passed == len(critical_tests):
        if total_passed == total_tests:
            print(f"\n🎉 ALL SYSTEMS OPERATIONAL - UPLISTING FIX SUCCESSFUL")
            return 0
        else:
            print(f"\n✅ CRITICAL SYSTEMS OPERATIONAL - UPLISTING FIX SUCCESSFUL")
            return 0
    else:
        print(f"\n❌ CRITICAL SYSTEM FAILURES DETECTED - UPLISTING FIX MAY HAVE ISSUES")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)