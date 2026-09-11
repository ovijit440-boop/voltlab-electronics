import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/ecommerce';
import { Zap, BatteryCharging, Headphones, Cable, Wrench, Cpu, ArrowRight } from 'lucide-react';

interface CategoryCardsProps {
  categories: Category[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-5 h-5 text-blue-500" />,
  BatteryCharging: <BatteryCharging className="w-5 h-5 text-emerald-500" />,
  Headphones: <Headphones className="w-5 h-5 text-purple-500" />,
  Cable: <Cable className="w-5 h-5 text-amber-500" />,
  Wrench: <Wrench className="w-5 h-5 text-orange-500" />,
  Cpu: <Cpu className="w-5 h-5 text-cyan-500" />,
};

export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Hardware Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View All Hardware <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : <Zap className="w-5 h-5 text-blue-500" />}
              </div>

              <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800/40 rounded-xl overflow-hidden mb-3">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {cat.product_count ?? 4}+ items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
