'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Database,
  HelpCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Store,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading, loginWithSupabase, signUpWithSupabase, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // If already logged in as Admin, redirect straight to /admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.replace('/admin');
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('দয়া করে ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'login') {
      const result = await loginWithSupabase(email, password);
      setIsSubmitting(false);

      if (!result.success) {
        let msg = result.error || 'লগইন ব্যর্থ হয়েছে।';
        if (msg.includes('Invalid login credentials')) {
          msg = 'ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে! দয়া করে সঠিক তথ্য দিন।';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। Supabase থেকে ইমেইল কনফার্মেশন চেক করুন অথবা Disable Confirm Email করুন।';
        }
        setErrorMessage(msg);
        return;
      }

      if (!result.isAdmin) {
        setErrorMessage(
          'আপনার Supabase লগইন সফল হয়েছে, কিন্তু এই অ্যাকাউন্টে Admin অনুমতি (role: "admin") নেই! নিচে দেওয়া গাইড অনুযায়ী Supabase-এ এই ইমেইলকে Admin বানান।'
        );
        return;
      }

      // Success & Admin verified!
      router.replace('/admin');
    } else {
      // Register new Admin mode
      const result = await signUpWithSupabase(email, password, fullName || 'Store Admin', true);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।');
        return;
      }

      if (result.needEmailVerification) {
        setSuccessMessage(
          'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! যদি Supabase-এ Email Confirmation চালু থাকে, তবে আপনার ইনবক্স চেক করুন অথবা Supabase ড্যাশবোর্ডে গিয়ে User Confirm করুন।'
        );
      } else {
        setSuccessMessage('এডমিন অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন ট্যাবে গিয়ে লগইন করুন।');
        setMode('login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-black border border-slate-800 shadow-xl shadow-blue-500/10">
            <NextImage
              src="/logo.png"
              alt="SERVICING WORLD"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              SERVICING <span className="text-blue-500">WORLD</span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">
              Secure Admin Control Portal
            </p>
          </div>
        </div>

        {/* Current status if user is logged in as a normal customer */}
        {user && !isAdmin && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>নন-এডমিন ইউজার হিসেবে লগইন আছেন</span>
            </div>
            <p className="text-slate-300">
              আপনি বর্তমানে <span className="font-mono text-amber-300">{user.email}</span> হিসেবে লগইন আছেন, যার রোল{' '}
              <span className="font-semibold text-white">'{user.role}'</span>। এডমিন প্যানেল দেখতে হলে Supabase Admin অ্যাকাউন্টে লগইন করতে হবে।
            </p>
            <button
              onClick={() => logout()}
              className="mt-1 text-xs font-bold text-red-400 hover:text-red-300 underline block"
            >
              লগআউট করে নতুন অ্যাকাউন্টে ঢুকুন →
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> এডমিন লগইন
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> নতুন এডমিন সাইন-আপ
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">অ্যাক্সেস অনুমোদিত নয়</p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">এডমিনের নাম (Full Name)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ovijit Admin"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Supabase ইমেইল এড্রেস (Admin Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@servicingworld.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">পাসওয়ার্ড (Password)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <Shield className="w-4 h-4" /> Supabase দিয়ে লগইন করুন
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> নতুন এডমিন একাউন্ট তৈরি করুন
                </>
              )}
            </button>
          </form>

          {/* Toggle SQL & Setup Guide */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-blue-400 py-1 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" /> Supabase-এ কীভাবে Admin অনুমতি দিবেন?
              </span>
              <span>{showSqlGuide ? '▲ বন্ধ করুন' : '▼ দেখুন'}</span>
            </button>

            {showSqlGuide && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] space-y-2.5 text-slate-300">
                <p className="font-bold text-white">Supabase ড্যাশবোর্ডে করার উপায়:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
                  <li>Supabase ড্যাশবোর্ডে যান: <span className="font-mono text-blue-400">Authentication &gt; Users</span></li>
                  <li>আপনার ইউজার ইমেইল সিলেক্ট করুন অথবা নতুন ইউজার তৈরি করুন।</li>
                  <li>User Metadata-তে লিখুন: <code className="text-emerald-400 font-mono">&#123;&quot;role&quot;: &quot;admin&quot;&#125;</code></li>
                </ol>

                <p className="font-bold text-white pt-2 border-t border-slate-800">
                  অথবা Supabase SQL Editor-এ রান করার কোড:
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-300 overflow-x-auto select-all">
                  {`UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"admin"')
WHERE email = 'YOUR_EMAIL@gmail.com';`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to storefront link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" /> স্টোরফ্রন্টে ফিরে যান (Back to Storefront)
          </Link>
        </div>
      </div>
    </div>
  );
}
