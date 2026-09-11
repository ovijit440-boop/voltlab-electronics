import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p>
            By accessing and purchasing from SERVICING WORLD, you agree to comply with our terms and warranty parameters.
          </p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Product Use & Safety</h2>
          <p>
            All electronic tools, chargers, and soldering equipment must be operated according to their specified voltage thresholds and standard safety precautions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
