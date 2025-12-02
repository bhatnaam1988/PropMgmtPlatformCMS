import { NextResponse } from 'next/server';
import { rateLimit } from './lib/rate-limit';

// Configure rate limiters for different endpoints
const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

const formLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

const paymentLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip rate limiting for non-API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Get client identifier (IP address)
  const token = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'anonymous';
  
  try {
    let result;
    
    // Form submissions: 5 per 15 minutes
    if (pathname.startsWith('/api/forms/')) {
      result = await formLimiter.check(5, token);
    }
    // Payment intents: 10 per hour
    else if (pathname.includes('/api/stripe/create-payment-intent')) {
      result = await paymentLimiter.check(10, token);
    }
    // Bookings: 10 per hour
    else if (pathname.includes('/api/bookings')) {
      result = await paymentLimiter.check(10, token);
    }
    // General API: 100 per minute
    else {
      result = await apiLimiter.check(100, token);
    }
    
    if (result.isRateLimited) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
          }
        }
      );
    }
    
    return NextResponse.next();
    
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/api/:path*',
};
