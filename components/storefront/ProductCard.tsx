'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/ecommerce';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { Star, ShoppingBag, Heart, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercentage(
    product.discount_price ?? product.price,
    product.price
  );

  const isLowStock = product.stock > 0 && product.stock <= product.min_stock_warning;

  return (
    <div className="group relative bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500 text-white shadow-xs">
            -{discountPercent}% OFF
          </span>
        )}
        {product.is_bestseller && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Zap className="w-3 h-3 fill-slate-950" /> BESTSELLER
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isFavorited
            ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
            : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-red-500 hover:scale-110'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block w-full aspect-square bg-slate-50 dark:bg-slate-800/50 overflow-hidden p-6"
      >
        <Image
          src={product.main_image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-semibold mb-1">
            <span className="uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {product.brand}
            </span>
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
          </div>

          {/* Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {product.average_rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              ({product.review_count})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {formatPrice(product.discount_price ?? product.price)}
              </span>
              {product.discount_price && (
                <span className="text-xs text-slate-600 dark:text-slate-300 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {isLowStock ? (
              <span className="text-[10px] font-bold text-amber-500">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> In Stock
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center"
            title="Quick Add to Cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
