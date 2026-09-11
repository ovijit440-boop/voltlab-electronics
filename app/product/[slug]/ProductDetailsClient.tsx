'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Review } from '@/types/ecommerce';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { dbAdapter } from '@/lib/store/db-adapter';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ImageUploader } from '@/components/ui/ImageUploader';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  CheckCircle2,
  Tv,
  MessageSquare,
  FileText,
  HelpCircle,
  Share2,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
  initialReviews: Review[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
  initialReviews,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState<string>(product.main_image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'video' | 'warranty' | 'reviews'>('specs');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const effectivePrice = product.discount_price ?? product.price;
  const discountPercent = calculateDiscountPercentage(effectivePrice, product.price);

  const images = Array.from(new Set([product.main_image, ...product.gallery_images]));

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    const newRev = await dbAdapter.addReview({
      product_id: product.id,
      customer_name: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewComment.trim(),
      images: reviewImage ? [reviewImage] : [],
      is_verified_purchase: true,
    });

    setReviews([newRev, ...reviews]);
    setReviewerName('');
    setReviewComment('');
    setReviewImage('');
    setIsSubmittingReview(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-slate-900 dark:hover:text-white">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-slate-900 dark:hover:text-white capitalize"
        >
          {product.category.replace('-', ' ')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
        {/* Left Gallery (7 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden p-8 shadow-xs flex items-center justify-center">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain p-6 hover:scale-105 transition-transform duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 overflow-hidden shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-blue-600 shadow-md scale-102'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i}`} fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details (5 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                <Zap className="w-3.5 h-3.5" /> {product.brand}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2 leading-tight">
              {product.title}
            </h1>

            {/* Rating & Reviews Jump */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.average_rating)
                        ? 'fill-amber-400'
                        : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {product.average_rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                ({product.review_count} verified reviews)
              </span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium ml-2"
              >
                Read Reviews
              </button>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {formatPrice(effectivePrice)}
                </span>
                {product.discount_price && (
                  <span className="text-base text-slate-600 dark:text-slate-300 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                Free standard shipping unlocked on this order!
              </p>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full border border-red-200">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.short_description}
          </p>

          {/* Action Row: Quantity + Add to Cart + Buy Now + Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isFavorited
                    ? 'border-red-500 bg-red-50 text-red-500 dark:bg-red-950/40'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-500'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Buy Now (Instant Checkout)
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">1-Year Warranty</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-300">Replacement</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <Truck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">24h Dispatch</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-300">With tracking</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <RotateCcw className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">30-Day Return</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-300">Zero restocking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specs, Features, YouTube Video, Warranty, Reviews */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-10 mb-16">
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-4 sm:gap-8 mb-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'features'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Key Features
          </button>
          {product.youtube_video_id && (
            <button
              onClick={() => setActiveTab('video')}
              className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === 'video'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-red-500" /> YouTube Teardown & Benchmarks
            </button>
          )}
          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'warranty'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Warranty & Shipping
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Tab 1: Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Hardware Benchmark Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{spec.key}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Features */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Engineered Performance Highlights
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 3: YouTube Video Player */}
          {activeTab === 'video' && product.youtube_video_id && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-500" /> Lab Teardown & Benchmarks
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${product.youtube_video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-500 hover:underline font-bold"
                >
                  Open in YouTube ↗
                </a>
              </div>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${product.youtube_video_id}`}
                  title={product.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Warranty */}
          {activeTab === 'warranty' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Official Warranty Protection
                </h4>
                <p>{product.warranty_info}</p>
                <p className="text-slate-500">
                  Covers internal electronic components, GaN chips, charging ports, and power circuitry.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-500" /> Shipping & Delivery Policy
                </h4>
                <p>{product.shipping_info}</p>
                <p className="text-slate-500">{product.return_info}</p>
              </div>
            </div>
          )}

          {/* Tab 5: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Reviews Summary & Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">
                    {product.average_rating.toFixed(1)}
                  </span>
                  <div className="flex justify-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.average_rating)
                            ? 'fill-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Based on {reviews.length} customer ratings</p>
                </div>

                {/* Submit Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Write a Verified Review</h4>
                  {reviewSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                      ✓ Thank you! Your review has been submitted and published.
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name / Handle
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Alex TechMaker"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Star Rating
                      </label>
                      <select
                        value={reviewerRating}
                        onChange={(e) => setReviewerRating(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                        <option value={2}>⭐⭐ (2/5 Below Expectations)</option>
                        <option value={1}>⭐ (1/5 Poor)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Review Comments
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thermal tests, charging speeds, or build quality feedback..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      label="Attach Product Photo (Optional - Uploaded via ImgBB)"
                      value={reviewImage}
                      onChange={setReviewImage}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3 pt-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.customer_name}
                        </span>
                        {rev.is_verified_purchase && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.title && (
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {rev.title}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {rev.comment}
                    </p>
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {rev.images.map((img, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                            <Image src={img} alt="Customer photo" fill sizes="64px" className="object-contain p-1" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Recommended Hardware from the Same Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
