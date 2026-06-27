'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Users,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';

interface UserInfo {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { href: '/admin/products', label: 'Products', icon: Car, permission: 'products:read' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare, permission: 'inquiries:read' },
  { href: '/admin/dealers', label: 'Dealers', icon: Users, permission: 'dealers:read' },
  { href: '/admin/blog', label: 'Blog', icon: FileText, permission: 'blog:read' },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle, permission: 'faq:read' },
  { href: '/admin/users', label: 'Users', icon: Shield, permission: 'users:read' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, permission: 'settings:read' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((data) => {
      if (data.user) setUser(data.user);
    });
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  const visibleItems = menuItems.filter((item) => {
    if (!item.permission) return true;
    return user?.permissions?.includes(item.permission);
  });

  const sidebarContent = (
    <>
      <div className="p-6">
        <Link href="/admin" className="text-xl font-bold text-primary">
          Saric Admin
        </Link>
        {user && (
          <p className="text-xs text-gray-400 mt-1">{user.username} ({user.role})</p>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Saric Admin
          </Link>
          <button onClick={closeDrawer} className="p-1 text-gray-400 hover:text-white" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900 text-white min-h-screen flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
