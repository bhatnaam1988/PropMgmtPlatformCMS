#!/usr/bin/env python3
"""
Backend API Testing for Cozy Retreats Booking Flow
Tests the complete booking flow backend APIs
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import os

# Configuration
BASE_URL = "https://alpine-booking-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

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

def test_booking_creation(property_id):
    """Test POST /api/bookings - Create booking with Uplisting"""
    print(f"🔍 Testing Booking Creation API for property ID: {property_id}...")
    print("⚠️  WARNING: This creates a REAL booking in Uplisting!")
    
    # Use future dates for testing
    check_in = (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d')
    check_out = (datetime.now() + timedelta(days=65)).strftime('%Y-%m-%d')
    
    booking_data = {
        "propertyId": property_id,
        "checkIn": check_in,
        "checkOut": check_out,
        "adults": 2,
        "children": 0,
        "infants": 0,
        "guestName": "Test User API",
        "guestEmail": "test.api@example.com",
        "guestPhone": "+41791234567",
        "marketingConsent": False,
        "notes": "Test booking from automated API testing - Please cancel if created"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/bookings",
            json=booking_data,
            headers={'Content-Type': 'application/json'},
            timeout=60  # Longer timeout for booking creation
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'booking' in data:
                booking_id = data.get('bookingId')
                payment_url = data.get('paymentUrl')
                
                # Check if redirect URLs are properly formatted
                success_url_check = f"{BASE_URL}/booking/success" in str(data)
                failure_url_check = f"{BASE_URL}/booking/failure" in str(data)
                
                print_test_result(
                    "Booking Creation API", 
                    True, 
                    f"Booking ID: {booking_id}, Payment URL: {'Present' if payment_url else 'Missing'}, Redirect URLs configured: {success_url_check or failure_url_check}"
                )
                
                # Additional check for payment URL format
                if payment_url and ('uplisting' in payment_url.lower() or 'http' in payment_url):
                    print("   ✅ Payment URL appears valid")
                else:
                    print("   ⚠️  Payment URL may be invalid or missing")
                
                return True, data
            else:
                print_test_result("Booking Creation API", False, f"Invalid response structure: {data}")
                return False, None
        else:
            error_details = response.text
            try:
                error_json = response.json()
                error_details = error_json.get('error', error_details)
            except:
                pass
            
            print_test_result("Booking Creation API", False, f"HTTP {response.status_code}: {error_details}")
            return False, None
            
    except Exception as e:
        print_test_result("Booking Creation API", False, f"Exception: {str(e)}")
        return False, None

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
    """Run all backend API tests"""
    print("🚀 Starting Backend API Tests for Cozy Retreats Booking Flow")
    print("=" * 70)
    print()
    
    test_results = {
        'properties_list': False,
        'single_property': False,
        'availability': False,
        'booking_creation': False,
        'booking_validation': False
    }
    
    # Test 1: Get properties list
    property_id, properties = test_properties_list()
    test_results['properties_list'] = property_id is not None
    
    if not property_id:
        print("❌ Cannot continue testing without a valid property ID")
        return test_results
    
    # Test 2: Get single property details
    success, property_data = test_single_property(property_id)
    test_results['single_property'] = success
    
    # Test 3: Get availability and pricing
    success, availability_data = test_availability(property_id)
    test_results['availability'] = success
    
    # Test 4: Test booking validation (error handling)
    test_results['booking_validation'] = test_booking_validation()
    
    # Test 5: Create booking (WARNING: Creates real booking!)
    print("⚠️  IMPORTANT: The next test creates a REAL booking in Uplisting!")
    print("   This booking should be cancelled manually if created successfully.")
    print("   Proceeding in 3 seconds...")
    import time
    time.sleep(3)
    
    success, booking_data = test_booking_creation(property_id)
    test_results['booking_creation'] = success
    
    # Summary
    print("=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name.replace('_', ' ').title()}")
    
    print()
    print(f"Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend APIs are working correctly!")
    else:
        print("⚠️  Some backend APIs have issues that need attention.")
    
    return test_results

if __name__ == "__main__":
    results = main()
    
    # Exit with error code if any tests failed
    if not all(results.values()):
        sys.exit(1)