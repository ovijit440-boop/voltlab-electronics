'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Product } from '@/types/ecommerce';
import { formatPrice } from '@/lib/utils';
import { Boxes, AlertTriangle, CheckCircle2, Search, Save, Plus, Minus } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const list = await dbAdapter.getProducts();
    setProducts(list);
    const initial: Record<string, number> = {};
    list.forEach((p) => {
      initial[p.id] = p.stock;
    });
    setStockEdits(initial);
  };

  const handleStockChange = (productId: string, val: number) => {
    setStockEdits((prev) => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = stockEdits[product.id] ?? product.stock;
    await dbAdapter.saveProduct({
      ...product,
      stock: newStock,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    await loadProducts();
  };

  const filtered = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.min_stock_warning).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Warehouse & Supply Chain
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock thresholds, restock adjustments, and anti-overselling guards.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 px-4 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Stock Updated!
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Tracked Items</p>
            <p className="text-2xl font-black text-white mt-1">
              {products.reduce((acc, p) => acc + p.stock, 0)} units
            </p>
          </div>
          <Boxes className="w-8 h-8 text-blue-500" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Low Stock Warnings</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{lowStockCount} SKUs</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Out of Stock</p>
            <p className="text-2xl font-black text-red-400 mt-1">{outOfStockCount} SKUs</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Title or SKU code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2.5"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Warning Limit</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Adjust & Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((prod) => {
                const isLow = prod.stock > 0 && prod.stock <= prod.min_stock_warning;
                const isOut = prod.stock <= 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 p-1">
                          <Image
                            src={prod.main_image}
                            alt={prod.title}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white truncate">{prod.title}</p>
                          <span className="text-[10px] text-slate-400">{prod.brand}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white">{prod.sku}</td>

                    <td className="p-4 text-slate-400">{prod.min_stock_warning} units</td>

                    <td className="p-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-900">
                          Out of Stock (0)
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-900">
                          Low Stock ({prod.stock})
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">{prod.stock} units</span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800 p-1">
                          <button
                            onClick={() =>
                              handleStockChange(prod.id, (stockEdits[prod.id] ?? prod.stock) - 1)
                            }
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={stockEdits[prod.id] ?? prod.stock}
                            onChange={(e) => handleStockChange(prod.id, Number(e.target.value))}
                            className="w-14 bg-transparent text-center font-bold text-white text-xs focus:outline-hidden"
                          />
                          <button
                            onClick={() =>
                              handleStockChange(prod.id, (stockEdits[prod.id] ?? prod.stock) + 1)
                            }
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleSaveStock(prod)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Save className="w-3 h-3" /> Save
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
    </div>
  );
}
