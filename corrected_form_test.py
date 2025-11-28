#!/usr/bin/env python3
"""
CORRECTED FORM API TESTING - With proper required fields
"""

import requests
import json

# Configuration
BASE_URL = "https://rental-fix.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

print(f"🧪 CORRECTED FORM API TESTING")
print("=" * 50)

def test_endpoint(name, method, url, data=None, expected_status=200):
    """Test an API endpoint and return results"""
    print(f"\n🔍 Testing {name}")
    print(f"📍 {method} {url}")
    
    try:
        if method == "POST":
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
    """Test form APIs with correct required fields"""
    results = {}
    
    # 1. Rental Services Form API - with ALL required fields
    rental_payload = {
        "name": "Thomas Zimmermann",
        "email": "thomas.zimmermann@example.com",
        "phone": "+41 79 444 3333",
        "propertyAddress": "Dorfstrasse 15, 3925 Grächen",  # Required
        "propertyType": "3-bedroom apartment",  # Required
        "bedrooms": "3",  # Required
        "message": "I have a 3-bedroom apartment in Grächen that I'd like to list for vacation rentals. It has mountain views and modern amenities."
    }
    success, data = test_endpoint(
        "Rental Services API (POST /api/forms/rental-services)",
        "POST",
        f"{API_BASE}/forms/rental-services",
        data=rental_payload
    )
    results["rental_services"] = success
    if success and data:
        submission_id = data.get('submissionId')
        print(f"📧 Form submitted successfully - ID: {submission_id}")
    
    # 2. Jobs Application Form API - with ALL required fields
    jobs_payload = {
        "name": "Sophie Meier",
        "email": "sophie.meier@example.com",
        "phone": "+41 79 222 1111",  # Optional
        "position": "Guest Services Coordinator",  # Required
        "message": "I am excited to apply for the Guest Services Coordinator position. With 5+ years of experience in hospitality and fluency in German, French, and English, I believe I would be a great addition to your team. I have experience managing guest inquiries, coordinating cleaning services, and ensuring exceptional guest experiences."  # Required (cover letter)
    }
    success, data = test_endpoint(
        "Jobs Application API (POST /api/forms/jobs)",
        "POST",
        f"{API_BASE}/forms/jobs",
        data=jobs_payload
    )
    results["jobs_application"] = success
    if success and data:
        submission_id = data.get('submissionId')
        print(f"📧 Job application submitted successfully - ID: {submission_id}")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 CORRECTED FORM API TEST RESULTS")
    print("=" * 50)
    
    all_tests = [
        ("Rental Services API", results.get("rental_services", False)),
        ("Jobs Application API", results.get("jobs_application", False))
    ]
    
    passed_count = sum(1 for _, passed in all_tests if passed)
    
    print(f"\n📋 TEST RESULTS:")
    for name, passed in all_tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {name}")
    
    print(f"\n📈 RESULTS:")
    print(f"  📊 Total: {passed_count}/{len(all_tests)} passed ({passed_count/len(all_tests)*100:.1f}%)")
    
    return passed_count == len(all_tests)

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n🎉 ALL FORM APIS WORKING CORRECTLY")
    else:
        print(f"\n⚠️ SOME FORM APIS FAILED")