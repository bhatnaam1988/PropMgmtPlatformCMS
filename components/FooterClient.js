'use client';

import Link from 'next/link';
import { Home, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export function FooterClient({ brandSection, footerSections, socialMedia, copyrightText }) {
  return (
    <footer className="bg-muted border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:grid-cols-4 lg:col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={`${brandSection.name} - Home`}
            >
              <Home className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="font-medium">{brandSection.name}</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              {brandSection.tagline}
            </p>
            {socialMedia && socialMedia.length > 0 && (
              <nav aria-label="Social media">
                <ul role="list">
                  {socialMedia.map((social, index) => (
                    <li key={index}>
                      <a
                        href={social.url}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        aria-label={`Follow ${brandSection.name} on ${social.platform}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.platform === 'instagram' && <Instagram className="h-5 w-5" aria-hidden="true" />}
                        <span>{social.handle || `@${brandSection.name.toLowerCase().replace(/\s+/g, '')}`}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {/* Dynamic Footer Sections */}
          {footerSections.map((section, index) => (
            <nav key={index} className="min-w-0" aria-labelledby={`footer-${section.title.toLowerCase()}-heading`}>
              <h3 id={`footer-${section.title.toLowerCase()}-heading`} className="font-medium mb-4">{section.title}</h3>
              <ul role="list" className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.url} 
                      className="block text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
