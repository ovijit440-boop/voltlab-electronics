'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Product, SiteSettings } from '@/types/ecommerce';
import { formatPrice } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  Zap,
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  ArrowRight,
  Flame,
  Tv,
  HelpCircle,
  Package,
  Layers,
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dbAdapter.getProducts().then(setAllProducts);
    dbAdapter.getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = allProducts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 5);
      setSearchResults(matched);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, allProducts]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Notification Bar */}
      {settings?.is_announcement_active !== false && (settings?.announcement_text || !settings) && (
        <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 hidden md:flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            {(settings?.announcement_badge ?? 'LAB TESTED') ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                {settings?.announcement_badge ?? 'LAB TESTED'}
              </span>
            ) : null}
            <span>{settings?.announcement_text ?? '⚡ সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি (৳২,০০০ এর অর্ডারে ফ্রি ডেলিভারি)! প্রোমোকোড: WELCOME10'}</span>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
          <Link href="/track-order" className="hover:text-white transition-colors flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Track Order
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Tech Support
          </Link>
          <a
            href="https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors flex items-center gap-1 text-slate-300 font-semibold"
          >
            <Tv className="w-3.5 h-3.5 text-red-500" /> YouTube Channel
          </a>
        </div>
      </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform border border-slate-800 shrink-0">
                <Image
                  src="/logo.png"
                  alt="SERVICING WORLD"
                  width={44}
                  height={44}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  SERVICING <span className="text-blue-600 dark:text-blue-400 ml-1">WORLD</span>
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-300 font-bold -mt-1">
                  Electronics & Tech Lab
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="লকার মেশিন, মরিচ বাতি, টিভি মাদারবোর্ড, তাতাল, মাল্টিমিটার খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Dropdown Suggestions */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Product Suggestions
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No hardware products matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={product.main_image}
                            alt={product.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(product.discount_price ?? product.price)}
                            </span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-300">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="block p-2.5 text-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/40 hover:underline"
                    >
                      View all results ({searchResults.length}+ items) →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Admin */}
            <div className="relative group">
              <Link
                href={user ? '/account' : '/login'}
                className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden xl:inline text-xs font-semibold">
                  {user ? user.full_name?.split(' ')[0] : 'Sign In'}
                </span>
              </Link>

              {/* Hover Dropdown */}
              <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block z-50">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 text-xs">
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">{user.email}</p>
                        <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        href="/account"
                        className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
                      >
                        My Account & Orders
                      </Link>
                      <Link
                        href="/account/wishlist"
                        className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
                      >
                        My Wishlist ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-bold text-blue-600 dark:text-blue-400 my-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <Link
                        href="/login"
                        className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center rounded-xl"
                      >
                        Customer Login
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full py-1.5 border border-slate-300 dark:border-slate-700 text-center font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">
                {subtotal > 0 ? formatPrice(subtotal) : 'Cart'}
              </span>
            </button>
          </div>
        </div>

        {/* Lower Categories Bar */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold hover:text-blue-600 transition-colors"
            >
              <Layers className="w-4 h-4 text-blue-600" /> All Categories
            </Link>
            <Link href="/shop?category=chaser-machine" className="hover:text-blue-600 transition-colors">
              লকার মেশিন ও কন্ট্রোলার
            </Link>
            <Link href="/shop?category=morich-bati" className="hover:text-blue-600 transition-colors">
              মরিচ বাতি
            </Link>
            <Link href="/shop?category=tv-parts" className="hover:text-blue-600 transition-colors">
              টিভি রিপেয়ারিং পার্টস
            </Link>
            <Link href="/shop?category=tools" className="hover:text-blue-600 transition-colors">
              সার্ভিসিং টুলস ও তাতাল
            </Link>
            <Link href="/shop?category=blender-parts" className="hover:text-blue-600 transition-colors">
              ব্লেন্ডার মোটর
            </Link>
            <Link href="/shop?category=audio-amp" className="hover:text-blue-600 transition-colors">
              অ্যাম্প্লিফায়ার বোর্ড
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/deals"
              className="flex items-center gap-1 text-amber-500 font-bold hover:text-amber-600 transition-colors"
            >
              <Flame className="w-4 h-4 fill-amber-500" /> Flash Deals
            </Link>
            <a
              href="https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-red-500 font-bold hover:text-red-600 transition-colors"
            >
              <Tv className="w-4 h-4" /> YouTube Tech Demos
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-slate-900 z-50 p-6 overflow-y-auto space-y-6 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, SKU, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </form>

          <div className="space-y-3 font-semibold text-sm">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Product Categories
            </p>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              All Electronics & Tools
            </Link>
            <Link
              href="/shop?category=chaser-machine"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ⚡ লকার মেশিন ও কন্ট্রোলার
            </Link>
            <Link
              href="/shop?category=morich-bati"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✨ মরিচ বাতি ও লাইটিং
            </Link>
            <Link
              href="/shop?category=tv-parts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              📺 টিভি রিপেয়ারিং পার্টস
            </Link>
            <Link
              href="/shop?category=tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🛠️ সার্ভিসিং টুলস ও তাতাল
            </Link>
            <Link
              href="/shop?category=blender-parts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ⚙️ ব্লেন্ডার মোটর ও পার্টস
            </Link>
            <Link
              href="/shop?category=audio-amp"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🔊 অ্যাম্প্লিফায়ার ও মডিউল
            </Link>
            <Link
              href="/deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-amber-500 font-bold"
            >
              🔥 Flash Deals
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Package className="w-4 h-4 text-blue-500" /> Track My Order
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold"
              >
                <Shield className="w-4 h-4" /> Go to Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
