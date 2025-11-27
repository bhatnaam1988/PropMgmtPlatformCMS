# Fix MongoDB Atlas Authorization Error

## Error Details

**Error Message:**
```
"not authorized on swissalpine to execute command"
```

**What's Happening:**
Your deployed application is trying to connect to MongoDB Atlas, but the database user doesn't have proper permissions to access the `swissalpine` database.

---

## Root Cause

The issue occurs because:

1. **Local vs Production:** 
   - Local: Uses `mongodb://localhost:27017` (full access)
   - Production: Uses MongoDB Atlas (restricted access based on user roles)

2. **Atlas Requires Specific Permissions:**
   - User must be assigned to the correct database
   - User must have read/write roles on that database

---

## Solutions

### Solution 1: Update MongoDB Atlas User Permissions (Recommended)

#### Step 1: Access MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Login to your Atlas account
3. Select your project/cluster

#### Step 2: Update Database User

1. **Navigate to Database Access:**
   - In left sidebar, click **"Database Access"**
   - Find the user your application is using

2. **Edit User Permissions:**
   - Click **"Edit"** on the user
   - Under **"Database User Privileges"**, select one of:
     
     **Option A: Built-in Role (Recommended)**
     - Select: **"Atlas admin"** (for testing)
     - Or: **"Read and write to any database"**
     
     **Option B: Specific Database (More Secure)**
     - Select: **"Add Specific Privileges"**
     - Database: `swissalpine`
     - Privilege: `Read and write`
   
3. **Click "Update User"**

4. **Wait for changes to apply** (usually 1-2 minutes)

#### Step 3: Update Connection String

Your production MONGO_URL should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
```

**Important parts:**
- `username` - your Atlas database username
- `password` - your Atlas database password (URL encoded)
- `cluster.mongodb.net` - your cluster address
- `/swissalpine` - database name (must match MONGO_DB_NAME)

---

### Solution 2: Create New Database User

If you don't have the right user:

#### Step 1: Create New User in Atlas

1. **Go to Database Access** in MongoDB Atlas
2. Click **"Add New Database User"**
3. **Authentication Method:** Password
4. **Username:** `swissalpine_user` (or any name)
5. **Password:** Generate a strong password (save it!)
6. **Database User Privileges:**
   - Select: **"Read and write to any database"**
   - Or specific: Database `swissalpine`, Collection `All collections`, Privileges `Read and Write`
7. Click **"Add User"**

#### Step 2: Get Connection String

1. **Click "Connect"** on your cluster
2. Select **"Connect your application"**
3. **Driver:** Node.js
4. **Version:** 4.1 or later
5. **Copy the connection string:**
   ```
   mongodb+srv://swissalpine_user:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with your actual password
7. **Add database name** before the `?`:
   ```
   mongodb+srv://swissalpine_user:YOUR_PASSWORD@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
   ```

---

### Solution 3: Change Database Name

If you want to use a different database name:

#### In MongoDB Atlas:
1. Create a new database called something else (e.g., `swiss_alpine_prod`)
2. Ensure your user has permissions on it

#### In Your Application:
Update environment variable:
```env
MONGO_DB_NAME=swiss_alpine_prod
```

---

## How to Update Environment Variables in Deployed App

### If Using Emergent Native Deployment:

1. **Access Deployment Settings:**
   - Go to your Emergent dashboard
   - Find your deployed application
   - Navigate to **"Environment Variables"** or **"Settings"**

