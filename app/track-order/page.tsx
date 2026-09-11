'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Order } from '@/types/ecommerce';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Zap,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    const found = await dbAdapter.getOrderById(query.trim());
    setOrder(found);
    setIsLoading(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(orderQuery);
  };

  // Determine stage based on order.status
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStage = order ? getStageIndex(order.status) : 0;

  const stages = [
    { label: 'Order Received', desc: 'Hardware order logged' },
    { label: 'Lab Confirmed', desc: 'Inspected by tech engineer' },
    { label: 'Packaging & ESD', desc: 'Sealed with anti-static protection' },
    { label: 'Dispatched', desc: 'Handed to priority courier' },
    { label: 'Delivered', desc: 'Delivered to customer' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Live Hardware Logistics
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Track Your Hardware Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your Servicing World order number (e.g. <b>SW-123456</b>) to check real-time testing and courier status.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
            <form onSubmit={onSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Enter Order Number (e.g. SW-239401)..."
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 shrink-0"
              >
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </form>
          </div>

          {/* Result */}
          {hasSearched && !order && !isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Not Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We could not locate an order matching &quot;{orderQuery}&quot;. Please verify the order number on your receipt or email.
              </p>
            </div>
          )}

          {order && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-8">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Order #{order.order_number}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Placed on {formatDate(order.created_at)} • {order.items.length} items
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 capitalize border border-blue-200 dark:border-blue-900">
                    Status: {order.status}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Progress Timeline
                </h4>
                <div className="relative">
                  {/* Track Line */}
                  <div className="hidden sm:block absolute top-4 left-4 right-4 h-1 bg-slate-100 dark:bg-slate-800 -z-0" />
                  <div
                    className="hidden sm:block absolute top-4 left-4 h-1 bg-blue-600 transition-all duration-500 -z-0"
                    style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {stages.map((stg, i) => {
                      const isComplete = i <= currentStage;
                      const isCurrent = i === currentStage;
                      return (
                        <div key={i} className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                              isComplete
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            } ${isCurrent ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}
                          >
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              {stg.label}
                            </p>
                            <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                              {stg.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Carrier & Tracking */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Carrier Partner:</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-500" /> {order.shipping_carrier || 'Servicing World Courier'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Courier Tracking Code:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {order.tracking_number || 'Awaiting dispatch scan'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Hardware Ordered
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{it.title}</p>
                        <p className="text-[11px] text-slate-500">Qty: {it.quantity} • SKU: {it.sku}</p>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(it.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Zap className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
