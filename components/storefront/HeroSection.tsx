import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Tv, ArrowRight, ShieldCheck, Cpu, BatteryCharging } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-16 lg:py-20 border-b border-slate-800">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* YouTube Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>TESTED & BENCHMARKED ON OUR YOUTUBE CHANNEL</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              ডিজিটাল লকার মেশিন, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">মরিচ বাতি</span> ও ইলেকট্রনিক্স পার্টস।
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              সার্ভিসিং ওয়ার্ল্ড ল্যাবে পরীক্ষিত ৩২ ও ১৬ খেলার মরিচ বাতির ডিজিটাল লকার মেশিন, ইউনিভার্সাল টিভি মাদারবোর্ড, ব্যাকলাইট টেস্টার ও ইলেকট্রনিক্স রিপেয়ারিং টুলস। সারা দেশে দ্রুত হোম ডেলিভারি।
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> ৩২ চ্যানেল ডিজিটাল চিপ
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> ১০০% পিওর কপার ওয়্যার
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ৬ মাসের সার্ভিস ওয়ারেন্টি
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-102"
              >
                সব পণ্য দেখুন <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Tv className="w-4 h-4 text-red-500" /> ইউটিউব ভিডিও দেখুন
              </a>
            </div>

            {/* Guarantee footnote */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> ল্যাব টেস্টেড পণ্য
              </span>
              <span>•</span>
              <span>২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি</span>
              <span>•</span>
              <span>ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl overflow-hidden group">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                বেস্ট সেলার
              </div>

              <div className="relative aspect-4/3 w-full bg-slate-900/80 rounded-2xl overflow-hidden mb-4 border border-slate-800/80">
                <Image
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                  alt="৩২ খেলার ডিজিটাল লকার মেশিন"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">সার্ভিসিং ওয়ার্ল্ড অরিজিনাল</span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    ● ইন স্টক (টেস্টেড)
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  ৩২ খেলার ডিজিটাল লকার মেশিন (32 Channel Morich Bati Chaser)
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  বিয়ে বাড়ি, পূজা ও যেকোনো ডেকোরেশন লাইটের জন্য ৩২টি চ্যানেলে অটোমেটিক রানিং ইফেক্ট।
                </p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">৳১,৬৫০</span>
                    <span className="text-xs text-slate-500 line-through ml-2">৳১,৮৫০</span>
                  </div>
                  <Link
                    href="/product/32-channel-digital-chaser-machine"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
