'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, XCircle, RefreshCcw, Mail, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get failure details from URL
  const errorCode = searchParams.get('error') || searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const bookingId = searchParams.get('bookingId') || searchParams.get('id');
  const propertyId = searchParams.get('propertyId');
  
  // Get original booking params if available
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const infants = searchParams.get('infants');

  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Track failed booking (for analytics)
    console.log('❌ Booking payment failed:', { errorCode, errorMessage, bookingId });
  }, [errorCode, errorMessage, bookingId]);

  // Determine the specific error type for better messaging
  const getErrorDetails = () => {
    const code = (errorCode || errorMessage || '')?.toLowerCase();
    
    if (code.includes('payment') || code.includes('card') || code.includes('declined')) {
      return {
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please check your payment details and try again.',
        icon: 'payment'
      };
    } else if (code.includes('timeout') || code.includes('expired') || code.includes('session')) {
      return {
        title: 'Session Expired',
        message: 'Your booking session has expired. Please start the booking process again.',
        icon: 'timeout'
      };
    } else if (code.includes('unavailable') || code.includes('availability') || code.includes('booked')) {
      return {
        title: 'Property Unavailable',
        message: 'This property is no longer available for your selected dates. Please choose different dates or another property.',
        icon: 'unavailable'
      };
    } else if (code.includes('cancel') || code.includes('abort')) {
      return {
        title: 'Booking Cancelled',
        message: 'Your booking was cancelled. You can try again when you\'re ready.',
        icon: 'cancel'
      };
    } else {
      return {
        title: 'Booking Unsuccessful',
        message: errorMessage || 'We encountered an issue processing your booking. Please try again or contact support.',
        icon: 'general'
      };
    }
  };

  const errorDetails = getErrorDetails();

  const handleRetry = () => {
    setIsRetrying(true);
    
    // Reconstruct checkout URL with original parameters
    if (propertyId && checkIn && checkOut) {
      const params = new URLSearchParams({
        propertyId,
        checkIn,
        checkOut,
        adults: adults || '2',
        children: children || '0',
        infants: infants || '0'
      });
      
      router.push(`/checkout?${params.toString()}`);
    } else if (propertyId) {
      // If we don't have booking params, go back to property page
      router.push(`/property/${propertyId}`);
    } else {
      // Last resort: go to listings
      router.push('/stay');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-light">Swiss Alpine Journey</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-light mb-4">{errorDetails.title}</h1>
          <p className="text-xl text-gray-600 mb-8">
            {errorDetails.message}
          </p>

          {/* Additional Info if available */}
          {(errorCode || bookingId) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-yellow-800">
                {bookingId && (
                  <span className="block mb-1">
                    <strong>Reference:</strong> {bookingId}
                  </span>
                )}
                {errorCode && (
                  <span className="block">
                    <strong>Error Code:</strong> {errorCode}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* What to do next */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 text-left">
            <h2 className="text-2xl font-light mb-6">What You Can Do</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <RefreshCcw className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Try Again</p>
                  <p className="text-sm text-gray-600">
                    Check your payment details and try completing your booking again. 
                    Your selected property and dates may still be available.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Contact Support</p>
                  <p className="text-sm text-gray-600">
                    Our team is here to help. Contact us and we'll assist you with your booking.
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <a href="tel:+15551234567" className="text-blue-600 underline">
                        +1 (555) 123-4567
                      </a>
                    </p>
                    <p className="text-sm">
                      <a href="mailto:hello@swissalpinejourney.com" className="text-blue-600 underline">
                        hello@swissalpinejourney.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Payment Methods</p>
                  <p className="text-sm text-gray-600">
                    We accept major credit cards, debit cards, and other payment methods. 
                    Please ensure your payment method has sufficient funds and is authorized for international transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Common Issues</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Insufficient funds or card limit exceeded</li>
                    <li>Card not authorized for international payments</li>
                    <li>Incorrect card details or expired card</li>
                    <li>Session timeout - try booking again</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {(propertyId || checkIn) && (
              <Button 
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-8"
              >
                {isRetrying ? 'Loading...' : 'Try Again'}
              </Button>
            )}
            <Link href="/stay">
              <Button variant="outline" className="rounded-full px-8">
                Browse Properties
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="rounded-full px-8">
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Need immediate assistance? Our support team is available 24/7
            </p>
            <div className="flex items-center justify-center gap-6">
              <a href="tel:+15551234567" className="flex items-center gap-2 text-blue-600 hover:underline">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </a>
              <a href="mailto:hello@swissalpinejourney.com" className="flex items-center gap-2 text-blue-600 hover:underline">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@swissalpinejourney.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
