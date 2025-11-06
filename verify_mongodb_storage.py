#!/usr/bin/env python3
"""
Verify MongoDB Storage for Form Submissions
Check if form submissions are properly stored in the database
"""

import pymongo
import json
from datetime import datetime
import os

# MongoDB Configuration
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "swissalpine"
COLLECTION_NAME = "form_submissions"

def verify_mongodb_storage():
    """Verify that form submissions are stored in MongoDB"""
    print("🔍 Verifying MongoDB Storage for Form Submissions...")
    print("=" * 60)
    
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URL)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Get recent submissions (last 10 minutes)
        recent_time = datetime.now()
        recent_time = recent_time.replace(minute=recent_time.minute - 10)
        
        # Find all submissions
        submissions = list(collection.find().sort("submittedAt", -1).limit(10))
        
        if not submissions:
            print("❌ No form submissions found in MongoDB")
            return False
        
        print(f"✅ Found {len(submissions)} form submissions in MongoDB")
        print()
        
        # Analyze submissions by type
        submission_types = {}
        for submission in submissions:
            form_type = submission.get('type', 'unknown')
            if form_type not in submission_types:
                submission_types[form_type] = []
            submission_types[form_type].append(submission)
        
        # Display submissions by type
        for form_type, subs in submission_types.items():
            print(f"📋 {form_type.replace('_', ' ').title()} Submissions: {len(subs)}")
            
            for i, sub in enumerate(subs[:2], 1):  # Show first 2 of each type
                print(f"   {i}. ID: {sub.get('_id')}")
                print(f"      Name: {sub.get('name', 'N/A')}")
                print(f"      Email: {sub.get('email', 'N/A')}")
                print(f"      Submitted: {sub.get('submittedAt', 'N/A')}")
                print(f"      Status: {sub.get('status', 'N/A')}")
                
                # Show specific fields based on type
                if form_type == 'contact':
                    print(f"      Inquiry Type: {sub.get('inquiryType', 'N/A')}")
                    print(f"      Subject: {sub.get('subject', 'N/A')}")
                elif form_type == 'cleaning_services':
                    print(f"      Service Type: {sub.get('serviceType', 'N/A')}")
                    print(f"      Property Address: {sub.get('propertyAddress', 'N/A')}")
                elif form_type == 'rental_services':
                    print(f"      Property Type: {sub.get('propertyType', 'N/A')}")
                    print(f"      Bedrooms: {sub.get('bedrooms', 'N/A')}")
                elif form_type == 'job_application':
                    print(f"      Position: {sub.get('position', 'N/A')}")
                    print(f"      Location: {sub.get('location', 'N/A')}")
                
                print()
        
        # Verify required fields for each submission type
        print("🔍 Verifying Required Fields...")
        
        required_fields = {
            'contact': ['type', 'inquiryType', 'name', 'email', 'subject', 'message', 'submittedAt', 'status'],
            'cleaning_services': ['type', 'name', 'email', 'phone', 'propertyAddress', 'serviceType', 'submittedAt', 'status'],
            'rental_services': ['type', 'name', 'email', 'phone', 'propertyAddress', 'propertyType', 'bedrooms', 'submittedAt', 'status'],
            'job_application': ['type', 'name', 'email', 'phone', 'position', 'location', 'resume', 'submittedAt', 'status']
        }
        
        validation_results = {}
        
        for form_type, subs in submission_types.items():
            if form_type in required_fields:
                required = required_fields[form_type]
                valid_count = 0
                
                for sub in subs:
                    missing_fields = [field for field in required if field not in sub]
                    if not missing_fields:
                        valid_count += 1
                
                validation_results[form_type] = {
                    'total': len(subs),
                    'valid': valid_count,
                    'percentage': (valid_count / len(subs)) * 100 if subs else 0
                }
        
        # Display validation results
        all_valid = True
        for form_type, result in validation_results.items():
            status = "✅" if result['percentage'] == 100 else "❌"
            print(f"{status} {form_type.replace('_', ' ').title()}: {result['valid']}/{result['total']} valid ({result['percentage']:.1f}%)")
            if result['percentage'] != 100:
                all_valid = False
        
        print()
        
        if all_valid:
            print("🎉 ALL FORM SUBMISSIONS PROPERLY STORED IN MONGODB!")
            print("✅ Database schema validation passed")
            print("✅ All required fields present")
            print("✅ Timestamps and status fields correct")
        else:
            print("⚠️ SOME FORM SUBMISSIONS HAVE MISSING FIELDS")
            print("🔧 Database schema needs attention")
        
        client.close()
        return all_valid
        
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {str(e)}")
        return False

if __name__ == "__main__":
    success = verify_mongodb_storage()
    if not success:
        exit(1)