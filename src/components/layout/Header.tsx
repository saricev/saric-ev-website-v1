'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { company } from '@/data/company';
import Container from './Container';
import MobileMenu from './MobileMenu';
import { NavItem } from '@/types';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Tourism & Sightseeing', href: '/products?category=tourism' },
      { label: 'Security & Patrol', href: '/products?category=patrol' },
      { label: 'Logistics & Cargo', href: '/products?category=logistics' },
      { label: 'Utility Vehicles', href: '/products?category=utility' },
    ],
  },
  { label: 'Solutions', href: '/solutions' },
  { label: 'OEM/ODM', href: '/oem-odm' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">{company.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="ml-1 w-4 h-4" />}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Get Quote
            </Link>
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <MobileMenu
        items={navItems}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
