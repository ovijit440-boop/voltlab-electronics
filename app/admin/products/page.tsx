'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Product, Category } from '@/types/ecommerce';
import { formatPrice } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Star,
  Zap,
  SlidersHorizontal,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Form / Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prods = await dbAdapter.getProducts();
    const cats = await dbAdapter.getCategories();
    setProducts(prods);
    setCategories(cats);
  };

  const handleOpenAddModal = () => {
    setEditingProduct({
      title: '',
      price: 49.99,
      discount_price: 39.99,
      stock: 25,
      min_stock_warning: 5,
      category: 'chargers',
      brand: 'Servicing World Pro',
      sku: `SW-${Math.floor(1000 + Math.random() * 9000)}`,
      short_description: 'Lab-tested electronic hardware.',
      description: 'Full oscilloscope and thermal camera benchmarked.',
      main_image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      gallery_images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'],
      youtube_video_id: 'dQw4w9WgXcQ',
      warranty_info: '1 Year Official Warranty',
      shipping_info: 'Dispatched in 24 hours with anti-static packaging.',
      return_info: '30-day money-back guarantee.',
      tags: ['gadget', 'tested', 'usb-c'],
      features: ['GaN III Technology', '140W Max Output', 'Digital Wattage Display'],
      specifications: [
        { key: 'Power Output', value: '140W Max' },
        { key: 'Dimensions', value: '102 x 74 x 34 mm' },
      ],
      is_published: true,
      is_featured: false,
      is_bestseller: false,
      is_new_arrival: true,
      is_on_sale: true,
    });
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditorOpen(true);
  };

  const handleDuplicateProduct = async (product: Product) => {
    const duplicated: Partial<Product> & { title: string; price: number } = {
      ...product,
      id: undefined,
      title: `${product.title} (Copy)`,
      sku: `${product.sku}-COPY-${Math.floor(100 + Math.random() * 900)}`,
      slug: undefined,
    };
    await dbAdapter.saveProduct(duplicated);
    await loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      await dbAdapter.deleteProduct(id);
      await loadData();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || editingProduct.price === undefined) return;

    await dbAdapter.saveProduct(editingProduct as any);
    setIsEditorOpen(false);
    setEditingProduct(null);
    await loadData();
  };

  const handleTogglePublish = async (product: Product) => {
    await dbAdapter.saveProduct({
      ...product,
      is_published: !product.is_published,
    });
    await loadData();
  };

  const handleToggleFeatured = async (product: Product) => {
    await dbAdapter.saveProduct({
      ...product,
      is_featured: !product.is_featured,
    });
    await loadData();
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Storefront Catalog
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Hardware Products Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {products.length} products • Add, edit pricing, specs, images, or YouTube demos
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Title, SKU, or Brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU / Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((p) => {
                const effectivePrice = p.discount_price ?? p.price;
                const isLowStock = p.stock > 0 && p.stock <= p.min_stock_warning;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Title & Image */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 p-1">
                          <Image
                            src={p.main_image}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white truncate">{p.title}</p>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {p.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU / Brand */}
                    <td className="p-4 font-mono text-slate-400">
                      <div>
                        <span className="text-white font-semibold">{p.sku}</span>
                        <p className="text-[10px] text-slate-500 font-sans">{p.brand}</p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="font-bold text-white">
                        {formatPrice(effectivePrice)}
                        {p.discount_price && (
                          <span className="text-[10px] text-slate-500 line-through block">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      {p.stock <= 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-900">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-900">
                          Low: {p.stock} units
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">{p.stock} in stock</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          p.is_published
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {p.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Badges */}
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1 rounded text-[10px] font-bold ${
                            p.is_featured
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-500 hover:text-white'
                          }`}
                          title="Toggle Featured"
                        >
                          Featured
                        </button>
                        {p.is_bestseller && (
                          <span className="p-1 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                            Top
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isEditorOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingProduct.id ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'chargers'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.brand || 'Servicing World Pro'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    YouTube Video ID (e.g. dQw4w9WgXcQ)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.youtube_video_id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, youtube_video_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Retail Price (৳) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Discount Price (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.discount_price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount_price: Number(e.target.value) || undefined })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    value={editingProduct.min_stock_warning ?? 5}
                    onChange={(e) => setEditingProduct({ ...editingProduct, min_stock_warning: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Main Product Image (Uploaded via ImgBB API) */}
              <ImageUploader
                label="Main Product Image (Direct ImgBB API Upload)"
                value={editingProduct.main_image || ''}
                onChange={(url) =>
                  setEditingProduct({
                    ...editingProduct,
                    main_image: url,
                    gallery_images: [url, ...(editingProduct.gallery_images || []).filter((g) => g !== url)],
                  })
                }
                required
              />

              {/* Short & Full Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingProduct.short_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Description & Benchmarks
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Checkboxes: Featured, Bestseller, Published */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_published ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_published: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Published on Store</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_bestseller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/25"
                >
                  Save Product to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
