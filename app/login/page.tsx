'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { Zap, Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithSupabase, user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) return;

    setIsLoading(true);
    const result = await loginWithSupabase(email, password);
    setIsLoading(false);

    if (!result.success) {
      let msg = result.error || 'লগইন ব্যর্থ হয়েছে।';
      if (msg.includes('Invalid login credentials')) {
        msg = 'ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে! দয়া করে সঠিক তথ্য দিন।';
      }
      setErrorMessage(msg);
      return;
    }

    if (result.isAdmin) {
      router.push('/admin');
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
              Sign In to SERVICING WORLD
            </h1>
            <p className="text-xs text-slate-500">
              Access your hardware orders, warranty certificates, and saved wishlist
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Dedicated Admin Portal Link */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">Store Manager or Admin?</span>
            </div>
            <Link
              href="/admin/login"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Admin Portal <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
