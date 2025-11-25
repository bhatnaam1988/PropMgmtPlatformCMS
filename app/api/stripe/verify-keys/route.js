import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to verify which Stripe keys are configured
 * IMPORTANT: Remove or secure this endpoint before going to production
 */
export async function GET() {
  try {
    // ⚠️ TEMPORARY HARDCODED KEYS FOR TESTING - REMOVE AFTER TESTING
    const HARDCODED_SECRET = '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';
    const HARDCODED_PUBLISHABLE = 'pk_live_51QgR12HbvQ7QfHylJtgAAS7UFj7bbZZZVsqe5ryUQqgCLy4b3LuitW7KM5tSc5EqctJOKRBhygCPWdpBroooGmsl00JjEYDyuB';
    const HARDCODED_WEBHOOK = 'whsec_0c7eWCvSoiP7lnAAUHcjcN6fZpcEMen8';
    
    const secretKey = HARDCODED_SECRET || process.env.STRIPE_SECRET_KEY || 'NOT_SET';
    const publishableKey = HARDCODED_PUBLISHABLE || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'NOT_SET';
    const webhookSecret = HARDCODED_WEBHOOK || process.env.STRIPE_WEBHOOK_SECRET || 'NOT_SET';

    // Extract key prefixes and last 4 characters for security
    const maskKey = (key) => {
      if (key === 'NOT_SET' || !key) return 'NOT_SET';
      const prefix = key.substring(0, 12); // e.g., "sk_test_51Qg" or "pk_live_51Qg"
      const suffix = key.substring(key.length - 4); // last 4 chars
      return `${prefix}...${suffix}`;
    };

    // Determine key types
    const getKeyType = (key) => {
      if (key === 'NOT_SET' || !key) return 'NOT_SET';
      if (key.startsWith('sk_test_')) return 'SECRET_TEST';
      if (key.startsWith('sk_live_')) return 'SECRET_LIVE';
      if (key.startsWith('rk_test_')) return 'RESTRICTED_TEST';
      if (key.startsWith('rk_live_')) return 'RESTRICTED_LIVE';
      if (key.startsWith('pk_test_')) return 'PUBLISHABLE_TEST';
      if (key.startsWith('pk_live_')) return 'PUBLISHABLE_LIVE';
      if (key.startsWith('whsec_')) return 'WEBHOOK_SECRET';
      return 'UNKNOWN';
    };

    // Check if keys match (same mode)
    const secretType = getKeyType(secretKey);
    const publishableType = getKeyType(publishableKey);
    
    const secretIsTest = secretType.includes('TEST');
    const secretIsLive = secretType.includes('LIVE');
    const publishableIsTest = publishableType.includes('TEST');
    const publishableIsLive = publishableType.includes('LIVE');

    const keysMatch = (secretIsTest && publishableIsTest) || (secretIsLive && publishableIsLive);

    // Extract account ID from keys (first part after prefix)
    const getAccountId = (key) => {
      if (key === 'NOT_SET' || !key) return 'NOT_SET';
      const match = key.match(/^[a-z]{2}_(?:test|live)_(\w+)/);
      return match ? match[1].substring(0, 10) : 'UNKNOWN';
    };

    const secretAccountId = getAccountId(secretKey);
    const publishableAccountId = getAccountId(publishableKey);
    const accountsMatch = secretAccountId === publishableAccountId;

    return NextResponse.json({
      status: 'success',
      environment: process.env.NODE_ENV || 'development',
      keys: {
        secret: {
          masked: maskKey(secretKey),
          type: secretType,
          accountId: secretAccountId,
        },
        publishable: {
          masked: maskKey(publishableKey),
          type: publishableType,
          accountId: publishableAccountId,
        },
        webhook: {
          masked: maskKey(webhookSecret),
          type: getKeyType(webhookSecret),
        },
      },
      validation: {
        keysMatch,
        accountsMatch,
        ready: keysMatch && accountsMatch && secretKey !== 'NOT_SET' && publishableKey !== 'NOT_SET',
        warnings: [
          ...(!keysMatch ? ['⚠️ SECRET and PUBLISHABLE keys are from different modes (test vs live)'] : []),
          ...(!accountsMatch ? ['⚠️ Keys appear to be from different Stripe accounts'] : []),
          ...(secretKey === 'NOT_SET' ? ['❌ STRIPE_SECRET_KEY is not set'] : []),
          ...(publishableKey === 'NOT_SET' ? ['❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set'] : []),
        ],
      },
      message: keysMatch && accountsMatch 
        ? '✅ Keys are properly configured and from the same Stripe account'
        : '⚠️ Key configuration issue detected - see warnings',
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
