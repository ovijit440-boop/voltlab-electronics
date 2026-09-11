'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tv, Play, CheckCircle, ExternalLink, X, ShieldAlert } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  duration: string;
  description: string;
  youtubeId: string;
}

const FEATURED_VIDEOS: YouTubeVideo[] = [
  {
    id: 'vid-1',
    title: '৩২ খেলা ও ১৬ খেলার ডিজিটাল লকার মেশিন তৈরি ও টেস্টিং',
    views: '৪৫K ভিউজ',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    duration: '১২:৪৫',
    description: 'মরিচ বাতি খেলানোর ৩২ চ্যানেল ডিজিটাল লকার মেশিনের চ্যানেল ওয়্যারিং, মসফেট ড্রাইভার ও স্পিড টেস্টিং।',
    youtubeId: 'UCo60TsGBAlADhFamHpr4sJQ',
  },
  {
    id: 'vid-2',
    title: 'ইউনিভার্সাল এলইডি টিভি মাদারবোর্ড ফিটিং ও রেজোলিউশন সফটওয়্যার',
    views: '৬৮K ভিউজ',
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    duration: '১৪:২০',
    description: 'যেকোনো ডেড চায়না এলইডি টিভিতে T.V56 কম্বো মাদারবোর্ড প্রতিস্থাপন ও পেনড্রাইভ দিয়ে সফটওয়্যার সেটআপ।',
    youtubeId: 'UCo60TsGBAlADhFamHpr4sJQ',
  },
  {
    id: 'vid-3',
    title: 'ব্লেন্ডার মোটর রিপেয়ারিং ও ১০০% কপার কয়েল মোটর প্রতিস্থাপন',
    views: '৫২K ভিউজ',
    thumbnail: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    duration: '১০:১৫',
    description: 'ব্লেন্ডারের শব্দ, জ্যাম ও স্পার্কিং সমস্যা সমাধান করে নতুন ৭৫০ ওয়াট কপার মোটর ফিটিং প্রসেস।',
    youtubeId: 'UCo60TsGBAlADhFamHpr4sJQ',
  },
];

export function YouTubeSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="py-16 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest mb-1">
              <Tv className="w-4 h-4" />
              <span>Official YouTube Hardware Lab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Tested Live on Our YouTube Channel
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              We never sell blind white-label tech. Every product is benchmarked on an oscilloscope and thermal camera on video so you see actual performance.
            </p>
          </div>

          <a
            href="https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-102"
          >
            <Tv className="w-4 h-4" /> Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_VIDEOS.map((video) => (
            <div
              key={video.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-red-500/50 overflow-hidden shadow-lg group transition-all"
            >
              {/* Thumbnail with Play Button */}
              <div
                onClick={() => setActiveVideo(video.youtubeId)}
                className="relative aspect-video w-full cursor-pointer bg-slate-800 overflow-hidden"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>

              {/* Text info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-red-400 font-semibold">
                    <CheckCircle className="w-3 h-3" /> Hardware Verified
                  </span>
                  <span>{video.views}</span>
                </div>
                <h3
                  onClick={() => setActiveVideo(video.youtubeId)}
                  className="text-sm font-bold text-white line-clamp-2 cursor-pointer hover:text-red-400 transition-colors"
                >
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal Player */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-between p-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Tv className="w-4 h-4 text-red-500" /> Servicing World Hardware Benchmark Demo
                </span>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
