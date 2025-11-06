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
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center md:justify-between h-16">
          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Home className="h-4 w-4" />
              Swiss Alpine Journey
            </Link>
            <Link
              href="/stay"
              className="text-foreground hover:text-primary transition-colors"
            >
              Stay
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
                Explore
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {exploreItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
                Services
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {servicesItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
                About
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {aboutItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 absolute left-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Swiss Alpine Journey
              </Link>
              <Link
                href="/stay"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Stay
              </Link>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2">Explore</p>
                {exploreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2">Services</p>
                {servicesItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground mb-2">About</p>
                {aboutItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
