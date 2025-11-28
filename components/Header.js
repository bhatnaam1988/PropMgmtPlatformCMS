'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const exploreItems = [
    { label: 'Grächen', href: '/explore/graechen' },
    { label: 'Other Locations', href: '/explore/other-locations' },
    { label: 'Travel Tips', href: '/explore/travel-tips' },
    { label: 'Behind the Scenes', href: '/explore/behind-the-scenes' },
  ];

  const servicesItems = [
    { label: 'Cleaning Services', href: '/cleaning-services' },
    { label: 'Rental Services', href: '/rental-services' },
  ];

  const aboutItems = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/jobs' },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start gap-8 h-16">
          {/* Logo - Left Aligned */}
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hidden md:flex focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Swiss Alpine Journey - Home"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Swiss Alpine Journey</span>
          </Link>

          {/* Desktop Navigation - Left Aligned */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <a
              href="/stay"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/stay';
              }}
              className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 cursor-pointer"
            >
              Stay
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Explore menu"
              >
                Explore
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent role="menu" aria-label="Explore submenu">
                {exploreItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild role="none">
                    <Link href={item.href} className="w-full" role="menuitem">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/blog"
              className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Blog
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Services menu"
              >
                Services
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent role="menu" aria-label="Services submenu">
                {servicesItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild role="none">
                    <Link href={item.href} className="w-full" role="menuitem">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                aria-label="About menu"
              >
                About
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent role="menu" aria-label="About submenu">
                {aboutItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild role="none">
                    <Link href={item.href} className="w-full" role="menuitem">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button and Logo */}
          <div className="flex md:hidden items-center justify-between w-full">
            <button
              className="p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="Swiss Alpine Journey - Home"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Swiss Alpine Journey</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Swiss Alpine Journey - Home"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Swiss Alpine Journey</span>
              </Link>
              <a
                href="/stay"
                className="text-foreground hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  window.location.href = '/stay';
                }}
              >
                Stay
              </a>
              <Link
                href="/blog"
                className="text-foreground hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2 font-medium">Explore</p>
                <ul role="list">
                  {exploreItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors py-2 pl-4 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2 font-medium">Services</p>
                <ul role="list">
                  {servicesItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors py-2 pl-4 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2 font-medium">About</p>
                <ul role="list">
                  {aboutItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors py-2 pl-4 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
