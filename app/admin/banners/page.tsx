'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Banner } from '@/types/ecommerce';
import { Image as ImageIcon, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Explore Gear');
  const [ctaUrl, setCtaUrl] = useState('/shop');

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const list = await dbAdapter.getBanners();
    setBanners(list);
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    await dbAdapter.saveBanner({
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      image_url: imageUrl.trim(),
      cta_text: ctaText.trim(),
      cta_url: ctaUrl.trim(),
      display_order: banners.length + 1,
      is_active: true,
    });

    setIsModalOpen(false);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    await loadBanners();
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Delete this banner?')) {
      await dbAdapter.deleteBanner(id);
      await loadBanners();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Storefront Merchandising
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Homepage Banners & Hero Showcase
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update hero promotions and CTA links without touching code.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Promo Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((ban) => (
          <div
            key={ban.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs space-y-4 p-5"
          >
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <Image src={ban.image_url} alt={ban.title} fill sizes="400px" className="object-cover" />
              {ban.badge && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {ban.badge}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{ban.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ban.subtitle}</p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-blue-400 font-bold">
                CTA: &quot;{ban.cta_text}&quot; → {ban.cta_url}
              </span>
              <button
                onClick={() => handleDeleteBanner(ban.id)}
                className="text-slate-500 hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" /> Add Homepage Banner
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 140W GaN Fast Chargers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Real-time digital power display and PD 3.1"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. BENCHMARK VERIFIED"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase"
                />
              </div>

              <ImageUploader
                label="Banner Graphic (Direct ImgBB Upload)"
                value={imageUrl}
                onChange={setImageUrl}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target URL</label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
