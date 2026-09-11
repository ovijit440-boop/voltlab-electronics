import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { dbAdapter } from '@/lib/store/db-adapter';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Printer } from 'lucide-react';

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { id } = await params;
  const order = await dbAdapter.getOrderById(id);

  if (!order) {
    // If accessed right after checkout with random id, create friendly placeholder view
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Order Confirmed!</h1>
            <p className="text-xs text-slate-500">
              Thank you for shopping at SERVICING WORLD. Your order #{id} has been recorded and scheduled for testing and dispatch.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/shop" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
                Continue Shopping
              </Link>
              <Link href="/track-order" className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold">
                Track Order
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Top Success Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xs mb-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Order Received & Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Thank You, {order.customer_name.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                A confirmation receipt and tracking code have been sent to{' '}
                <b className="text-slate-800 dark:text-slate-200">{order.customer_email}</b>.
              </p>
            </div>

            {/* Order Code Pill */}
            <div className="inline-flex items-center gap-2 p-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              <Package className="w-4 h-4 text-blue-500" />
              <span>Order Number: <b>{order.order_number}</b></span>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href={`/track-order?orderId=${order.order_number}`}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Truck className="w-4 h-4" /> Live Tracking Status
              </Link>
              <Link
                href="/shop"
                className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </div>

          {/* Receipt Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Receipt Details</h3>
                <p className="text-[11px] text-slate-500">Placed on {formatDate(order.created_at)}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 capitalize">
                Status: {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 p-1">
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=100&q=80'}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promo Discount ({order.coupon_code})</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-blue-600 dark:text-blue-400">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Shipping & Payment Meta */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Delivery Address</p>
                <p className="text-slate-600 dark:text-slate-400">{order.shipping_address.full_name}</p>
                <p className="text-slate-600 dark:text-slate-400">{order.shipping_address.street_address}</p>
                <p className="text-slate-600 dark:text-slate-400">
                  {order.shipping_address.city}, {order.shipping_address.postal_code}, {order.shipping_address.country}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Payment & Carrier</p>
                <p className="text-slate-600 dark:text-slate-400 capitalize">Method: {order.payment_method.replace('_', ' ')}</p>
                <p className="text-slate-600 dark:text-slate-400">Carrier: {order.shipping_carrier || 'Servicing World Courier'}</p>
                <p className="text-slate-600 dark:text-slate-400 font-mono">Tracking: {order.tracking_number || 'Assigning soon'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
