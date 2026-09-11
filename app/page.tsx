import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { HeroSection } from '@/components/storefront/HeroSection';
import { CategoryCards } from '@/components/storefront/CategoryCards';
import { DealsSection } from '@/components/storefront/DealsSection';
import { YouTubeSection } from '@/components/storefront/YouTubeSection';
import { TrustSection } from '@/components/storefront/TrustSection';
import { ProductCard } from '@/components/storefront/ProductCard';
import { dbAdapter } from '@/lib/store/db-adapter';
import { ArrowRight, Sparkles, Trophy } from 'lucide-react';

export default async function HomePage() {
  const products = await dbAdapter.getProducts();
  const categories = await dbAdapter.getCategories();

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Bar */}
        <CategoryCards categories={categories} />

        {/* Featured Hardware Section */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>Lab Recommended</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Featured Hardware Gear
                </h2>
              </div>
              <Link
                href="/shop?sort=featured"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                View All Featured <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* Flash Deals Section with Live Countdown */}
        <DealsSection products={products} />

        {/* Best Sellers Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs uppercase tracking-widest">
                  <Trophy className="w-4 h-4" />
                  <span>Community Favorites</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Top Best Sellers
                </h2>
              </div>
              <Link
                href="/shop?sort=bestseller"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                View All Bestsellers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* YouTube Channel Lab Section */}
        <YouTubeSection />

        {/* Why Choose Us Trust Markers */}
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
