'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || searchParams.get('id');
  const propertyName = searchParams.get('property');

  useEffect(() => {
    // Track successful booking (for analytics)
    console.log('✅ Booking completed successfully:', bookingId);
  }, [bookingId]);

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
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-light mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your reservation has been successfully completed.
          </p>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 text-left">
            <h2 className="text-2xl font-light mb-4">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email with your booking details and receipt. 
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium mb-1">Booking Management</p>
                  <p className="text-sm text-gray-600">
                    You can manage your booking through the link in your confirmation email. 
                    Any questions? Contact us at hello@swissalpinejourney.com
                  </p>
                </div>
              </div>

              {bookingId && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Booking Reference:</strong> {bookingId}
                  </p>
                  {propertyName && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Property:</strong> {propertyName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                Return to Home
              </Button>
            </Link>
            <Link href="/stay">
              <Button variant="outline" className="rounded-full px-8">
                Browse More Properties
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="mailto:hello@swissalpinejourney.com" className="text-blue-600 underline">
                hello@swissalpinejourney.com
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
