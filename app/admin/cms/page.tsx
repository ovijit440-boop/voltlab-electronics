'use client';

import React, { useState, useEffect } from 'react';
import { dbAdapter } from '@/lib/store/db-adapter';
import { CMSPage, FAQItem, ContactMessage } from '@/types/ecommerce';
import {
  FileText,
  HelpCircle,
  Mail,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  Clock,
  Eye,
  X,
} from 'lucide-react';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'faqs' | 'messages'>('pages');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('privacy');
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Hardware & Testing');
  const [faqOrder, setFaqOrder] = useState(1);
  const [faqPublished, setFaqPublished] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [pageList, faqList, msgList] = await Promise.all([
      dbAdapter.getCmsPages(),
      dbAdapter.getFaqs(),
      dbAdapter.getContactMessages(),
    ]);
    setPages(pageList);
    setFaqs(faqList);
    setMessages(msgList);

    if (pageList.length > 0) {
      const current = pageList.find((p) => p.slug === selectedPageSlug) || pageList[0];
      setSelectedPageSlug(current.slug);
      setPageTitle(current.title);
      setPageContent(current.content);
    }
  };

  const handleSelectPage = (slug: string) => {
    setSelectedPageSlug(slug);
    const p = pages.find((page) => page.slug === slug);
    if (p) {
      setPageTitle(p.title);
      setPageContent(p.content);
      setSaveSuccess(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    const existing = pages.find((p) => p.slug === selectedPageSlug);
    if (!existing) return;

    await dbAdapter.saveCmsPage({
      ...existing,
      title: pageTitle.trim(),
      content: pageContent.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    await loadAll();
  };

  // FAQ Management
  const openNewFaq = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('Hardware & Testing');
    setFaqOrder(faqs.length + 1);
    setFaqPublished(true);
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FAQItem) => {
    setEditingFaqId(f.id);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category || 'General');
    setFaqOrder(f.display_order);
    setFaqPublished(f.is_published);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    await dbAdapter.saveFaq({
      id: editingFaqId || undefined,
      question: faqQuestion.trim(),
      answer: faqAnswer.trim(),
      category: faqCategory.trim(),
      display_order: Number(faqOrder),
      is_published: faqPublished,
    });

    setIsFaqModalOpen(false);
    await loadAll();
  };

  const handleDeleteFaq = async (id: string) => {
    if (confirm('Delete this FAQ entry?')) {
      await dbAdapter.deleteFaq(id);
      await loadAll();
    }
  };

  // Messages
  const handleMarkRead = async (id: string) => {
    await dbAdapter.markMessageRead(id);
    await loadAll();
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Delete this message?')) {
      await dbAdapter.deleteContactMessage(id);
      await loadAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500" />
            Content Management (CMS)
          </h1>
          <p className="text-sm text-slate-400">
            Control static storefront policy pages, technical FAQs, and customer support inquiries
          </p>
        </div>

        {activeTab === 'faqs' && (
          <button
            onClick={openNewFaq}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add FAQ Item
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'pages'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Storefront Policy Pages
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'faqs'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Hardware FAQs ({faqs.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'messages'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          Contact Inquiries ({messages.length})
        </button>
      </div>

      {/* TAB 1: STORE PAGES EDITOR */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page Selector Sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Page to Edit
            </h3>
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPage(p.slug)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  selectedPageSlug === p.slug
                    ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm">{p.title}</div>
                  <div className="text-xs font-mono text-slate-500">/{p.slug}</div>
                </div>
                <Edit2 className="w-4 h-4 shrink-0 opacity-60" />
              </button>
            ))}
          </div>

          {/* Editor Form */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSavePage} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Edit: /{selectedPageSlug}</h2>
                  <p className="text-xs text-slate-400">
                    Live changes immediately update the customer-facing policy pages
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-pulse">
                      <CheckCircle2 className="w-4 h-4" /> Changes Saved!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Page
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Page Content / Markdown
                </label>
                <textarea
                  rows={14}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm leading-relaxed focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {f.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Order: #{f.display_order}</span>
                  {!f.is_published && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500/10 text-rose-400">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-base">{f.question}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{f.answer}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditFaq(f)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(f.id)}
                  className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CONTACT INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" />
              <p className="text-base font-medium">No contact inquiries received yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Messages submitted by visitors through the /contact page will appear here.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all flex flex-col justify-between ${
                  m.is_read ? 'border-slate-800' : 'border-blue-500/50 bg-blue-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-base">{m.name}</span>
                      <span className="text-xs text-slate-400">&lt;{m.email}&gt;</span>
                      {!m.is_read && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-blue-400">{m.subject}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!m.is_read && (
                      <button
                        onClick={() => handleMarkRead(m.id)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 mb-3">
                  {m.message}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Phone: {m.phone || 'N/A'}</span>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                {editingFaqId ? 'Edit Hardware FAQ' : 'Add New FAQ'}
              </h2>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hardware & Testing, Shipping, Warranty"
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do I verify true charging wattage?"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide a clear, technical, helpful answer..."
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={faqOrder}
                    onChange={(e) => setFaqOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="faqPub"
                    checked={faqPublished}
                    onChange={(e) => setFaqPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="faqPub" className="text-sm text-slate-200 cursor-pointer">
                    Published
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
                >
                  {editingFaqId ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
