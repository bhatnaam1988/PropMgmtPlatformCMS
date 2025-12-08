'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export default function Newsletter({ heading = 'Stay Connected', description = 'Join our community for updates' }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // ReCaptcha hook
  const { executeRecaptcha, isLoading: isVerifying, error: recaptchaError, clearError } = useRecaptcha();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    clearError();
    
    // Execute ReCaptcha verification
    const isVerified = await executeRecaptcha('submit_newsletter');
    
    if (!isVerified) {
      // ReCaptcha verification failed, error is already set in state
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Thank you for subscribing! You\'ll be the first to know about new listings and special offers.' 
        });
        setEmail('');
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to subscribe. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to subscribe. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="newsletter-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="newsletter-heading" className="text-3xl font-light mb-4">{heading}</h2>
        <p className="text-gray-600 mb-8">{description}</p>
        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto" aria-label="Newsletter signup form">
          <div className="flex gap-4">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || isVerifying}
              className="rounded-full"
              aria-required="true"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || isVerifying}
              className="bg-black text-white hover:bg-gray-800 rounded-full px-8 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Verifying...' : isSubmitting ? 'Subscribing...' : 'Join Us'}
            </Button>
          </div>
          
          {/* ReCaptcha Error */}
          {recaptchaError && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-red-900 text-sm mb-1">Verification Failed</p>
                  <p className="text-sm text-red-700 mb-2">{recaptchaError}</p>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Try Again
                    </button>
                    <Link
                      href="/contact"
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Success/Error Message */}
          {message.text && (
            <div 
              className={`mt-4 p-4 rounded-lg flex items-center justify-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
              role="alert"
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
