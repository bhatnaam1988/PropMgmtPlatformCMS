# How to Get MongoDB Atlas Credentials from Emergent

## Your MongoDB is Managed by Emergent

When you deployed your application using Emergent's native deployment, it automatically provisioned a MongoDB Atlas instance for you.

---

## Option 1: Check Emergent Dashboard (Recommended)

### Step 1: Access Your Deployment
1. Go to your Emergent dashboard
2. Find your deployed application: "Swiss Alpine Journey" or similar
3. Click on the application to view details

### Step 2: Look for Database Section
Look for one of these sections:
- **"Database"**
- **"MongoDB"**
- **"Resources"**
- **"Services"**
- **"Environment"**

### Step 3: Get Connection Details
You should see:
- **MongoDB Connection String** (MONGO_URL)
- **Database Name** (MONGO_DB_NAME)
- Or a button like **"View Credentials"** or **"Show Connection String"**

### Step 4: Copy the Credentials
The connection string will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

---

## Option 2: Check Environment Variables in Deployment

### In Emergent Platform:
1. Go to your deployment
2. Navigate to **"Settings"** or **"Configuration"**
3. Look for **"Environment Variables"**
4. Find variables:
   - `MONGO_URL`
   - `MONGO_DB_NAME`

If these are set, you'll see the MongoDB connection string there.

---

## Option 3: Contact Emergent Support

If you can't find the credentials in the dashboard:

### Contact Information:
- **Support Email:** support@emergentagent.com
- **Or:** Use the chat/support feature in Emergent dashboard

### What to Request:
```
Subject: MongoDB Atlas Credentials for Deployed Application

Hi Emergent Support,

I need access to the MongoDB Atlas credentials for my deployed application:
- Application: Swiss Alpine Journey
- URL: https://config-relay.preview.emergentagent.com
- Issue: Getting "not authorized on swissalpine" error

Can you please provide:
1. MongoDB Atlas connection string (MONGO_URL)
2. Database name (MONGO_DB_NAME)
3. Or grant me access to the MongoDB Atlas console

Thank you!
```

---

## Option 4: Use Emergent CLI (If Available)

If Emergent has a CLI tool:

```bash
# Check if CLI is installed
emergent --version

# Get deployment info
emergent deployments list

# Get database credentials
emergent deployments get-credentials <deployment-id>
```

---

## What You Need

Once you get the credentials, you need:

### 1. MongoDB Connection String
Format:
```
mongodb+srv://username:password@cluster.mongodb.net/swissalpine?retryWrites=true&w=majority
```

### 2. Database Name
```
swissalpine
```

### 3. User Permissions
The MongoDB user should have **"Read and Write"** access to the `swissalpine` database.

---

## If Emergent Provides Atlas Access Directly

If Emergent gives you direct access to MongoDB Atlas:

1. **Login URL:** https://cloud.mongodb.com/
2. **Use the credentials** Emergent provides
3. **Find your cluster** (might be named after your app)
4. **Database Access** → Check user permissions
5. **Network Access** → Ensure IPs are whitelisted

---

## Temporary Workaround (If Urgent)

While waiting for credentials, you can:

### Use a Free MongoDB Atlas Account

1. **Create Account:** https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster** (M0 - Free tier)
3. **Database Access:**
   - Create user: `swissalpine_user`
   - Password: Generate strong password
   - Role: `Read and write to any database`
4. **Network Access:**
   - Add IP: `0.0.0.0/0` (allow from anywhere - for testing)
5. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Add database name: `/swissalpine`

6. **Update Your Deployment:**
   ```env
   MONGO_URL=mongodb+srv://swissalpine_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/swissalpine?retryWrites=true&w=majority
   MONGO_DB_NAME=swissalpine
   ```

**Note:** This is YOUR own MongoDB, not managed by Emergent. You'll have full control.

---

## Expected Response from Emergent

Emergent should provide you with:

### Format 1: Direct Credentials
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/swissalpine?retryWrites=true
MONGO_DB_NAME=swissalpine
```

### Format 2: Atlas Access
```
MongoDB Atlas Login: https://cloud.mongodb.com/
Organization: [org-name]
Project: [project-name]
Cluster: [cluster-name]
Username: [db-username]
Password: [db-password]
```

---

## After Getting Credentials

### Step 1: Update Environment Variables

In your Emergent deployment:
1. Go to Environment Variables settings
2. Update or add:
   ```
   MONGO_URL=[the connection string from Emergent]
   MONGO_DB_NAME=swissalpine
   ```

### Step 2: Redeploy
- Trigger a redeployment
- Or restart the application

### Step 3: Test
1. Go to your website
2. Try checkout flow
3. Should work without "not authorized" error

---

## Common Emergent Deployment Patterns

Based on typical deployment platforms:

### Pattern 1: Auto-Provisioned Database
- Emergent creates MongoDB for you
- Credentials are auto-injected as environment variables
- Check: Environment Variables section in dashboard

### Pattern 2: Managed Service
- Emergent provides a MongoDB Atlas organization
- You get invite to MongoDB Atlas
- Manage database directly in Atlas

### Pattern 3: Connection String Provided
- Emergent shows connection string in deployment details
- Copy and paste into environment variables

---

## Troubleshooting

### "I don't see MongoDB section in dashboard"

Try:
1. Check under different sections (Database, Services, Resources)
2. Look in deployment logs for MongoDB connection info
3. Check deployment configuration/manifest file
4. Contact Emergent support

### "Connection string is redacted/hidden"

Common security practice. Options:
1. Click "Reveal" or "Show" button
2. Re-generate credentials
3. Request full access from support

### "User doesn't have write permissions"

If Emergent provides read-only access:
1. Request write permissions from support
2. Or ask them to grant your user "readWrite" role

---

## Security Note

**Never commit MongoDB credentials to git!**
- Keep them in environment variables only
- Don't share passwords publicly
- Use strong passwords
- Rotate credentials periodically

---

## Next Steps

1. ✅ Check Emergent dashboard for MongoDB credentials
2. ✅ If not found, contact Emergent support
3. ✅ Get connection string and database name
4. ✅ Update environment variables in deployment
5. ✅ Redeploy application
6. ✅ Test checkout flow

---

## Summary

**You don't need to do anything in MongoDB directly.**

Just get the credentials from Emergent and update your deployment's environment variables.

**Estimated Time:** 10-15 minutes (once you have credentials)

---

**Need Help?** Contact Emergent support - they can provide your MongoDB credentials or grant you access to the Atlas console.
