import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function ReturnPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            30-Day Money-Back Guarantee & Returns
          </h1>
          <p>
            We stand behind every piece of hardware we sell. If you are not completely satisfied with your purchase, you may initiate a return within 30 days of receiving your package.
          </p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Zero Restocking Fees</h2>
          <p>
            Unlike other electronics retailers, Servicing World does not charge restocking fees. Returns must include the original packaging, included cables, and accessories.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
