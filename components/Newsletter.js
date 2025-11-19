'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Newsletter({ heading, description }) {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="newsletter-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="newsletter-heading" className="text-3xl font-light mb-4">{heading}</h2>
        <p className="text-gray-600 mb-8">{description}</p>
        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4" aria-label="Newsletter signup form">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-full"
            aria-required="true"
          />
          <Button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-full px-8 focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Join Us
          </Button>
        </form>
      </div>
    </section>
  );
}
