'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Product, Order } from '@/types/ecommerce';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ExternalLink,
  Zap,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    dbAdapter.getProducts().then(setProducts);
    dbAdapter.getOrders().then(setOrders);
  }, []);

  // Metrics
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0) + 14850.0; // Baseline demo revenue
  const totalOrdersCount = orders.length + 128;

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length + 4;
  const processingOrders = orders.filter((o) => o.status === 'processing').length + 8;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length + 19;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length + 97;

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.min_stock_warning);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Hardware Storefront Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Executive Performance Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live metrics across GaN chargers, power banks, testing tools, and customer shipments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Manage Catalog
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> View All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Store Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatPrice(totalSales)}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs last month
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalOrdersCount}</p>
          <p className="text-[11px] text-slate-400">{pendingOrders} awaiting courier dispatch</p>
        </div>

        {/* Active Products */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Catalog SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{products.length}</p>
          <p className="text-[11px] text-slate-400">6 categories active</p>
        </div>

        {/* Stock Alerts */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Low Stock Warnings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400">{lowStockProducts.length}</p>
          <p className="text-[11px] text-slate-400">Need replenishment</p>
        </div>
      </div>

      {/* Order Status Breakdown Badges */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Pending / Confirmed</span>
          <p className="text-lg font-bold text-amber-400 mt-1">{pendingOrders}</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Processing / Lab Testing</span>
          <p className="text-lg font-bold text-blue-400 mt-1">{processingOrders}</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">In Transit / Shipped</span>
          <p className="text-lg font-bold text-purple-400 mt-1">{shippedOrders}</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Completed / Delivered</span>
          <p className="text-lg font-bold text-emerald-400 mt-1">{deliveredOrders}</p>
        </div>
      </div>

      {/* Visual Analytics Chart Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Weekly Sales Velocity (Revenue & Volume)</h2>
            <p className="text-xs text-slate-400">Benchmarked performance across seven daily periods</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded-lg">
            +31.4% Growth
          </span>
        </div>

        {/* SVG Chart Graphic */}
        <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
          {[
            { day: 'Mon', val: 65, amount: '৳21,400' },
            { day: 'Tue', val: 78, amount: '৳28,900' },
            { day: 'Wed', val: 55, amount: '৳19,500' },
            { day: 'Thu', val: 92, amount: '৳34,200' },
            { day: 'Fri', val: 84, amount: '৳31,000' },
            { day: 'Sat', val: 98, amount: '৳38,900' },
            { day: 'Sun', val: 89, amount: '৳32,500' },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.amount}
              </span>
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125"
                style={{ height: `${bar.val}%` }}
              />
              <span className="text-[11px] font-bold text-slate-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Recent Orders & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Recent Hardware Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No orders placed yet.</p>
            ) : (
              orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#{ord.order_number}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 capitalize border border-blue-900">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ord.customer_name} • {ord.items.length} items • {formatDate(ord.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{formatPrice(ord.total)}</p>
                    <Link
                      href="/admin/orders"
                      className="text-[10px] text-blue-400 hover:underline font-semibold"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Best Sellers (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Best-Selling Hardware</h3>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-blue-400 hover:underline"
            >
              All SKUs
            </Link>
          </div>

          <div className="space-y-3">
            {bestSellers.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-800"
              >
                <div className="relative w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-700 p-1">
                  <Image
                    src={prod.main_image}
                    alt={prod.title}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-white truncate">{prod.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatPrice(prod.discount_price ?? prod.price)} • In Stock: {prod.stock}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  TOP GEAR
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
