'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  AlertTriangle,
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
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If on login page, render children directly without admin layout & guard
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isLoading, user, pathname, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 mt-4 tracking-wider uppercase">
          Supabase Admin পারমিশন চেক করা হচ্ছে...
        </p>
      </div>
    );
  }

  // Not logged in state (while redirecting)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">লগইন প্রয়োজন</h2>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            এডমিন প্যানেলে প্রবেশ করার জন্য Supabase Admin অ্যাকাউন্টে লগইন করতে হবে।
          </p>
        </div>
        <Link
          href="/admin/login"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
        >
          লগইন পেজে যান →
        </Link>
      </div>
    );
  }

  // Logged in but NOT Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-900/60 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
              Access Denied
            </span>
            <h2 className="text-xl font-black text-white mt-2">অ্যাক্সেস অনুমোদিত নয়</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              আপনি বর্তমানে <span className="font-mono text-amber-300 font-bold">{user.email}</span> হিসেবে লগইন আছেন। তবে এই একাউন্টের Supabase-এ <span className="text-white font-bold">Admin অনুমতি নেই</span>।
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 text-left space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> কীভাবে একাউন্টটি Admin বানাবেন?
            </p>
            <p>
              Supabase ড্যাশবোর্ডে গিয়ে <span className="text-slate-200">Authentication &gt; Users</span> থেকে এই ইমেইলের User Metadata-তে যোগ করুন:
            </p>
            <code className="block p-2 bg-slate-900 text-emerald-400 rounded-lg text-[10px] font-mono">
              &#123;&quot;role&quot;: &quot;admin&quot;&#125;
            </code>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => logout()}
              className="py-2.5 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30 rounded-xl text-xs font-bold transition-colors"
            >
              লগআউট করুন
            </button>
            <Link
              href="/"
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center"
            >
              স্টোরফ্রন্টে যান ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
