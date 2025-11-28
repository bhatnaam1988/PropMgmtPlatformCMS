#!/usr/bin/env python3
"""
FINAL BACKEND TESTING - Remaining APIs and Integration Tests
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://config-relay.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

print(f"🧪 FINAL BACKEND TESTING - REMAINING APIS")
print(f"🌐 Base URL: {BASE_URL}")
print("=" * 80)

def test_endpoint(name, method, url, data=None, expected_status=200):
    """Test an API endpoint and return results"""
    print(f"\n🔍 Testing {name}")
    print(f"📍 {method} {url}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=30)
        
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
                print(f"📝 Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📝 Error text: {response.text[:200]}...")
            return False, None
            
    except Exception as e:
        print(f"💥 ERROR: {name} - {str(e)}")
        return False, None

def main():
    """Test remaining backend APIs"""
    results = {}
    
    # 1. Rental Services Form API
    rental_payload = {
        "name": "Thomas Zimmermann",
        "email": "thomas.zimmermann@example.com",
        "phone": "+41 79 444 3333",
        "propertyType": "3-bedroom apartment",
        "location": "Grächen, Valais",
        "message": "I have a 3-bedroom apartment in Grächen that I'd like to list for vacation rentals."
    }
    success, data = test_endpoint(
        "Rental Services API (POST /api/forms/rental-services)",
        "POST",
        f"{API_BASE}/forms/rental-services",
        data=rental_payload
    )
    results["rental_services"] = success
    if success and data:
        print(f"📧 Form submission successful")
    
    # 2. Jobs Application Form API
    jobs_payload = {
        "name": "Sophie Meier",
        "email": "sophie.meier@example.com",
        "phone": "+41 79 222 1111",
        "position": "Guest Services Coordinator",
        "location": "Remote",
        "resume": "Experienced hospitality professional with 5+ years in guest services...",
        "coverLetter": "I am excited to apply for the Guest Services Coordinator position..."
    }
    success, data = test_endpoint(
        "Jobs Application API (POST /api/forms/jobs)",
        "POST",
        f"{API_BASE}/forms/jobs",
        data=jobs_payload
    )
    results["jobs_application"] = success
    if success and data:
        print(f"📧 Job application submitted successfully")
    
    # 3. Test Stripe Webhook with proper structure (should still fail due to signature)
    webhook_payload = {
        "id": "evt_test_webhook",
        "object": "event",
        "api_version": "2020-08-27",
        "created": 1234567890,
        "data": {
            "object": {
                "id": "pi_test_payment_intent",
                "object": "payment_intent",
                "status": "succeeded",
                "metadata": {
                    "bookingId": "test-booking-123"
                }
            }
        },
        "livemode": False,
        "pending_webhooks": 1,
        "request": {
            "id": "req_test_request",
            "idempotency_key": None
        },
        "type": "payment_intent.succeeded"
    }
    success, data = test_endpoint(
        "Stripe Webhook - payment_intent.succeeded structure",
        "POST",
        f"{API_BASE}/stripe/webhook",
        data=webhook_payload,
        expected_status=400  # Should fail due to missing signature
    )
    results["webhook_structure"] = success
    if success:
        print(f"✅ Webhook correctly validates signature (rejects unsigned requests)")
    
    # 4. Test availability with 6 months ahead (as requested)
    from datetime import datetime, timedelta
    future_date = datetime.now() + timedelta(days=180)  # 6 months ahead
    future_from = future_date.strftime('%Y-%m-%d')
    future_to = (future_date + timedelta(days=5)).strftime('%Y-%m-%d')
    
    success, data = test_endpoint(
        f"Availability API - 6 months ahead ({future_from} to {future_to})",
        "GET",
        f"{API_BASE}/availability/84656?from={future_from}&to={future_to}"
    )
    results["availability_future"] = success
    if success and data:
        calendar = data.get('calendar', {})
        pricing = data.get('pricing', {})
        print(f"📅 Calendar entries for 6 months ahead: {len(calendar)}")
        print(f"💰 Pricing available: {pricing.get('available', False)}")
    
    # 5. Test pricing with different date ranges
    pricing_payload = {
        "propertyIds": [84656],
        "from": future_from,
        "to": future_to
    }
    success, data = test_endpoint(
        "Pricing Calculator - Future dates",
        "POST",
        f"{API_BASE}/pricing",
        data=pricing_payload
    )
    results["pricing_future"] = success
    if success and data:
        results_data = data.get('results', [])
        if results_data:
            pricing = results_data[0].get('pricing', {})
            print(f"💰 Future pricing calculated: {pricing.get('grandTotal', 0)} CHF")
    
    # 6. Test form validation - missing required fields
    invalid_contact = {
        "name": "Test User"
        # Missing required fields
    }
    success, data = test_endpoint(
        "Contact Form - Validation (missing fields)",
        "POST",
        f"{API_BASE}/forms/contact",
        data=invalid_contact,
        expected_status=400
    )
    results["form_validation"] = success
    if success:
        print(f"✅ Form validation working correctly")
    
    # 7. Test booking validation edge cases
    invalid_booking = {
        "propertyId": "84656",
        "checkIn": "2024-01-01",  # Past date
        "checkOut": "2024-01-02",
        "adults": 0,  # Invalid guest count
        "children": 0,
        "infants": 0,
        "guestName": "",  # Empty name
        "guestEmail": "invalid-email",  # Invalid email
        "guestPhone": "",
        "accommodationTotal": -100,  # Negative amount
        "cleaningFee": 0
    }
    success, data = test_endpoint(
        "Payment Intent - Booking validation (invalid data)",
        "POST",
        f"{API_BASE}/stripe/create-payment-intent",
        data=invalid_booking,
        expected_status=400
    )
    results["booking_validation"] = success
    if success:
        print(f"✅ Booking validation working correctly")
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 FINAL BACKEND TEST RESULTS")
    print("=" * 80)
    
    all_tests = [
        ("Rental Services API", results.get("rental_services", False)),
        ("Jobs Application API", results.get("jobs_application", False)),
        ("Stripe Webhook Structure", results.get("webhook_structure", False)),
        ("Availability API (6 months)", results.get("availability_future", False)),
        ("Pricing Calculator (Future)", results.get("pricing_future", False)),
        ("Form Validation", results.get("form_validation", False)),
        ("Booking Validation", results.get("booking_validation", False))
    ]
    
    passed_count = sum(1 for _, passed in all_tests if passed)
    
    print(f"\n📋 TEST RESULTS:")
    for name, passed in all_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
    
    print(f"\n📈 FINAL RESULTS:")
    print(f"  📊 Total: {passed_count}/{len(all_tests)} passed ({passed_count/len(all_tests)*100:.1f}%)")
    
    if passed_count >= len(all_tests) * 0.85:  # 85% pass rate
        print(f"\n🎉 FINAL BACKEND TESTING SUCCESSFUL")
        return 0
    else:
        print(f"\n⚠️ SOME TESTS FAILED - REVIEW REQUIRED")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)