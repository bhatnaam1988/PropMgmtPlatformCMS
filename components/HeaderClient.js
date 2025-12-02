'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function HeaderClient({ brandName = 'Swiss Alpine Journey', navigationItems = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start gap-8 h-16">
          {/* Logo - Left Aligned */}
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 hidden md:flex focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={`${brandName} - Home`}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>{brandName}</span>
          </Link>

          {/* Desktop Navigation - Left Aligned */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navigationItems.map((item, index) => {
              const hasDropdown = item.children && item.children.length > 0;

              if (hasDropdown) {
                return (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger 
                      className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                      aria-label={`${item.text} menu`}
                    >
                      {item.text}
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent role="menu" aria-label={`${item.text} submenu`}>
                      {item.children.map((child, childIndex) => (
                        <DropdownMenuItem key={childIndex} asChild role="none">
                          <Link href={child.link} className="w-full" role="menuitem">
                            {child.text}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <a
                  key={index}
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = item.link;
                  }}
                  className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 cursor-pointer"
                >
                  {item.text}
                </a>
              );
            })}
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
              aria-label={`${brandName} - Home`}
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>{brandName}</span>
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
                aria-label={`${brandName} - Home`}
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>{brandName}</span>
              </Link>
              
              {navigationItems.map((item, index) => {
                const hasDropdown = item.children && item.children.length > 0;

                if (hasDropdown) {
                  return (
                    <div key={index} className="border-t border-border pt-4">
                      <p className="text-muted-foreground mb-2 font-medium">{item.text}</p>
                      <ul role="list">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Link
                              href={child.link}
                              className="text-foreground hover:text-primary transition-colors py-2 pl-4 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return (
                  <a
                    key={index}
                    href={item.link}
                    className="text-foreground hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      window.location.href = item.link;
                    }}
                  >
                    {item.text}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
