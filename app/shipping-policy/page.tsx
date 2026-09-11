import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Shipping & Dispatch Policy
          </h1>
          <p>
            Servicing World operates a dedicated testing and ESD-safe packaging facility. All orders are packed in moisture-barrier and anti-static shielding bags to guarantee component protection during transit.
          </p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">ডেলিভারি চার্জ ও সময়সীমা (Delivery Rates)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><b>ঢাকা সিটির ভেতরে (Inside Dhaka):</b> ৳৬০ টাকা, অথবা ৳২,০০০ টাকার অধিক অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি। সাধারণত ১–২ কার্যদিবসের মধ্যে পৌঁছায়।</li>
            <li><b>ঢাকার বাইরে / সারাদেশে (Outside Dhaka):</b> ৳১২০ টাকা কুরিয়ার ডেলিভারি চার্জ। ২–৩ কার্যদিবসের মধ্যে হোম ডেলিভারি।</li>
            <li><b>ক্যাশ অন ডেলিভারি:</b> পণ্য হাতে পেয়ে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধের সুযোগ।</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
