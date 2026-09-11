'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Order } from '@/types/ecommerce';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  User,
  Package,
  Heart,
  Shield,
  Clock,
  ArrowRight,
  LogOut,
  MapPin,
  Truck,
} from 'lucide-react';

export default function AccountOverviewPage() {
  const { user, logout, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    dbAdapter.getOrders().then((all) => {
      if (user?.email) {
        setOrders(all.filter((o) => o.customer_email === user.email || o.customer_id === user.id));
      } else {
        setOrders(all.slice(0, 3));
      }
    });
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-sm space-y-4">
            <User className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Sign In</h2>
            <p className="text-xs text-slate-500">Sign in to view your previous hardware orders and saved items.</p>
            <Link
              href="/login"
              className="inline-block w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Profile Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {user.full_name || 'Valued Customer'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 uppercase">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Orders Placed</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {orders.length}
                </p>
              </div>
            </div>

            <Link
              href="/account/wishlist"
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 hover:border-red-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Saved Hardware</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {wishlistCount} items
                </p>
              </div>
            </Link>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Active Warranty</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  1-Year Full Coverage
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Hardware Orders</h2>
                <p className="text-xs text-slate-500">Track and view receipts for orders placed through SERVICING WORLD</p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Browse Shop <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No previous orders</p>
                <p className="text-xs text-slate-500">When you place orders, your receipts and live tracking will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          #{ord.order_number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 capitalize">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {formatDate(ord.created_at)} • {ord.items.length} items • Total: <b>{formatPrice(ord.total)}</b>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/track-order?orderId=${ord.order_number}`}
                        className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track
                      </Link>
                      <Link
                        href={`/order-success/${ord.order_number}`}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
                      >
                        Receipt
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
