'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useCart } from '@/components/providers/CartProvider';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Product } from '@/types/ecommerce';
import { formatPrice } from '@/lib/utils';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    dbAdapter.getProducts().then(setAllProducts);
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                My Hardware Wishlist ({wishlistedProducts.length})
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Saved chargers, multimeters, and electronic tools for quick checkout
              </p>
            </div>
            <Link
              href="/account"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Account
            </Link>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your wishlist is empty
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Click the heart icon on any product to save it here for later.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden mb-3 p-4">
                      <Image
                        src={prod.main_image}
                        alt={prod.title}
                        fill
                        sizes="200px"
                        className="object-contain p-2"
                      />
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-slate-900 text-slate-400 hover:text-red-500 shadow-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {prod.brand}
                    </p>
                    <Link
                      href={`/product/${prod.slug}`}
                      className="block text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 mt-1"
                    >
                      {prod.title}
                    </Link>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {formatPrice(prod.discount_price ?? prod.price)}
                    </span>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
