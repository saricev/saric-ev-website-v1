'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((data) => {
      if (data.user) setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const visibleItems = menuItems.filter((item) => {
    if (!item.permission) return true;
    return user?.permissions?.includes(item.permission);
  });

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
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
    </aside>
  );
}
