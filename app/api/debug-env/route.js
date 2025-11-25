import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variable configuration
 * CRITICAL: REMOVE THIS ENDPOINT BEFORE PRODUCTION - SECURITY RISK
 */
export async function GET() {
  try {
    // List all Stripe-related environment variables
    const envVars = {
      // Stripe Keys
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT_SET',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'SET' : 'NOT_SET',
      STRIPE_CURRENCY: process.env.STRIPE_CURRENCY || 'NOT_SET',
      STRIPE_TAX_MODE: process.env.STRIPE_TAX_MODE || 'NOT_SET',
      
      // Other Config
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? 'SET' : 'NOT_SET',
      MONGO_URL: process.env.MONGO_URL ? 'SET' : 'NOT_SET',
      MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'NOT_SET',
    };

    // Count how many environment variables are actually set
    const totalEnvVars = Object.keys(process.env).length;
    const stripeVarsSet = Object.entries(envVars)
      .filter(([key]) => key.includes('STRIPE'))
      .filter(([_, value]) => value !== 'NOT_SET').length;

    // Check if running in production
    const isProduction = process.env.NODE_ENV === 'production';

    return NextResponse.json({
      status: 'success',
      environment: {
        nodeEnv: process.env.NODE_ENV || 'NOT_SET',
        isProduction,
        totalEnvVars,
      },
      stripeConfiguration: {
        varsChecked: 5,
        varsSet: stripeVarsSet,
        details: {
          STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          STRIPE_WEBHOOK_SECRET: envVars.STRIPE_WEBHOOK_SECRET,
          STRIPE_CURRENCY: envVars.STRIPE_CURRENCY,
          STRIPE_TAX_MODE: envVars.STRIPE_TAX_MODE,
        }
      },
      otherConfiguration: {
        NEXT_PUBLIC_BASE_URL: envVars.NEXT_PUBLIC_BASE_URL,
        MONGO_URL: envVars.MONGO_URL,
        MONGO_DB_NAME: envVars.MONGO_DB_NAME,
      },
      diagnosis: {
        allStripeKeysSet: stripeVarsSet === 5,
        issues: [
          ...(envVars.STRIPE_SECRET_KEY === 'NOT_SET' ? ['❌ STRIPE_SECRET_KEY is not set in environment'] : []),
          ...(envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'NOT_SET' ? ['❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment'] : []),
          ...(envVars.STRIPE_WEBHOOK_SECRET === 'NOT_SET' ? ['❌ STRIPE_WEBHOOK_SECRET is not set in environment'] : []),
          ...(envVars.STRIPE_CURRENCY === 'NOT_SET' ? ['⚠️ STRIPE_CURRENCY not set (will use default)'] : []),
          ...(envVars.STRIPE_TAX_MODE === 'NOT_SET' ? ['⚠️ STRIPE_TAX_MODE not set (will use default)'] : []),
        ],
        possibleCauses: stripeVarsSet === 0 ? [
          '1. Environment variables not configured in Emergent Dashboard',
          '2. Deployment not yet complete or not restarted',
          '3. Environment variables not injected into container',
          '4. Reading from wrong .env file during build',
        ] : []
      },
      recommendation: stripeVarsSet === 0 
        ? 'Environment variables are not set. Please verify Emergent Dashboard configuration and ensure deployment is complete.'
        : stripeVarsSet < 5
        ? 'Some Stripe variables are missing. Check Emergent Dashboard for incomplete configuration.'
        : 'All Stripe environment variables are configured correctly.',
      warning: '⚠️ SECURITY WARNING: This endpoint exposes environment configuration. Remove before production deployment!',
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
