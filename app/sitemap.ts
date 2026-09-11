import { MetadataRoute } from 'next';
import { dbAdapter } from '@/lib/store/db-adapter';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://servicingworld.com';

  const products = await dbAdapter.getProducts();
  const categories = await dbAdapter.getCategories();

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    '',
    '/shop',
    '/deals',
    '/track-order',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/shipping-policy',
    '/return-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
