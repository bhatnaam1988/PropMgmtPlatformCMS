# Swiss Alpine Journey - Vacation Rental Platform

A modern vacation rental booking platform built with Next.js, featuring Uplisting integration for property management, Stripe for payments, and comprehensive booking workflows.

## 🌟 Features

- **Property Listings**: Browse vacation rentals with detailed information, photos, and amenities
- **Advanced Search**: Filter by location, dates, guests, bedrooms, and amenities (multi-select)
- **Dynamic Pricing**: Real-time pricing calculations with all fees and taxes from Uplisting
- **Booking Validation**: Automatic validation of min/max nights, guest capacity, and availability
- **Stripe Payments**: Secure prepaid checkout with Payment Intents and SCA compliance
- **Email Alerts**: Admin notifications for booking failures via Resend
- **Responsive Design**: Mobile-first design with Tailwind CSS and Shadcn UI

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **Styling**: Tailwind CSS + Shadcn UI
- **Payments**: Stripe Payment Intents
- **Property Management**: Uplisting API
- **Email Service**: Resend
- **Date Picker**: React DatePicker
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **Yarn** package manager (`npm install -g yarn`)
- **MongoDB** (local or cloud)
  - Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** for version control

### Required API Keys

You'll need accounts and API keys for:

1. **Uplisting** - Property management ([Contact Uplisting](https://www.uplisting.io/))
2. **Stripe** - Payment processing ([Sign up](https://dashboard.stripe.com/register))
3. **Resend** - Email service ([Sign up](https://resend.com/signup))

## 🚀 Local Development Setup

See **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** for detailed step-by-step instructions.

### Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd swiss-alpine-journey

# 2. Install dependencies
yarn install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configuration

# 4. Start MongoDB (if running locally)
mongod --dbpath=/path/to/data

# 5. Run the development server
yarn dev

# 6. Open your browser
# Navigate to http://localhost:3000
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for all required variables.

### Critical Variables

```bash
# Database
MONGO_URL=mongodb://localhost:27017/swiss-alpine

# Uplisting API
UPLISTING_API_KEY=your_key_here
UPLISTING_CLIENT_ID=your_client_id_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend Email
RESEND_API_KEY=re_...
ADMIN_EMAIL=your_email@example.com

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📁 Project Structure

```
/app
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── properties/           # Property endpoints
│   │   ├── availability/         # Availability checks
│   │   ├── pricing/              # Pricing calculations
│   │   ├── bookings/             # Booking creation
│   │   └── stripe/               # Stripe integration
│   │       ├── create-payment-intent/
│   │       └── webhook/
│   ├── page.js                   # Homepage
│   ├── stay/page.js              # Property listings
│   ├── property/[id]/page.js     # Property details
│   ├── checkout/page.js          # Checkout flow
│   └── booking/                  # Success/failure pages
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── FilterDropdowns.js        # Custom filter components
│   ├── PropertyCard.js           # Property card display
│   └── SearchBar.js              # Search functionality
├── lib/                          # Utilities & helpers
│   ├── email/                    # Email service
│   ├── uplisting.js              # Uplisting API client
│   ├── stripe-client.js          # Stripe SDK
│   ├── pricing-calculator.js     # Price calculation logic
│   ├── booking-validation.js     # Booking validation
│   ├── booking-store.js          # MongoDB operations
│   └── retry-utils.js            # Retry logic
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
└── next.config.js                # Next.js configuration
```

## 🧪 Testing

Test the booking flow:

1. **Browse Properties**: Visit `/stay` to see all listings
2. **Filter & Search**: Use location, dates, guests, and amenities filters
3. **View Details**: Click on a property to see full details
4. **Select Dates**: Choose check-in and check-out dates
5. **Book**: Click "Reserve" and complete checkout
6. **Payment**: Use Stripe test card: `4242 4242 4242 4242`

### Test Email

To test the email alert system:
```bash
curl http://localhost:3000/api/test-email
```

## 🔧 Available Scripts

```bash
# Development server with hot reload
yarn dev

# Production build
yarn build

# Run production server
yarn start

# Lint code
yarn lint
```

## 📚 Key Documentation Files

- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Step-by-step local setup guide
- **[PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)** - Production deployment checklist
- **[STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)** - Stripe implementation details
- **[PHASE_3_DISPLAY_IMPROVEMENTS.md](./PHASE_3_DISPLAY_IMPROVEMENTS.md)** - Display enhancements
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing guide

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
mongod --dbpath=/path/to/data

# Or use MongoDB Atlas connection string
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
yarn dev -p 3001
```

### Stripe Webhook Issues (Local)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Use the webhook secret from the CLI output
```

### Missing Environment Variables
```bash
# Verify all required variables are set
cat .env.local

# Compare with template
diff .env.example .env.local
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

- Update `NEXT_PUBLIC_BASE_URL` to your production URL
- Use production Stripe keys (live mode)
- Configure Stripe webhook endpoint
- Update `ADMIN_EMAIL` to production email
- Verify domain in Resend for production emails

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📝 License

Private and Confidential - All Rights Reserved

## 📞 Support

For technical support or questions:
- Email: support@swissalpinejourney.com
- Documentation: See `/docs` folder

---

**Note**: This README is for the complete application. If you're setting up locally for demos, please refer to [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed instructions.
