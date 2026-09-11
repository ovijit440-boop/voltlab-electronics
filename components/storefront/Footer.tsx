import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Tv,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top Value Badges */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Free delivery on ৳2,000+ orders</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">1-Year Warranty</h4>
                <p className="text-xs text-slate-400 mt-0.5">Tested & benchmarked gear</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">30-Day Money Back</h4>
                <p className="text-xs text-slate-400 mt-0.5">No-hassle returns guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Hardware Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dedicated electronics engineers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shrink-0">
                <Image
                  src="/logo.png"
                  alt="SERVICING WORLD"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                SERVICING <span className="text-blue-400">WORLD</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              সার্ভিসিং ওয়ার্ল্ড (Servicing World) - ইউটিউব চ্যানেল ইন্সপায়ার্ড ইলেকট্রনিক্স স্টোর ও হার্ডওয়্যার ল্যাব। বিয়ে বাড়ি ও পূজার ডেকোরেশনের ৩২/১৬ খেলার ডিজিটাল লকার মেশিন, মরিচ বাতি, এলইডি টিভি মাদারবোর্ড, ব্যাকলাইট টেস্টার, ব্লেন্ডার মোটর এবং ইলেকট্রনিক্স রিপেয়ারিং পার্টস এর বিশ্বস্ত প্রতিষ্ঠান।
            </p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" /> হারতা বাজার, গার্লস স্কুল রোড, উজিরপুর, বরিশাল, বাংলাদেশ
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" /> +880 1785-958427 (ইমো/হোয়াটসঅ্যাপ)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" /> support@servicingworld.com
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">ক্যাটাগরি সমূহ</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/shop?category=chaser-machine" className="hover:text-white transition-colors">
                  লকার মেশিন ও কন্ট্রোলার
                </Link>
              </li>
              <li>
                <Link href="/shop?category=morich-bati" className="hover:text-white transition-colors">
                  মরিচ বাতি ও লাইটিং
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tv-parts" className="hover:text-white transition-colors">
                  টিভি রিপেয়ারিং পার্টস
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tools" className="hover:text-white transition-colors">
                  সার্ভিসিং ও সোল্ডারিং টুলস
                </Link>
              </li>
              <li>
                <Link href="/shop?category=blender-parts" className="hover:text-white transition-colors">
                  ব্লেন্ডার মোটর ও পার্টস
                </Link>
              </li>
              <li>
                <Link href="/shop?category=audio-amp" className="hover:text-white transition-colors">
                  অডিও অ্যামপ্লিফায়ার বোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  30-Day Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Hardware Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* YouTube Brand & Newsletter */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">YouTube Channel</h3>
            <p className="text-xs text-slate-400 mb-3">
              Watch teardowns, circuit testing, and GaN efficiency benchmarks on our official channel.
            </p>
            <a
              href="https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20"
            >
              <Tv className="w-4 h-4" /> Watch on YouTube
            </a>

            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-300 mb-2">Subscribe to Tech Alerts</p>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-blue-500 w-full"
                />
                <button
                  type="button"
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SERVICING WORLD. All rights reserved. Designed for makers & engineers in Bangladesh.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Encrypted SSL</span>
            <span>•</span>
            <span>Visa / Mastercard / COD</span>
            <span>•</span>
            <span>RoHS & CE Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
