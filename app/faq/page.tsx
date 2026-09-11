import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { HelpCircle, ShieldCheck, Zap, Truck, RotateCcw } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How do I know Servicing World products are genuine and properly rated?',
      a: 'Every single SKU in our catalog is benchmarked using calibrated electronic DC loads, digital oscilloscopes, and thermal imaging cameras in our YouTube hardware laboratory. We verify true wattage curves and reject any items that do not meet strict thermal safety margins.',
    },
    {
      q: 'What does your 1-Year Official Warranty cover?',
      a: 'Our warranty provides full replacement for manufacturing defects, failed GaN chips, internal MOSFET breakdowns, and battery cell degradation beyond normal wear. Contact us via our support page or email support@servicingworld.com with your order number to initiate an immediate warranty claim.',
    },
    {
      q: 'Can I use the 140W GaN Desktop Charger with smaller devices?',
      a: 'Yes! Modern USB Power Delivery (PD 3.1) features intelligent protocol handshakes. The charger communicates with your device and delivers only the maximum safe voltage and amperage requested (e.g. 20W for iPhone, 65W for iPad, or 140W for MacBook Pro).',
    },
    {
      q: 'Are your high-capacity power banks airline safe?',
      a: 'Yes. Our 25,000mAh Titan Power Bank is rated at 92.5Wh, which is strictly below the 100Wh limit set by FAA and TSA international aviation authorities for carry-on electronics.',
    },
    {
      q: 'How fast do you dispatch hardware orders?',
      a: 'Orders confirmed before 2:00 PM EST are packaged in anti-static ESD shielding and dispatched via priority courier on the same business day. Tracking information is automatically provided via email.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day trial period. If you are not satisfied with the performance or build quality of any product, return it in original packaging for a 100% refund with zero restocking fees.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-900">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hardware FAQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding our oscilloscope benchmarking, warranty coverage, and shipping protocols.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
