'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/ecommerce';
import { ProductCard } from './ProductCard';
import { Flame, Clock, ArrowRight, Tag } from 'lucide-react';

interface DealsSectionProps {
  products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
  // Mock countdown timer for flash deals (e.g. 18 hours 42 mins 19 secs)
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.is_on_sale).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
              <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
              <span>Limited Stock Flash Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Save Up to 35% on Benchmarked Tech
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Ends in:</span>
              <span className="font-mono bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[11px] font-black">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              :
              <span className="font-mono bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[11px] font-black">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              :
              <span className="font-mono bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[11px] font-black">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <Link
              href="/deals"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              All Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Promo Code Alert */}
        <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-semibold">
              Flash Deal Bonus: Get an extra <b>10% OFF</b> with coupon code: <span className="bg-white text-blue-700 font-mono font-bold px-2 py-0.5 rounded ml-1">WELCOME10</span>
            </p>
          </div>
          <span className="text-xs bg-white/15 px-3 py-1 rounded-full font-bold">
            Applies at Checkout
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
