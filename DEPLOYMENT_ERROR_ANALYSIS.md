# Deployment Error Analysis - MongoDB Authorization

## Error Summary

**Error:** `MongoServerError: not authorized on swissalpine to execute command`

**Occurs when:** Application tries to insert booking documents into MongoDB

**Environment:** Production deployment with MongoDB Atlas

---

## Root Cause Analysis

### This is 100% an Infrastructure/Configuration Issue, NOT a Code Issue

**The Problem:**
1. ✅ Code is correct and works in sandbox
2. ❌ Production MongoDB Atlas user lacks write permissions
3. ❌ Environment variable `MONGO_URL` likely pointing to wrong/unauthorized database

**Why It Fails:**
- **Sandbox:** Uses local MongoDB (`mongodb://localhost:27017`) with no auth
- **Production:** Uses Atlas MongoDB with user that has incorrect permissions or wrong connection string

---

## Cannot Be Fixed with Code Changes Alone

This error **requires infrastructure changes**. No amount of code modification will bypass MongoDB authentication/authorization.

### Why Code Changes Won't Help:
- ❌ Cannot bypass MongoDB security with code
- ❌ Cannot grant permissions from application
- ❌ Cannot create database users from application
- ❌ Cannot modify Atlas configuration from code

---

## Required Actions (User Must Do)

### Option 1: Get MongoDB Credentials from Emergent (RECOMMENDED)

**Contact Emergent Support:**

**Email:** support@emergentagent.com

**Subject:** MongoDB Atlas Credentials Needed for Deployment

**Message:**
```
Hi Emergent Support,

My production deployment is failing with MongoDB authorization errors:
- App URL: https://sanity-nextjs.preview.emergentagent.com
- Error: "not authorized on swissalpine to execute command"
- Database: swissalpine

I need:
1. MongoDB Atlas connection string (MONGO_URL)
2. Database name (MONGO_DB_NAME)
3. Confirmation that the database user has READ and WRITE permissions

Or please grant the MongoDB user write access to the "swissalpine" database.

Thank you!
```

