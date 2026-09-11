'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Store,
  Menu,
  X,
  Zap,
  Shield,
  LogOut,
  ChevronRight,
  TrendingUp,
  FolderTree,
  Users,
  FileText,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories & Brands', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Content CMS', href: '/admin/cms', icon: FileText },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-slate-800 shrink-0">
            <NextImage
              src="/logo.png"
              alt="SERVICING WORLD"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-black text-sm text-white tracking-wide">
            SERVICING WORLD <span className="text-blue-400">ADMIN</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileNavOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4 lg:p-5 lg:min-h-screen`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="hidden lg:flex items-center gap-3 px-2 py-3 mb-6">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shrink-0 shadow-md shadow-blue-500/20">
              <NextImage
                src="/logo.png"
                alt="SERVICING WORLD"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center">
                SERVICING <span className="text-blue-400 ml-1">WORLD</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block -mt-1">
                Storefront Manager
              </span>
            </div>
          </div>

          {/* Admin Role Status Badge */}
          <div className="px-3 py-2.5 mb-6 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Admin User'}</p>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase">Super Admin Access</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-400" /> View Storefront ↗
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 rounded-xl hover:bg-red-950/30 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
