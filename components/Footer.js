'use client';

import Link from 'next/link';
import { Home, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="Swiss Alpine Journey - Home"
            >
              <Home className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="font-medium">Swiss Alpine Journey</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Where authentic stays meet modern comfort and local adventure. 
              Discover perfectly located homes for your next adventure.
            </p>
            <nav aria-label="Social media">
              <ul role="list">
                <li>
                  <a
                    href="https://instagram.com/swissalpinejourney"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label="Follow Swiss Alpine Journey on Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                    <span>@swissalpinejourney</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Services Links */}
          <nav className="min-w-0" aria-labelledby="footer-services-heading">
            <h3 id="footer-services-heading" className="font-medium mb-4">Services</h3>
            <ul role="list" className="space-y-2">
              <li>
                <Link 
                  href="/cleaning-services" 
                  className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Cleaning Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/rental-services" 
                  className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Rental Management
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs" 
                  className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="min-w-0 not-italic" aria-labelledby="footer-contact-heading">
            <h3 id="footer-contact-heading" className="font-medium mb-4">Contact</h3>
            <ul role="list" className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a href="tel:+41279560000" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  +41 27 956 XX XX
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:hello@swissalpinejourney.com" className="break-all hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  hello@swissalpinejourney.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Grächen, Valais, Switzerland</span>
              </li>
            </ul>
          </address>

          {/* Legal Links */}
          <nav className="min-w-0" aria-labelledby="footer-legal-heading">
            <h3 id="footer-legal-heading" className="font-medium mb-4">Legal</h3>
            <ul role="list" className="space-y-2">
              <li>
                <Link 
                  href="/legal#privacy" 
                  className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal#terms" 
                  className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal#gdpr" 
                  className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  GDPR Information
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>&copy; 2024 Swiss Alpine Journey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
