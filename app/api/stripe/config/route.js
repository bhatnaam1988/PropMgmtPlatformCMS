import { NextResponse } from 'next/server';

/**
 * Stripe Configuration API
 * Returns publishable key at runtime (not baked into build)
 * This solves the NEXT_PUBLIC_* build-time embedding issue
 * 
 * SECURITY NOTES:
 * - Only returns publishable key (safe for client-side use)
 * - Secret key never exposed to client
 * - No caching to ensure fresh keys from dashboard
 */
export async function GET() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      return NextResponse.json(
        { error: 'Stripe publishable key not configured' },
        { status: 500 }
      );
    }

    // Return with no-cache headers to prevent key caching
    const response = NextResponse.json({
      publishableKey,
    });
    
    // Prevent caching of API keys
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load Stripe configuration' },
      { status: 500 }
    );
  }
}
