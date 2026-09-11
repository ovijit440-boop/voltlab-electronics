import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { dbAdapter } from '@/lib/store/db-adapter';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await dbAdapter.getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Category Not Found | SERVICING WORLD' };
  }

  return {
    title: `${category.name} | SERVICING WORLD`,
    description: category.description || `Browse oscilloscope-tested ${category.name} at SERVICING WORLD.`,
    openGraph: {
      title: category.name,
      description: category.description,
      images: [{ url: category.image_url }],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await dbAdapter.getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products = await dbAdapter.getProducts();
  const categoryProducts = products.filter((p) => p.category === slug);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/shop"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Hardware Categories
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {category.description}
            </p>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
              <Zap className="w-12 h-12 text-slate-400 mx-auto" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No products found in this category
              </h2>
              <p className="text-xs text-slate-500">Check back soon as new benchmarked items are stocked.</p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Browse All Hardware
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