2. **Update These Variables:**
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
   MONGO_DB_NAME=swissalpine
   ```

3. **Important:** 
   - Use your actual Atlas connection string
   - Ensure password is URL encoded (if it has special characters)
   - Include `/swissalpine` before the `?` in the URL

4. **Save and Redeploy:**
   - Save the environment variables
   - Trigger a redeployment

---

## Troubleshooting

### Issue: "Authentication failed"

**Cause:** Wrong username/password

**Solution:**
1. Verify username and password in Atlas
2. Check for special characters (must be URL encoded)
3. Reset password in Atlas if needed

**URL Encoding Special Characters:**
```
@ → %40
: → %3A
/ → %2F
? → %3F
# → %23
& → %26
= → %3D
```

Example:
- Password: `Pass@123`
- Encoded: `Pass%40123`

### Issue: "Connection timeout"

**Cause:** IP address not whitelisted

**Solution:**
1. Go to Atlas → Network Access
2. Add IP address or use `0.0.0.0/0` (allow all - for testing)
3. Wait for changes to apply

### Issue: "Database does not exist"

**Cause:** Database name mismatch

**Solution:**
1. Check database name in connection string
2. Verify MONGO_DB_NAME matches
3. Database will be created automatically when first document is inserted

### Issue: Still getting "not authorized"

**Possible Causes:**
1. User permissions not updated yet (wait 2 minutes)
2. Wrong database specified in user privileges
3. User doesn't exist in this cluster

**Solution:**
1. Double-check user exists and has correct permissions
2. Try creating a new user with admin privileges
3. Verify cluster is the right one

---

## Environment Variable Format

### Development (.env.local):
```env
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=swissalpine
```

### Production (Deployed):
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
MONGO_DB_NAME=swissalpine
```

**Note:** Both should have the same `MONGO_DB_NAME`

---

## Quick Fix Checklist

- [ ] Login to MongoDB Atlas
- [ ] Go to Database Access
- [ ] Find your database user
- [ ] Edit user permissions
- [ ] Grant "Read and write to any database" or specific database access
- [ ] Update user and wait 2 minutes
- [ ] Get Atlas connection string
- [ ] Update MONGO_URL in production environment variables
- [ ] Ensure MONGO_DB_NAME=swissalpine
- [ ] Redeploy application
- [ ] Test booking flow

---

## Testing After Fix

1. **Clear browser cache** or open incognito window
2. **Go to Stay page:** `https://config-relay.preview.emergentagent.com/stay`
3. **Select property** and proceed to checkout
4. **Fill guest details**
5. **Enter test card:** 4242 4242 4242 4242
6. **Click Pay**
7. **Should redirect to success page** (no errors)

---

## Connection String Examples

### Correct Format:
```
mongodb+srv://user:pass@cluster.abc123.mongodb.net/swissalpine?retryWrites=true&w=majority
```

### Common Mistakes:

❌ **Missing database name:**
```
mongodb+srv://user:pass@cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

❌ **Wrong database in connection string:**
```
mongodb+srv://user:pass@cluster.abc123.mongodb.net/admin?retryWrites=true&w=majority
```

❌ **Not URL encoded password:**
```
mongodb+srv://user:P@ss123@cluster.abc123.mongodb.net/swissalpine
```
Should be:
```
mongodb+srv://user:P%40ss123@cluster.abc123.mongodb.net/swissalpine
```

---

## Security Best Practices

1. **Use Specific Database Permissions:**
   - Instead of admin access, grant read/write only to `swissalpine`

2. **Whitelist Specific IPs:**
   - In Atlas → Network Access
   - Add your deployment server IP instead of `0.0.0.0/0`

3. **Use Strong Passwords:**
   - Generate complex passwords for database users
   - Store securely in environment variables

4. **Rotate Credentials Regularly:**
   - Change database passwords periodically
   - Update in deployment environment

---

## Need Help?

If you're still facing issues:

1. **Check Atlas Logs:**
   - Go to Metrics tab in your cluster
   - Look for connection errors

2. **Check Application Logs:**
   - Look for MongoDB connection errors
   - Verify which connection string is being used

3. **Contact Support:**
   - MongoDB Atlas Support: https://support.mongodb.com/
   - Check MongoDB documentation: https://docs.atlas.mongodb.com/

---

## Summary

**The Fix (In 3 Steps):**

1. **Update user permissions in MongoDB Atlas**
   - Database Access → Edit User → Grant read/write access

2. **Get Atlas connection string**
   - Include database name: `/swissalpine`
   - URL encode password if needed

3. **Update production environment variables**
   - Set MONGO_URL to Atlas connection string
   - Keep MONGO_DB_NAME=swissalpine
   - Redeploy

**Expected Result:** Booking flow should work without "not authorized" errors!
