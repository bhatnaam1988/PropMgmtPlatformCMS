# GitHub Push Guide - Quick Reference

## 🎯 Purpose
This guide helps you push the Swiss Alpine Journey code to GitHub so you can clone it on your local machine for demos.

## 📝 Pre-Push Checklist

Before pushing to GitHub, verify:

- [x] `.env.example` created (template for environment variables)
- [x] `.gitignore` configured (protects sensitive data)
- [x] `README.md` complete (project documentation)
- [x] `LOCAL_SETUP.md` complete (setup instructions)
- [x] Emergent environment still working ✅
- [x] No sensitive data in code files

## 🚀 Step-by-Step GitHub Push

### Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `swiss-alpine-journey` (or your preferred name)
3. Description: "Vacation rental booking platform with Uplisting & Stripe"
4. Visibility: **Private** (recommended for client projects)
5. **DO NOT** check "Initialize with README" (we already have one)
6. Click **"Create repository"**

### Step 2: Push Code from Emergent

```bash
# Navigate to project directory
cd /app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Swiss Alpine Journey booking platform

Features:
- Uplisting property integration
- Stripe payment processing
- Email alerts with Resend
- Responsive design with Tailwind CSS
- Complete booking flow"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME and YOUR_REPO with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify Push Success

1. Go to your GitHub repository URL
2. You should see all files except:
   - `.env` (protected)
   - `.env.local` (protected)
   - `node_modules/` (too large, users install themselves)
   - `.next/` (build cache, generated locally)

## 💻 Clone on Local Machine

### For First Time Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Navigate into directory
cd YOUR_REPO

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run the application
yarn dev:local

# Open in browser
# http://localhost:3000
```

### For Updates (After Making Changes on Emergent)

```bash
# On Emergent: Push changes
cd /app
git add .
git commit -m "Feature: your description"
git push origin main

# On Local Machine: Pull changes
cd /path/to/your-repo
git pull origin main
yarn install  # If package.json changed
yarn dev:local
```

## 🔑 Environment Variables for Local

After cloning, users must create `.env.local`:

```bash
# Copy template
cp .env.example .env.local

# Edit with actual values
nano .env.local  # or use your preferred editor
```

**Required API Keys:**
1. **Uplisting**: UPLISTING_API_KEY, UPLISTING_CLIENT_ID
2. **Stripe**: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
3. **Resend**: RESEND_API_KEY
4. **MongoDB**: MONGO_URL (local or Atlas)

See `LOCAL_SETUP.md` for detailed instructions on obtaining these keys.

## 🔄 Typical Workflow

### Scenario 1: Quick Demo Setup

```bash
# 1. Clone from GitHub (5 minutes)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Install dependencies (2-3 minutes)
yarn install

# 3. Configure environment (5 minutes)
cp .env.example .env.local
# Add your API keys to .env.local

# 4. Start application (1 minute)
yarn dev:local

# Ready for demo!
```

### Scenario 2: Update After Development

```bash
# On Emergent (after development)
git add .
git commit -m "Added new feature"
git push origin main

# On Local Machine (before demo)
git pull origin main
yarn install
yarn dev:local
```

### Scenario 3: Continue Development on Emergent

```bash
# Normal Emergent workflow (unchanged)
# Make changes, test locally
git add .
git commit -m "Your changes"
git push origin main

# Emergent environment: still works perfectly ✅
```

## ⚠️ Important Reminders

### Security
- ❌ **NEVER** commit `.env` or `.env.local` files
- ❌ **NEVER** commit API keys directly in code
- ✅ Always use `.env.example` as template
- ✅ Keep repository private for client projects

### Best Practices
- Commit frequently with clear messages
- Pull before starting new work
- Test locally before demos
- Keep `.env.local` backed up separately

## 🐛 Common Issues & Solutions

### "Authentication failed" when pushing
```bash
# Use Personal Access Token instead of password
# Generate at: https://github.com/settings/tokens
# Use token as password when prompted
```

### "Repository not found"
```bash
# Check remote URL
git remote -v

# Update if needed
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Local setup doesn't work
1. Check `LOCAL_SETUP.md` for troubleshooting
2. Verify all environment variables in `.env.local`
3. Ensure MongoDB is running (local or Atlas)
4. Check Node.js version (should be 18+)

## 📚 Documentation Reference

- **README.md** - Complete project overview
- **LOCAL_SETUP.md** - Detailed local setup guide
- **DEPLOYMENT_CHECKLIST.md** - Verification checklist
- **.env.example** - Environment variable template
- **PRODUCTION_READINESS_REPORT.md** - Production deployment guide

## ✅ Success Criteria

You know everything worked when:

1. **On GitHub:**
   - All code files visible
   - No sensitive data exposed
   - Repository accessible

2. **On Local Machine:**
   - `yarn install` completes
   - `yarn dev:local` starts successfully
   - Application loads at `http://localhost:3000`
   - All features work (properties load, filters work, etc.)

3. **On Emergent:**
   - Development continues normally
   - All features still work
   - Can push/pull from GitHub

## 🎉 You're All Set!

Follow these steps to:
1. ✅ Push code to GitHub
2. ✅ Clone on any machine
3. ✅ Set up for local demos
4. ✅ Continue development on Emergent

Everything is configured to work seamlessly! 🚀

---

**Need Help?**
- Check `LOCAL_SETUP.md` for detailed troubleshooting
- Verify environment variables in `.env.local`
- Ensure all API keys are valid and active
