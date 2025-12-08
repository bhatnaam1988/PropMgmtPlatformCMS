import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const SCORE_THRESHOLD = 0.5; // Minimum score to pass (0.0-1.0)

/**
 * Verify ReCaptcha v3 token with Google
 * POST /api/verify-recaptcha
 * 
 * Body: { token: string, action: string }
 * Returns: { success: boolean, score: number, message: string }
 */
export async function POST(request) {
  try {
    const { token, action } = await request.json();

    // Validate input
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'ReCaptcha token is required' },
        { status: 400 }
      );
    }

    if (!RECAPTCHA_SECRET_KEY) {
      logger.error('ReCaptcha secret key not configured');
      return NextResponse.json(
        { success: false, message: 'ReCaptcha not configured on server' },
        { status: 500 }
      );
    }

    // Verify token with Google
    const verifyResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const verifyResult = await verifyResponse.json();

    // Log verification attempt
    logger.info('ReCaptcha verification attempt', {
      action,
      success: verifyResult.success,
      score: verifyResult.score,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    // Check if verification was successful
    if (!verifyResult.success) {
      logger.warn('ReCaptcha verification failed', {
        errorCodes: verifyResult['error-codes'],
        action,
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Verification failed. Please try again.',
          errorCodes: verifyResult['error-codes'],
        },
        { status: 400 }
      );
    }

    // Check score threshold (v3 specific)
    if (verifyResult.score < SCORE_THRESHOLD) {
      logger.warn('ReCaptcha score too low', {
        score: verifyResult.score,
        threshold: SCORE_THRESHOLD,
        action,
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Verification failed. Please try again or contact support.',
          score: verifyResult.score,
        },
        { status: 400 }
      );
    }

    // Check action matches (optional but recommended)
    if (action && verifyResult.action !== action) {
      logger.warn('ReCaptcha action mismatch', {
        expected: action,
        received: verifyResult.action,
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Verification action mismatch',
        },
        { status: 400 }
      );
    }

    // Success
    logger.info('ReCaptcha verification successful', {
      score: verifyResult.score,
      action: verifyResult.action,
    });

    return NextResponse.json({
      success: true,
      score: verifyResult.score,
      message: 'Verification successful',
    });
  } catch (error) {
    logger.error('ReCaptcha verification error', {
      error: error.message,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error during verification' },
      { status: 500 }
    );
  }
}
