'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    couponError,
    freeShippingThreshold,
    freeShippingRemaining,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review your items and apply promotional hardware coupons
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-semibold"
              >
                Clear Cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your cart is empty
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Looks like you have not added any GaN chargers or electronics gear yet.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                Explore Shop <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Items Column */}
              <div className="lg:col-span-8 space-y-4">
                {/* Free Shipping Progress */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-800 dark:text-slate-200">
                    <span>
                      {freeShippingRemaining > 0 ? (
                        <>Add <b className="text-blue-600 dark:text-blue-400">{formatPrice(freeShippingRemaining)}</b> more for Free Shipping!</>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-4 h-4" /> You unlocked FREE Priority Shipping!
                        </span>
                      )}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((item) => {
                    const price = item.product.discount_price ?? item.product.price;
                    return (
                      <div
                        key={`${item.product.id}-${item.selected_variant?.id || 'default'}`}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                      >
                        <div className="relative w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 p-2">
                          <Image
                            src={item.product.main_image}
                            alt={item.product.title}
                            fill
                            sizes="96px"
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {item.product.brand}
                          </span>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="block text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 transition-colors mt-0.5"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-1">
                            SKU: {item.product.sku}
                          </p>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {formatPrice(price * item.quantity)}
                            </p>
                            <p className="text-[10px] text-slate-600 dark:text-slate-300">
                              {formatPrice(price)} each
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping Hardware
                  </Link>
                </div>
              </div>

              {/* Right Order Summary Column */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Order Summary
                  </h2>

                  {/* Coupon Form */}
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo Code (e.g. WELCOME10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2.5 text-slate-900 dark:text-white uppercase font-mono"
                        />
                        <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </form>

                    {couponError && (
                      <p className="text-[11px] text-red-500 mt-1.5 font-medium">{couponError}</p>
                    )}

                    {coupon && (
                      <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Code: {coupon.code}
                        </span>
                        <button
                          onClick={removeCoupon}
                          className="text-[11px] font-bold text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Coupon Savings</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {shippingCost === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span>Grand Total</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-98"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
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
