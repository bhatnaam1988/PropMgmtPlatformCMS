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

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    print()

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

def main():
    """Run all backend API regression tests"""
    print("🚀 Starting Backend API Regression Tests - Phase 1 New Pages Integration")
    print("=" * 80)
    print("Testing 8 critical backend APIs to ensure no regression after new page integration")
    print("=" * 80)
    print()
    
    test_results = {
        'properties_list': False,
        'single_property': False,
        'availability': False,
        'pricing_calculator': False,
        'stripe_payment_intent': False,
        'stripe_webhook': False,
        'email_alert_system': False,
        'booking_validation': False
    }
    
    # Test 1: Properties API - List all properties
    property_id, properties = test_properties_list()
    test_results['properties_list'] = property_id is not None
    
    if not property_id:
        print("❌ Cannot continue testing without a valid property ID")
        return test_results
    
    # Extract property IDs for bulk testing
    property_ids = [prop.get('id') for prop in properties if prop.get('id')]
    
    # Test 2: Single Property API - Property details
    success, property_data = test_single_property(property_id)
    test_results['single_property'] = success
    
    # Test 3: Availability API - Property availability & pricing
    success, availability_data = test_availability(property_id)
    test_results['availability'] = success
    
    # Test 4: Pricing Calculator API - Bulk pricing calculations
    success, pricing_data = test_pricing_calculator(property_ids)
    test_results['pricing_calculator'] = success
    
    # Test 5: Stripe Create Payment Intent API
    success, payment_data = test_stripe_payment_intent(property_id)
    test_results['stripe_payment_intent'] = success
    
    # Test 6: Stripe Webhook Handler (security test)
    test_results['stripe_webhook'] = test_stripe_webhook()
    
    # Test 7: Email Alert System
    success, email_data = test_email_alert_system()
    test_results['email_alert_system'] = success
    
    # Test 8: Booking Validation API
    test_results['booking_validation'] = test_booking_validation()
    
    # Summary
    print("=" * 80)
    print("📊 BACKEND REGRESSION TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    # Map test names to API descriptions
    api_descriptions = {
        'properties_list': 'Properties API - GET /api/properties',
        'single_property': 'Single Property API - GET /api/properties/[id]',
        'availability': 'Availability API - GET /api/availability/[propertyId]',
        'pricing_calculator': 'Pricing Calculator API - POST /api/pricing',
        'stripe_payment_intent': 'Stripe Create Payment Intent - POST /api/stripe/create-payment-intent',
        'stripe_webhook': 'Stripe Webhook Handler - POST /api/stripe/webhook',
        'email_alert_system': 'Email Alert System - GET /api/test-email',
        'booking_validation': 'Booking Validation API - POST /api/bookings'
    }
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        description = api_descriptions.get(test_name, test_name.replace('_', ' ').title())
        print(f"{status} {description}")
    
    print()
    print(f"Overall Result: {passed}/{total} backend APIs passed regression testing")
    
    if passed == total:
        print("🎉 ALL BACKEND APIS PASSED REGRESSION TESTING!")
        print("✅ No regression detected after new page integration")
    else:
        print("⚠️  REGRESSION DETECTED: Some backend APIs have issues")
        print("🔧 These APIs need attention before deployment")
    
    return test_results

if __name__ == "__main__":
    results = main()
    
    # Exit with error code if any tests failed
    if not all(results.values()):
        sys.exit(1)