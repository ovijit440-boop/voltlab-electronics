import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { dbAdapter } from '@/lib/store/db-adapter';
import { ProductDetailsClient } from './ProductDetailsClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbAdapter.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | SERVICING WORLD',
    };
  }

  return {
    title: `${product.seo_title || product.title} | SERVICING WORLD`,
    description: product.seo_description || product.short_description,
    keywords: product.tags,
    openGraph: {
      title: product.title,
      description: product.short_description,
      images: [{ url: product.main_image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await dbAdapter.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await dbAdapter.getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const reviews = await dbAdapter.getReviews(product.id);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: [product.main_image, ...product.gallery_images],
    description: product.short_description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://servicingworld.com/product/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.discount_price ?? product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.average_rating,
      reviewCount: Math.max(1, product.review_count),
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-white dark:bg-slate-950 py-8 border-b border-slate-200 dark:border-slate-800">
        <ProductDetailsClient
          product={product}
          relatedProducts={relatedProducts}
          initialReviews={reviews}
        />
      </main>
      <Footer />
    </div>
  );
}
