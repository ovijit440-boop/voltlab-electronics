'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { Zap, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithSupabase } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!email || !password) return;

    setIsLoading(true);
    const result = await signUpWithSupabase(email, password, name, false);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি।');
      return;
    }

    if (result.needEmailVerification) {
      setSuccessMessage('আপনার অ্যাকাউন্ট তৈরি হয়েছে! আপনার ইমেইল চেক করে ভেরিফাই করুন।');
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-16 flex items-center justify-center p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create Customer Account
            </h1>
            <p className="text-xs text-slate-500">
              Join Servicing World to track orders, save hardware wishlists, and get exclusive lab discounts
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
