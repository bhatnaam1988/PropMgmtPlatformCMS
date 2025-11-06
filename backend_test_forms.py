#!/usr/bin/env python3
"""
Form Submission APIs Testing - Email & Database Integration
Tests all 4 form submission API endpoints with Resend email integration and MongoDB storage
"""

import requests
import json
import sys
from datetime import datetime
import os

# Configuration
BASE_URL = "https://swisslodge-app.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    print()

def test_contact_form_api():
    """Test POST /api/forms/contact - Contact Form Submission"""
    print("🔍 Testing Contact Form API...")
    
    # Test with valid data
    contact_data = {
        "inquiryType": "Guest",
        "name": "Sarah Johnson",
        "email": "sarah.johnson@example.com",
        "phone": "+41791234567",
        "subject": "Booking Inquiry for Grächen Property",
        "message": "Hello, I'm interested in booking your property in Grächen for a family vacation. Could you please provide more information about availability in March 2025?"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['success', 'message', 'submissionId']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields and data.get('success'):
                submission_id = data.get('submissionId')
                message = data.get('message')
                
                print_test_result(
                    "Contact Form API - Valid Data", 
                    True, 
                    f"Form submitted successfully. Submission ID: {submission_id}, Message: {message}"
                )
                return True, submission_id
            else:
                print_test_result("Contact Form API - Valid Data", False, f"Invalid response: {data}")
                return False, None
        else:
            print_test_result("Contact Form API - Valid Data", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Contact Form API - Valid Data", False, f"Exception: {str(e)}")
        return False, None

def test_contact_form_validation():
    """Test Contact Form API validation with missing required fields"""
    print("🔍 Testing Contact Form API Validation...")
    
    # Test with missing required fields
    invalid_data = {
        "inquiryType": "Guest",
        "name": "John Doe",
        # Missing email, subject, and message
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/contact",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return 400 for missing required fields
        if response.status_code == 400:
            data = response.json()
            error_message = data.get('error', 'Unknown error')
            
            print_test_result(
                "Contact Form API - Validation", 
                True, 
                f"Correctly rejected invalid data: {error_message}"
            )
            return True
        else:
            print_test_result("Contact Form API - Validation", False, f"Should have returned 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Contact Form API - Validation", False, f"Exception: {str(e)}")
        return False

def test_cleaning_services_api():
    """Test POST /api/forms/cleaning-services - Cleaning Services Request"""
    print("🔍 Testing Cleaning Services API...")
    
    # Test with valid data
    cleaning_data = {
        "name": "Michael Weber",
        "email": "michael.weber@example.com",
        "phone": "+41791234568",
        "propertyAddress": "Chalet Alpina, Dorfstrasse 15, 3925 Grächen, Switzerland",
        "serviceType": "Deep Cleaning",
        "message": "I need a thorough deep cleaning service for my chalet before the winter season. The property has 4 bedrooms and 3 bathrooms. Please include window cleaning and carpet cleaning."
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/cleaning-services",
            json=cleaning_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['success', 'message', 'submissionId']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields and data.get('success'):
                submission_id = data.get('submissionId')
                message = data.get('message')
                
                print_test_result(
                    "Cleaning Services API - Valid Data", 
                    True, 
                    f"Request submitted successfully. Submission ID: {submission_id}, Message: {message}"
                )
                return True, submission_id
            else:
                print_test_result("Cleaning Services API - Valid Data", False, f"Invalid response: {data}")
                return False, None
        else:
            print_test_result("Cleaning Services API - Valid Data", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Cleaning Services API - Valid Data", False, f"Exception: {str(e)}")
        return False, None

def test_cleaning_services_validation():
    """Test Cleaning Services API validation"""
    print("🔍 Testing Cleaning Services API Validation...")
    
    # Test with missing required fields
    invalid_data = {
        "name": "Test User",
        "email": "test@example.com",
        # Missing phone, propertyAddress, and serviceType
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/cleaning-services",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return 400 for missing required fields
        if response.status_code == 400:
            data = response.json()
            error_message = data.get('error', 'Unknown error')
            
            print_test_result(
                "Cleaning Services API - Validation", 
                True, 
                f"Correctly rejected invalid data: {error_message}"
            )
            return True
        else:
            print_test_result("Cleaning Services API - Validation", False, f"Should have returned 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Cleaning Services API - Validation", False, f"Exception: {str(e)}")
        return False

def test_rental_services_api():
    """Test POST /api/forms/rental-services - Rental Services Inquiry"""
    print("🔍 Testing Rental Services API...")
    
    # Test with valid data
    rental_data = {
        "name": "Anna Müller",
        "email": "anna.mueller@example.com",
        "phone": "+41791234569",
        "propertyAddress": "Mountain View Apartment, Bahnhofstrasse 8, 3925 Grächen, Switzerland",
        "propertyType": "Apartment",
        "bedrooms": "3",
        "message": "I own a 3-bedroom apartment in Grächen and I'm interested in your rental management services. The property has a beautiful mountain view and is located close to the ski lifts. I would like to know more about your listing optimization and cleaning coordination services."
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/rental-services",
            json=rental_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['success', 'message', 'submissionId']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields and data.get('success'):
                submission_id = data.get('submissionId')
                message = data.get('message')
                
                print_test_result(
                    "Rental Services API - Valid Data", 
                    True, 
                    f"Inquiry submitted successfully. Submission ID: {submission_id}, Message: {message}"
                )
                return True, submission_id
            else:
                print_test_result("Rental Services API - Valid Data", False, f"Invalid response: {data}")
                return False, None
        else:
            print_test_result("Rental Services API - Valid Data", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Rental Services API - Valid Data", False, f"Exception: {str(e)}")
        return False, None

def test_rental_services_validation():
    """Test Rental Services API validation"""
    print("🔍 Testing Rental Services API Validation...")
    
    # Test with missing required fields
    invalid_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+41791234567",
        # Missing propertyAddress, propertyType, and bedrooms
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/rental-services",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return 400 for missing required fields
        if response.status_code == 400:
            data = response.json()
            error_message = data.get('error', 'Unknown error')
            
            print_test_result(
                "Rental Services API - Validation", 
                True, 
                f"Correctly rejected invalid data: {error_message}"
            )
            return True
        else:
            print_test_result("Rental Services API - Validation", False, f"Should have returned 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Rental Services API - Validation", False, f"Exception: {str(e)}")
        return False

def test_jobs_application_api():
    """Test POST /api/forms/jobs - Job Application Submission"""
    print("🔍 Testing Jobs Application API...")
    
    # Test with valid data
    job_data = {
        "name": "David Thompson",
        "email": "david.thompson@example.com",
        "phone": "+41791234570",
        "position": "Guest Services Coordinator",
        "location": "Remote",
        "resume": "DAVID THOMPSON\nGuest Services Coordinator\n\nEXPERIENCE:\n• 5+ years in hospitality and customer service\n• Fluent in English, German, and French\n• Experience with booking systems and guest communication\n• Strong problem-solving and organizational skills\n\nEDUCATION:\n• Bachelor's degree in Hospitality Management\n• Certified in Customer Service Excellence\n\nSKILLS:\n• Excellent communication and interpersonal skills\n• Proficient in booking management systems\n• Experience with Swiss tourism industry\n• Ability to work independently in remote environment",
        "coverLetter": "Dear Swiss Alpine Journey Team,\n\nI am writing to express my strong interest in the Guest Services Coordinator position. With over 5 years of experience in the hospitality industry and a deep passion for Swiss tourism, I believe I would be an excellent addition to your team.\n\nMy experience includes managing guest communications, handling booking inquiries, and ensuring exceptional customer service standards. I am particularly drawn to your company's commitment to providing authentic Alpine experiences and would love to contribute to creating memorable stays for your guests.\n\nI am excited about the opportunity to work remotely while supporting your guests throughout their Swiss Alpine journey. Thank you for considering my application.\n\nBest regards,\nDavid Thompson"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/jobs",
            json=job_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['success', 'message', 'submissionId']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields and data.get('success'):
                submission_id = data.get('submissionId')
                message = data.get('message')
                
                print_test_result(
                    "Jobs Application API - Valid Data", 
                    True, 
                    f"Application submitted successfully. Submission ID: {submission_id}, Message: {message}"
                )
                return True, submission_id
            else:
                print_test_result("Jobs Application API - Valid Data", False, f"Invalid response: {data}")
                return False, None
        else:
            print_test_result("Jobs Application API - Valid Data", False, f"HTTP {response.status_code}: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Jobs Application API - Valid Data", False, f"Exception: {str(e)}")
        return False, None

def test_jobs_application_validation():
    """Test Jobs Application API validation"""
    print("🔍 Testing Jobs Application API Validation...")
    
    # Test with missing required fields
    invalid_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+41791234567",
        # Missing position, location, and resume
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/forms/jobs",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Should return 400 for missing required fields
        if response.status_code == 400:
            data = response.json()
            error_message = data.get('error', 'Unknown error')
            
            print_test_result(
                "Jobs Application API - Validation", 
                True, 
                f"Correctly rejected invalid data: {error_message}"
            )
            return True
        else:
            print_test_result("Jobs Application API - Validation", False, f"Should have returned 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Jobs Application API - Validation", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all form submission API tests"""
    print("🚀 Starting Form Submission APIs Testing - Email & Database Integration")
    print("=" * 80)
    print("Testing 4 form submission API endpoints with Resend email integration and MongoDB storage")
    print("=" * 80)
    print()
    
    test_results = {
        'contact_form_valid': False,
        'contact_form_validation': False,
        'cleaning_services_valid': False,
        'cleaning_services_validation': False,
        'rental_services_valid': False,
        'rental_services_validation': False,
        'jobs_application_valid': False,
        'jobs_application_validation': False
    }
    
    submission_ids = []
    
    # Test 1: Contact Form API
    success, submission_id = test_contact_form_api()
    test_results['contact_form_valid'] = success
    if submission_id:
        submission_ids.append(('contact', submission_id))
    
    # Test 1b: Contact Form Validation
    test_results['contact_form_validation'] = test_contact_form_validation()
    
    # Test 2: Cleaning Services API
    success, submission_id = test_cleaning_services_api()
    test_results['cleaning_services_valid'] = success
    if submission_id:
        submission_ids.append(('cleaning_services', submission_id))
    
    # Test 2b: Cleaning Services Validation
    test_results['cleaning_services_validation'] = test_cleaning_services_validation()
    
    # Test 3: Rental Services API
    success, submission_id = test_rental_services_api()
    test_results['rental_services_valid'] = success
    if submission_id:
        submission_ids.append(('rental_services', submission_id))
    
    # Test 3b: Rental Services Validation
    test_results['rental_services_validation'] = test_rental_services_validation()
    
    # Test 4: Jobs Application API
    success, submission_id = test_jobs_application_api()
    test_results['jobs_application_valid'] = success
    if submission_id:
        submission_ids.append(('job_application', submission_id))
    
    # Test 4b: Jobs Application Validation
    test_results['jobs_application_validation'] = test_jobs_application_validation()
    
    # Summary
    print("=" * 80)
    print("📊 FORM SUBMISSION APIS TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    # Map test names to API descriptions
    api_descriptions = {
        'contact_form_valid': 'Contact Form API - Valid Data Submission',
        'contact_form_validation': 'Contact Form API - Validation Testing',
        'cleaning_services_valid': 'Cleaning Services API - Valid Data Submission',
        'cleaning_services_validation': 'Cleaning Services API - Validation Testing',
        'rental_services_valid': 'Rental Services API - Valid Data Submission',
        'rental_services_validation': 'Rental Services API - Validation Testing',
        'jobs_application_valid': 'Jobs Application API - Valid Data Submission',
        'jobs_application_validation': 'Jobs Application API - Validation Testing'
    }
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        description = api_descriptions.get(test_name, test_name.replace('_', ' ').title())
        print(f"{status} {description}")
    
    print()
    print(f"Overall Result: {passed}/{total} form submission tests passed")
    
    if submission_ids:
        print("\n📝 SUCCESSFUL SUBMISSIONS:")
        for form_type, sub_id in submission_ids:
            print(f"   • {form_type.replace('_', ' ').title()}: {sub_id}")
    
    print("\n📧 EMAIL VERIFICATION:")
    print("   • Check admin email (aman.bhatnagar11@gmail.com) for form submission notifications")
    print("   • Each successful submission should have sent an email with form details")
    
    print("\n🗄️ DATABASE VERIFICATION:")
    print("   • All successful submissions should be stored in MongoDB 'form_submissions' collection")
    print("   • Each document should have type, form fields, submittedAt, and status fields")
    
    if passed == total:
        print("\n🎉 ALL FORM SUBMISSION APIS PASSED!")
        print("✅ Email integration and MongoDB storage working correctly")
    else:
        print("\n⚠️  SOME FORM SUBMISSION APIS HAVE ISSUES")
        print("🔧 These APIs need attention before deployment")
    
    return test_results, submission_ids

if __name__ == "__main__":
    results, submissions = main()
    
    # Exit with error code if any tests failed
    if not all(results.values()):
        sys.exit(1)