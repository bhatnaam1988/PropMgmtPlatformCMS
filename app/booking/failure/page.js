'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingFailurePage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const propertyId = searchParams.get('propertyId');

  useEffect(() => {
    // Track failed booking (for analytics)
    console.log('❌ Booking failed:', error);
  }, [error]);

  const getErrorMessage = () => {
    if (error?.includes('payment')) {
      return 'Your payment could not be processed. Your card may have been declined or there may have been a technical issue.';
    }
    if (error?.includes('availability')) {
      return 'The selected dates are no longer available. The property may have been booked by another guest.';
    }
    return 'We encountered an issue processing your booking. Please try again or contact us for assistance.';
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
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-light mb-4">Booking Not Completed</h1>
          <p className="text-xl text-gray-600 mb-8">
            {getErrorMessage()}
          </p>

          {/* Details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 text-left">
            <h2 className="text-2xl font-light mb-4">What You Can Do</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <RefreshCcw className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Try Again</p>
                  <p className="text-sm text-gray-600">
                    You can return to the property page and attempt your booking again. 
                    Your selections have not been saved.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Check Your Payment Method</p>
                  <p className="text-sm text-gray-600">
                    Ensure your payment card has sufficient funds and is authorized for online transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Contact Us</p>
                  <p className="text-sm text-gray-600">
                    If you continue to experience issues, please contact our support team. 
                    We're here to help!
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Error Details:</strong> {error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {propertyId ? (
              <Link href={`/property/${propertyId}`}>
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                  Return to Property
                </Button>
              </Link>
            ) : (
              <Link href="/stay">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                  Browse Properties
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button variant="outline" className="rounded-full px-8">
                Go to Home
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need immediate assistance?{' '}
              <a href="mailto:hello@swissalpinejourney.com" className="text-blue-600 underline">
                Email us
              </a>
              {' '}or call{' '}
              <a href="tel:+15551234567" className="text-blue-600 underline">
                +1 (555) 123-4567
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
