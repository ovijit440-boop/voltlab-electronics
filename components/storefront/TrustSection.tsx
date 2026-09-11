import React from 'react';
import { Cpu, ShieldCheck, Wrench, Truck } from 'lucide-react';

export function TrustSection() {
  const points = [
    {
      icon: <Cpu className="w-7 h-7 text-blue-500" />,
      title: 'Lab Benchmarked Hardware',
      description: 'Tested on thermal cameras, oscilloscopes, and load testers before being stocked.',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-500" />,
      title: '1-Year Official Warranty',
      description: 'Zero hassle replacement coverage on internal circuits, MOSFETs, and battery cells.',
    },
    {
      icon: <Wrench className="w-7 h-7 text-amber-500" />,
      title: 'Real Engineer Support',
      description: 'Got wattage questions? Our electrical tech team answers hardware tickets directly.',
    },
    {
      icon: <Truck className="w-7 h-7 text-purple-500" />,
      title: 'ESD Anti-Static Dispatch',
      description: 'Ships in sealed anti-static protective pouches within 24 hours of order placement.',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Engineered For Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Why Hardware Enthusiasts Trust Servicing World
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
