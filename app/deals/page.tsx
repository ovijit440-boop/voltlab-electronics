import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Flame, Tag, Clock } from 'lucide-react';

export default async function DealsPage() {
  const products = await dbAdapter.getProducts();
  const dealProducts = products.filter((p) => p.is_on_sale || (p.discount_price && p.discount_price < p.price));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Limited Hardware Stock</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Benchmarked Flash Deals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Save on high-wattage GaN chargers, heavy-duty laptop power banks, and electronics tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
