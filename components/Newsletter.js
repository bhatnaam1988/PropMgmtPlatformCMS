'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Newsletter({ heading = 'Stay Connected', description = 'Join our community for updates' }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

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
              disabled={isSubmitting}
              className="rounded-full"
              aria-required="true"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-black text-white hover:bg-gray-800 rounded-full px-8 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Join Us'}
            </Button>
          </div>
          
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
