# Local Development Setup Guide

This guide will help you set up the Swiss Alpine Journey application on your local machine for demos and development.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Yarn** package manager (`npm install -g yarn`)
- [ ] **Git** installed
- [ ] **MongoDB** (choose one option below)
- [ ] **Code Editor** (VS Code recommended)

### MongoDB Options

**Option A: MongoDB Atlas (Recommended for Demos)**
- ✅ No local installation needed
- ✅ Free tier available
- ✅ Cloud-hosted, accessible anywhere
- [Sign up here](https://www.mongodb.com/cloud/atlas/register)

**Option B: Local MongoDB**
- [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Requires local installation and configuration

## 🚀 Step-by-Step Setup

### Step 1: Clone from GitHub

```bash
# Clone your repository
git clone <your-github-repo-url>
cd swiss-alpine-journey

# Or if you already have the code
cd /path/to/swiss-alpine-journey
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
yarn install

# This will take 2-3 minutes
# You should see "Done" when complete
```

### Step 3: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Open .env.local in your editor
code .env.local  # VS Code
# or
nano .env.local  # Terminal editor
```

**Edit `.env.local` with your values:**

```bash
# ============================================
# CRITICAL: Update these values
# ============================================

# Database (choose one)
# Option A: MongoDB Atlas
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/swiss-alpine?retryWrites=true&w=majority

# Option B: Local MongoDB
# MONGO_URL=mongodb://localhost:27017/swiss-alpine

# Uplisting API (get from Uplisting dashboard)
UPLISTING_API_KEY=your_actual_api_key
UPLISTING_CLIENT_ID=your_actual_client_id
UPLISTING_API_URL=https://api.uplisting.io

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...  # See Step 5 for webhook setup

# Resend Email (get from https://resend.com/api-keys)
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev  # Or your verified domain
ADMIN_EMAIL=your_email@example.com

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 4: Set Up MongoDB

**If using MongoDB Atlas:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Paste into `MONGO_URL` in `.env.local`

**If using Local MongoDB:**

```bash
# Start MongoDB (in a separate terminal)
mongod --dbpath=/path/to/your/data/folder

# Keep this terminal running
```

### Step 5: Configure Stripe Webhooks (Optional for Full Testing)

**For basic demos**, you can skip webhooks. **For complete booking flow:**

```bash
# Install Stripe CLI
# Mac:
brew install stripe/stripe-cli/stripe

# Windows:
scoop install stripe

# Linux:
# Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server (run in separate terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret (whsec_...)
# Add it to STRIPE_WEBHOOK_SECRET in .env.local
```

### Step 6: Start the Development Server

```bash
# Run the development server
yarn dev

# You should see:
# ✓ Ready in 2s
# - Local:        http://localhost:3000
# - Network:      http://0.0.0.0:3000
```

### Step 7: Verify Everything Works

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Check Homepage**: Should load with hero section
3. **Browse Properties**: Click "Stay" in navigation
4. **Test Filters**: Try location, dates, guests filters
5. **View Property**: Click on a property card
6. **Test Booking Flow** (optional):
   - Select dates and guests
   - Click "Reserve"
   - Fill in guest details
   - Use test card: `4242 4242 4242 4242`

## ✅ Verification Checklist

Make sure everything works:

- [ ] Homepage loads at `http://localhost:3000`
- [ ] Navigation menu is centered
- [ ] Stay page shows properties (3 properties)
- [ ] Filters work (location, dates, guests, amenities)
- [ ] Property detail page opens
- [ ] Images load properly
- [ ] Pricing displays correctly
- [ ] No console errors in browser DevTools (F12)

## 🎬 Demo Preparation Tips

### Before the Demo

1. **Clear Browser Cache**: Ensure fresh load
2. **Test Internet Connection**: Uplisting API needs internet
3. **Prepare Test Data**:
   - Have date ranges ready (30+ days in future)
   - Know property IDs (84656, 174947, 174948)
4. **Close Unnecessary Apps**: Free up system resources
5. **Full Screen Mode**: Hide desktop clutter (F11)

### During the Demo

1. **Start Fresh**: Restart the dev server before demo
```bash
# Stop server: Ctrl+C
# Start again: yarn dev
```

2. **Use Incognito Mode**: Avoid cache issues
3. **Keep Terminal Visible** (optional): Shows real-time requests
4. **Test Email Feature**:
```bash
curl http://localhost:3000/api/test-email
```

### Demo Flow Suggestion

1. **Homepage** → Show hero and featured properties
2. **Stay Page** → Demonstrate filters and search
3. **Property Detail** → Show all property information
4. **Booking Widget** → Select dates, show dynamic pricing
5. **Checkout** → Show form and pricing breakdown
6. **(Optional)** Complete test payment

## 🔧 Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
yarn dev -p 3001
```

### MongoDB Connection Error

```bash
# Test MongoDB connection
mongo  # or mongosh

# If using Atlas, check:
# 1. Correct password
# 2. IP whitelist (0.0.0.0/0 for development)
# 3. Database user permissions
```

### Properties Not Loading

**Check:**
1. Uplisting API key is correct
2. Internet connection is active
3. Check browser console (F12) for errors
4. Verify API endpoint: `http://localhost:3000/api/properties`

```bash
# Test API directly
curl http://localhost:3000/api/properties
```

### Stripe Errors

**Common issues:**
- Wrong API keys (test vs live mode)
- Missing `NEXT_PUBLIC_` prefix for publishable key
- Webhook secret not configured

```bash
# Verify Stripe keys
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Should start with pk_test_
echo $STRIPE_SECRET_KEY  # Should start with sk_test_
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
yarn install
yarn dev
```

### Slow Performance

```bash
# Clear Next.js cache
rm -rf .next

# Restart with fresh build
yarn dev
```

## 🔄 Syncing with GitHub

To keep your local code updated:

```bash
# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies
yarn install

# Restart dev server
yarn dev
```

## 📝 Notes for Demos

### What Works Offline
- UI and navigation
- Static pages (homepage, about)

### What Needs Internet
- Property listings (Uplisting API)
- Property images (Uplisting CDN)
- Pricing calculations (Uplisting API)
- Payment processing (Stripe API)
- Email alerts (Resend API)

### Test Mode Features

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

**Test Emails:**
- With Resend free tier, emails only go to verified address
- Use `onboarding@resend.dev` as sender for testing

## 🆘 Getting Help

If you encounter issues:

1. **Check Console**: Browser DevTools → Console tab (F12)
2. **Check Terminal**: Look for error messages
3. **Check Environment**: Verify all variables in `.env.local`
4. **Restart Everything**: Dev server, MongoDB, Stripe webhook
5. **Google the Error**: Most issues have solutions online

## ✨ You're Ready!

Once everything is running:
- Open `http://localhost:3000`
- Navigate through the application
- Test the booking flow
- Show off your demo! 🎉

---

**Pro Tip**: Keep a backup `.env.local` file with working credentials for quick setup on new machines!
