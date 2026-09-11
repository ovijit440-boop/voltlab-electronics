'use client';

import React, { useState, useEffect } from 'react';
import { dbAdapter } from '@/lib/store/db-adapter';
import { SiteSettings } from '@/types/ecommerce';
import { Settings, Save, CheckCircle2, Tv, Globe, Shield, DollarSign, Database, Cloud, RefreshCw, AlertCircle, Megaphone } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    dbAdapter.getSettings().then(setSettings);
  }, []);

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await dbAdapter.syncAllToSupabase();
      setSyncResult(res);
    } catch (err: any) {
      setSyncResult({ success: false, message: err?.message || 'Sync failed' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await dbAdapter.updateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            System & Brand Configuration
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Storefront Settings & Integration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your brand identity, YouTube channel connection, currency, and delivery parameters.
          </p>
        </div>

        {isSaved && (
          <div className="p-2 px-4 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Settings Updated!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Brand & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Laboratory / Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <ImageUploader
                label="Storefront Brand Logo (Uploaded via ImgBB)"
                value={settings.logo_url || ''}
                onChange={(url) => setSettings({ ...settings, logo_url: url })}
              />
            </div>
          </div>
        </div>

        {/* YouTube Channel Integration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Tv className="w-4 h-4 text-red-500" /> YouTube Channel Integration
          </h2>
          <p className="text-xs text-slate-400">
            Connected to your electronics video teardown & bench testing channel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.youtube_channel_url}
                onChange={(e) => setSettings({ ...settings, youtube_channel_url: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Channel Display Name</label>
              <input
                type="text"
                value={settings.youtube_channel_name}
                onChange={(e) => setSettings({ ...settings, youtube_channel_name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Bar Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-400" /> Top Announcement Bar (শীর্ষ অফার ও নোটিফিকেশন বার)
            </h2>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.is_announcement_active ?? true}
                onChange={(e) => setSettings({ ...settings, is_announcement_active: e.target.checked })}
                className="rounded text-blue-600 w-4 h-4"
              />
              <span>বারটি সক্রিয় রাখুন (Show on Website)</span>
            </label>
          </div>
          <p className="text-xs text-slate-400">
            ওয়েবসাইটের একদম উপরে যে নোটিফিকেশন বা অফার ব্যানারটি দেখায়, সেটি এখান থেকে সরাসরি Edit করতে পারবেন অথবা আনচেক করে বন্ধ (Delete / Hide) করে রাখতে পারবেন।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-300 mb-1">Badge (ট্যাগ বা ব্যাজ)</label>
              <input
                type="text"
                placeholder="e.g. LAB TESTED, অফার, হট ডিল"
                value={settings.announcement_badge ?? ''}
                onChange={(e) => setSettings({ ...settings, announcement_badge: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-300 mb-1">Announcement Message (অফার বা নোটিশের লেখা)</label>
              <input
                type="text"
                placeholder="e.g. ⚡ সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি (৳২,০০০ এর অর্ডারে ফ্রি ডেলিভারি)! প্রোমোকোড: WELCOME10"
                value={settings.announcement_text ?? ''}
                onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Commerce, Shipping & Maintenance */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Financial & Shipping Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-center font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Free Shipping Min (৳)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.is_maintenance_mode}
                onChange={(e) => setSettings({ ...settings, is_maintenance_mode: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Enable Storefront Maintenance Mode</span>
            </label>
          </div>
        </div>

        {/* Database & Cloud Integration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" /> Database & Cloud Architecture
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real database storage synchronization, PostgreSQL schema status, and image CDN pipeline
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncDatabase}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing with Supabase...' : 'Sync Data with Supabase'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Supabase Status Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" /> Supabase PostgreSQL
                </span>
                {isSupabaseConfigured() ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Connected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Local Persistent Engine Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isSupabaseConfigured()
                  ? 'Your Supabase project URL and anon key are connected. Products, categories, and orders are mirrored directly to Postgres.'
                  : 'All demo data, categories, and products are stored in persistent local database storage. Run the complete SQL migration in supabase/complete_database.sql to connect your live Supabase cloud database.'}
              </p>
            </div>

            {/* ImgBB Status Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-blue-400" /> ImgBB Image CDN API
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  API Key Active
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Key: 7a72f02b65e930275334abe25b3c27d0 (Active)
              </p>
              <p className="text-xs text-slate-500">
                All banner images, category icons, store logo, and product photos upload automatically to ImgBB CDN with instant permanent URLs.
              </p>
            </div>
          </div>

          {syncResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                syncResult.success
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300'
              }`}
            >
              {syncResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              )}
              <span>{syncResult.message}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
