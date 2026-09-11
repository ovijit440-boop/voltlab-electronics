'use client';

import React, { useState, useEffect } from 'react';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Review } from '@/types/ecommerce';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2, Check } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const list = await dbAdapter.getReviews();
    setReviews(list);
  };

  const handleToggleApprove = async (review: Review) => {
    await dbAdapter.toggleReviewApproval(review.id, !review.is_approved);
    await loadReviews();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review permanently?')) {
      await dbAdapter.deleteReview(id);
      await loadReviews();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Customer Feedback Moderation
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
          Hardware Reviews Moderation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review verified buyer ratings, approve or hide comments across product pages.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-800">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-white">{rev.customer_name}</span>
                  {rev.is_verified_purchase && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900">
                      ✓ Verified Buyer
                    </span>
                  )}
                  <span className="text-xs text-slate-500">{formatDate(rev.created_at)}</span>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400' : 'fill-slate-700 text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {rev.title && <p className="text-xs font-bold text-white">{rev.title}</p>}
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleApprove(rev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    rev.is_approved
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {rev.is_approved ? 'Approved' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
