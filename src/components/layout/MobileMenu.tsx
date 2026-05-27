'use client';

import Link from 'next/link';
import { NavItem } from '@/types';

interface MobileMenuProps {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ items, open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
        {items.map((item) => (
          <div key={item.label}>
            <Link
              href={item.href}
              onClick={onClose}
              className="block px-4 py-3 text-gray-700 font-medium hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              {item.label}
            </Link>
            {item.children && (
              <div className="pl-6 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className="block px-4 py-2 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="pt-4 px-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="block w-full text-center px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Get Quote
          </Link>
        </div>
      </nav>
    </div>
  );
}
