import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { Zap, Tv, Cpu, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-900">
              <Zap className="w-3.5 h-3.5" />
              <span>The Hardware Story</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              From YouTube Teardowns to Real Electronics Engineering
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              SERVICING WORLD was founded by hardware enthusiasts who grew frustrated by misleading wattage claims, overheated chargers, and fake power bank ratings.
            </p>
          </div>

          {/* Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Electronics hardware lab testing"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Every Product is Oscilloscope & Thermal Camera Tested
              </h2>
              <p>
                Our YouTube channel is our laboratory diary. We take apart commercial electronics, inspect solder joints, test thermal throttling curves, and measure ripple voltage under 100% continuous load.
              </p>
              <p>
                The products in this store are the ones that passed our brutal testing protocols with flying colors. If an item cannot sustain its advertised power without dangerous heat buildup, we simply do not sell it.
              </p>

              <div className="pt-2 space-y-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>True GaN III semiconductor chips for cooler operation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% certified Grade-A battery cells with safety protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>1-Year direct replacement warranty backed by our engineers</span>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube CTA card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                <Tv className="w-4 h-4" /> YouTube Channel
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Watch Our Teardowns and Circuit Benchmarks
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Subscribe for weekly videos covering high-power USB-C PD testing, power bank safety, and multimeter comparisons.
              </p>
            </div>
            <a
              href="https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 shrink-0"
            >
              Visit Channel <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
