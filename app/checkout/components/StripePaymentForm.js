'use client';

import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock } from 'lucide-react';

export default function StripePaymentForm({ 
  amount, 
  currency, 
  onSuccess, 
  onError,
  guestName,
  guestEmail,
  cardholderName,
}) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentReady, setPaymentReady] = useState(false);

  useEffect(() => {
    if (!elements) return;
    
    // Listen for when Payment Element is ready
    elements.getElement('payment')?.on('ready', () => {
      setPaymentReady(true);
    });
  }, [elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success`,
          payment_method_data: {
            billing_details: {
              name: guestName,
              email: guestEmail,
            },
          },
        },
        redirect: 'if_required', // Don't redirect if not needed (for non-3DS cards)
      });

      if (error) {
        // Payment failed
        console.error('Payment error:', error);
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        
        if (onError) {
          onError(error);
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded without redirect (no 3DS)
        console.log('✅ Payment succeeded:', paymentIntent.id);
        
        if (onSuccess) {
          onSuccess(paymentIntent);
        }
      } else {
        // Payment requires additional action (3DS) - user will be redirected
        console.log('⏳ Payment processing:', paymentIntent?.status);
      }

    } catch (err) {
      console.error('Payment exception:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Payment Details</h3>
          <p className="text-sm text-gray-600">
            Enter your card details to complete the booking
          </p>
        </div>
        
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card'],
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Payment Failed</p>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Secure Payment</p>
            <p className="text-sm text-blue-700 mt-1">
              Your payment is processed securely by Stripe. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || !paymentReady || isProcessing}
        className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing Payment...
          </span>
        ) : (
          `Pay ${currency} ${amount}`
        )}
      </Button>

      {/* Payment Info */}
      <p className="text-xs text-gray-500 text-center">
        By confirming your payment, you agree to our Terms & Conditions and Privacy Policy. 
        Your booking will be confirmed immediately after successful payment.
      </p>
    </form>
  );
}
