import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function PolicyPages() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white not-prose">
            Privacy Policy & Data Security
          </h1>
          <p>Last updated: September 2026</p>
          <p>
            At SERVICING WORLD, we take customer privacy and telemetry security seriously. We only collect the minimal personal data necessary to benchmark, dispatch, and track your electronic orders.
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white not-prose">1. Information We Collect</h2>
          <p>
            When you place an order or create an account, we collect your name, shipping address, email, phone number, and order details. We do not store full credit card credentials on our servers; payments are processed securely through certified payment gateways.
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white not-prose">2. How Information is Used</h2>
          <p>
            Your information is used strictly to fulfill orders, issue warranty certificates, provide live courier tracking updates, and offer technical customer support.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
