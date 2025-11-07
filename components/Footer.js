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
          <div className="min-w-0">
            <h3 className="font-medium mb-4">Services</h3>
            <div className="space-y-2">
              <Link 
                href="/cleaning-services" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Cleaning Services
              </Link>
              <Link 
                href="/rental-services" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Rental Management
              </Link>
              <Link 
                href="/jobs" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="min-w-0">
            <h3 className="font-medium mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+41 27 956 XX XX</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">hello@swissalpinejourney.com</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Grächen, Valais, Switzerland</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="min-w-0">
            <h3 className="font-medium mb-4">Legal</h3>
            <div className="space-y-2">
              <Link 
                href="/legal#privacy" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/legal#terms" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/legal#gdpr" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                GDPR Information
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>&copy; 2024 Swiss Alpine Journey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
