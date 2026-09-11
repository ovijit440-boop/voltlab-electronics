'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImageToImgBB } from '@/lib/upload';
import { Upload, X, CheckCircle2, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  className?: string;
}

export function ImageUploader({
  label = 'Product Image',
  value,
  onChange,
  required = false,
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP, etc.)');
      return;
    }

    // Size limit check (ImgBB allows up to 32MB)
    if (file.size > 32 * 1024 * 1024) {
      setUploadError('Image size exceeds 32MB limit');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadImageToImgBB(file);
      onChange(result.url);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image to ImgBB');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className={`space-y-2 text-xs ${className}`}>
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Switch to File Upload' : 'Paste Direct URL'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://i.ibb.co/..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />

          {value ? (
            /* Uploaded Preview Card */
            <div className="relative p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                  <Image src={value} alt="Uploaded Image" fill sizes="56px" className="object-contain p-1" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded to ImgBB
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs mt-0.5">
                    {value}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/60'
              }`}
            >
              {isUploading ? (
                <div className="space-y-2 py-2">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-white">Uploading to ImgBB API...</p>
                  <p className="text-[10px] text-slate-400">Hosting securely on ImgBB CDN</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Click to upload image or drag and drop
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      PNG, JPG, WEBP up to 32MB • Direct ImgBB API Storage
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400 font-medium mt-1">{uploadError}</p>
      )}
    </div>
  );
}