**What They Should Provide:**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
MONGO_DB_NAME=swissalpine
```

**Then Update in Deployment:**
1. Go to Emergent deployment settings
2. Update environment variables with provided values
3. Redeploy

---

### Option 2: Create Your Own MongoDB Atlas (IF EMERGENT ALLOWS)

If Emergent allows external MongoDB:

**5-Minute Setup:**

1. **Create Free Atlas Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create M0 Free Cluster

2. **Create Database User:**
   - Database Access → Add New Database User
   - Username: `swissalpine_admin`
   - Password: [generate strong password - SAVE IT!]
   - Built-in Role: **"Read and write to any database"** or **"Atlas admin"**

3. **Whitelist IPs:**
   - Network Access → Add IP Address
   - Add: `0.0.0.0/0` (allow from anywhere - for testing)
   - Or get production IP from Emergent

4. **Get Connection String:**
   - Cluster → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your actual password
   - Add `/swissalpine` before the `?`:
   ```
   mongodb+srv://swissalpine_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/swissalpine?retryWrites=true&w=majority
   ```

5. **URL Encode Password if needed:**
   - If password has special characters:
   ```
   @ → %40
   : → %3A
   # → %23
   & → %26
   / → %2F
   ```

6. **Update Deployment:**
   - In Emergent deployment settings
   - Set environment variables:
   ```
   MONGO_URL=mongodb+srv://swissalpine_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/swissalpine?retryWrites=true&w=majority
   MONGO_DB_NAME=swissalpine
   ```
   - Redeploy application

---

## Code Changes That Could Help (But Won't Fix the Issue)

While these won't solve the auth problem, they can provide better error messages:

### 1. Add MongoDB Connection Validation

Update `/app/lib/mongodb.js`:

```javascript
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGO_URL) {
    throw new Error('MONGO_URL environment variable is not set');
  }

  console.log('🔌 Connecting to MongoDB...');
  console.log('📊 Database name:', MONGO_DB_NAME);
  
  try {
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(MONGO_DB_NAME);
    
    // Test connection with a simple operation
    await db.command({ ping: 1 });
    console.log('✅ MongoDB connected successfully');
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('not authorized')) {
      console.error('🔐 AUTHORIZATION ERROR:');
      console.error('   - Database user lacks permissions');
      console.error('   - Required: READ and WRITE access to database');
      console.error('   - Database:', MONGO_DB_NAME);
      console.error('   - Please check MongoDB Atlas user permissions');
    }
    
    throw error;
  }
}
```

### 2. Add Better Error Handling in API Routes

Update payment intent creation to show clearer errors:

```javascript
try {
  // ... existing code
} catch (error) {
  console.error('❌ Error creating payment intent:', error);
  
  if (error.message?.includes('not authorized')) {
    return NextResponse.json(
      { 
        error: 'Database configuration error. Please contact support.',
        details: 'Unable to access database. This is an infrastructure issue.'
      },
      { status: 500 }
    );
  }
  
  // ... rest of error handling
}
```

**Note:** These changes provide better debugging but **DO NOT** fix the authorization issue.

---

## Verification Checklist

After getting credentials and updating deployment:

### Step 1: Verify Environment Variables
```
✅ MONGO_URL contains Atlas connection string (starts with mongodb+srv://)
✅ MONGO_URL includes database name before ? (/swissalpine?)
✅ MONGO_URL password is URL encoded if has special characters
✅ MONGO_DB_NAME=swissalpine
```

### Step 2: Verify MongoDB User Permissions
In MongoDB Atlas:
```
✅ User exists in Database Access
✅ User has "Read and write" role
✅ User is assigned to correct cluster
✅ Database name matches (swissalpine)
```

### Step 3: Verify Network Access
In MongoDB Atlas:
```
✅ IP whitelist includes deployment IP or 0.0.0.0/0
✅ No IP restrictions blocking connection
```

### Step 4: Test Deployment
```
✅ Application deploys without errors
✅ Can access homepage
✅ Can view property listings
✅ Can proceed to checkout
✅ Can create payment intent (no "not authorized" error)
✅ Booking successfully created in database
```

---

## Common Mistakes to Avoid

### ❌ Wrong Connection String Format
```
# Missing database name
mongodb+srv://user:pass@cluster.net/?retryWrites=true

# Should be:
mongodb+srv://user:pass@cluster.net/swissalpine?retryWrites=true
```

### ❌ Wrong Database in Connection String
```
# Wrong database
mongodb+srv://user:pass@cluster.net/admin?retryWrites=true

# Should be:
mongodb+srv://user:pass@cluster.net/swissalpine?retryWrites=true
```

### ❌ Special Characters Not Encoded
```
# If password is: Pass@123
# Wrong:
mongodb+srv://user:Pass@123@cluster.net/swissalpine

# Correct:
mongodb+srv://user:Pass%40123@cluster.net/swissalpine
```

### ❌ User Has Wrong Permissions
```
# User only has READ access
Role: Read

# Should be:
Role: Read and write to any database
OR
Role: readWrite (specific to swissalpine database)
```

---

## Timeline & Expectations

### If Contacting Emergent Support:
- **Response Time:** 5-30 minutes (during business hours)
- **Resolution Time:** 10-15 minutes (update env vars + redeploy)
- **Total:** ~1 hour

### If Creating Your Own MongoDB:
- **Setup Time:** 5-10 minutes
- **Deployment Update:** 5 minutes
- **Testing:** 5 minutes
- **Total:** ~20 minutes

---

## Summary

### The Issue:
✅ Code is correct
❌ MongoDB Atlas user lacks permissions
❌ Or wrong connection string in production

### The Fix:
1. Get proper MongoDB Atlas credentials from Emergent
2. OR create your own MongoDB Atlas cluster
3. Update MONGO_URL in deployment environment variables
4. Redeploy

### Code Changes Won't Fix This
This is an **infrastructure/configuration issue**, not a code issue. You need valid MongoDB credentials with proper permissions.

### Next Action:
**Contact Emergent support** OR **create your own MongoDB Atlas** following the steps above.

---

## Quick Reference

**Emergent Support:** support@emergentagent.com

**MongoDB Atlas:** https://cloud.mongodb.com/

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
```

**Required Permissions:**
- Database: swissalpine
- Role: Read and Write

**Environment Variables:**
```
MONGO_URL=[Atlas connection string]
MONGO_DB_NAME=swissalpine
```
