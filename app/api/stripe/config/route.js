import { NextResponse } from 'next/server';

/**
 * Stripe Configuration API
 * Returns publishable key at runtime (not baked into build)
 * This solves the NEXT_PUBLIC_* build-time embedding issue
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

    return NextResponse.json({
      publishableKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load Stripe configuration' },
      { status: 500 }
    );
  }
}
