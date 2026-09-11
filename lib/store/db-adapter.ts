import {
  Product,
  Category,
  Brand,
  Order,
  Review,
  Coupon,
  SiteSettings,
  Banner,
  OrderStatus,
  PaymentStatus,
  FAQItem,
  CMSPage,
  ContactMessage,
  UserProfile,
} from '@/types/ecommerce';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
  INITIAL_CUSTOMERS,
  INITIAL_FAQS,
  INITIAL_CMS_PAGES,
} from './demo-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

// In-memory / localStorage storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'servicingworld_v3_products',
  CATEGORIES: 'servicingworld_v3_categories',
  BRANDS: 'servicingworld_v3_brands',
  ORDERS: 'servicingworld_v3_orders',
  REVIEWS: 'servicingworld_v3_reviews',
  COUPONS: 'servicingworld_v3_coupons',
  SETTINGS: 'servicingworld_v3_settings',
  BANNERS: 'servicingworld_v3_banners',
  CUSTOMERS: 'servicingworld_v3_customers',
  FAQS: 'servicingworld_v3_faqs',
  CMS: 'servicingworld_v3_cms',
  MESSAGES: 'servicingworld_v3_messages',
};

// Helper for client-side storage persistence
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist ${key}`, err);
  }
}

export const dbAdapter = {
  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          const supabaseProducts = data.map((item: any) => ({
            id: String(item.id),
            title: item.title || item.name || 'Untitled Product',
            slug: item.slug || String(item.id),
            sku: item.sku || `SW-${String(item.id).slice(0, 6)}`,
            short_description: item.short_description || item.description?.slice(0, 120) || '',
            description: item.description || '',
            price: Number(item.price || 0),
            discount_price: item.discount_price ? Number(item.discount_price) : undefined,
            stock: Number(item.stock ?? 10),
            min_stock_warning: Number(item.min_stock_warning ?? 3),
            category: item.category || item.category_id || 'chaser-machine',
            brand: item.brand || 'Servicing World',
            main_image: item.main_image || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            gallery_images: item.gallery_images || (Array.isArray(item.images) ? item.images : []),
            video_url: item.video_url || '',
            youtube_video_id: item.youtube_video_id || '',
            warranty_info: item.warranty_info || '৬ মাসের সার্ভিসিং ওয়ারেন্টি',
            shipping_info: item.shipping_info || 'সারাদেশে ক্যাশ অন ডেলিভারি',
            return_info: item.return_info || '৭ দিনের রিপ্লেসমেন্ট সুবিধা',
            tags: item.tags || [],
            features: item.features || [],
            specifications: item.specifications || [],
            is_published: item.is_published ?? item.is_active ?? true,
            is_featured: item.is_featured ?? false,
            is_bestseller: item.is_bestseller ?? false,
            is_new_arrival: item.is_new_arrival ?? false,
            is_on_sale: item.is_on_sale ?? Boolean(item.discount_price),
            average_rating: Number(item.average_rating || 4.8),
            review_count: Number(item.review_count || 12),
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
          })) as Product[];

          // Merge with initial YouTube catalog to guarantee complete presentation
          const existingSlugs = new Set(supabaseProducts.map((p) => p.slug));
          const merged = [...supabaseProducts];
          for (const initProd of INITIAL_PRODUCTS) {
            if (!existingSlugs.has(initProd.slug)) {
              merged.push(initProd);
            }
          }
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getProducts fallback to local:', err);
      }
    }
    return getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async saveProduct(product: Partial<Product> & { title: string; price: number }): Promise<Product> {
    const products = await this.getProducts();
    const existingIndex = product.id ? products.findIndex((p) => p.id === product.id) : -1;

    const baseProduct: Product = {
      id: product.id || `prod-${Date.now()}`,
      title: product.title,
      slug:
        product.slug ||
        product.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      sku: product.sku || `SW-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      short_description: product.short_description || '',
      description: product.description || '',
      price: Number(product.price),
      discount_price: product.discount_price ? Number(product.discount_price) : undefined,
      stock: Number(product.stock ?? 10),
      min_stock_warning: Number(product.min_stock_warning ?? 5),
      category: product.category || 'chargers',
      brand: product.brand || 'Servicing World Pro',
      main_image:
        product.main_image ||
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      gallery_images: product.gallery_images || [product.main_image || ''],
      video_url: product.video_url || '',
      youtube_video_id: product.youtube_video_id || '',
      warranty_info: product.warranty_info || '1 Year Official Warranty',
      shipping_info: product.shipping_info || 'Dispatched within 24 hours.',
      return_info: product.return_info || '30-day money-back guarantee.',
      tags: product.tags || [],
      features: product.features || [],
      specifications: product.specifications || [],
      is_published: product.is_published ?? true,
      is_featured: product.is_featured ?? false,
      is_bestseller: product.is_bestseller ?? false,
      is_new_arrival: product.is_new_arrival ?? true,
      is_on_sale: product.is_on_sale ?? Boolean(product.discount_price),
      average_rating: product.average_rating || 5.0,
      review_count: product.review_count || 0,
      seo_title: product.seo_title || product.title,
      seo_description: product.seo_description || product.short_description,
      seo_keywords: product.seo_keywords || '',
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let updatedList: Product[];
    if (existingIndex >= 0) {
      updatedList = [...products];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...baseProduct };
    } else {
      updatedList = [baseProduct, ...products];
    }

    setStorageItem(STORAGE_KEYS.PRODUCTS, updatedList);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').upsert(baseProduct);
      } catch (e) {
        console.warn('Supabase upsert product error:', e);
      }
    }

    return baseProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    setStorageItem(STORAGE_KEYS.PRODUCTS, filtered);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete product error:', e);
      }
    }
    return true;
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data && data.length > 0) {
          const supabaseCats = data.map((cat: any, index: number) => ({
            id: String(cat.id),
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
            description: cat.description || '',
            image_url:
              cat.image_url ||
              'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
            icon: cat.icon || (index === 0 ? 'Cpu' : index === 1 ? 'Sparkles' : index === 2 ? 'Tv' : index === 3 ? 'Wrench' : 'Layers'),
            is_featured: cat.is_featured ?? true,
            display_order: cat.display_order ?? index + 1,
            product_count: cat.product_count ?? 0,
          })) as Category[];

          // Merge with initial YouTube categories
          const existingSlugs = new Set(supabaseCats.map((c) => c.slug));
          const merged = [...supabaseCats];
          for (const initCat of INITIAL_CATEGORIES) {
            if (!existingSlugs.has(initCat.slug)) {
              merged.push(initCat);
            }
          }
          return merged;
        }
      } catch (e) {
        console.warn('Supabase getCategories fallback to local:', e);
      }
    }
    return getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
    const categories = await this.getCategories();
    const existingIndex = category.id ? categories.findIndex((c) => c.id === category.id) : -1;

    const baseCategory: Category = {
      id: category.id || `cat-${Date.now()}`,
      name: category.name,
      slug:
        category.slug ||
        category.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      description: category.description || '',
      image_url:
        category.image_url ||
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
      icon: category.icon || 'Zap',
      is_featured: category.is_featured ?? true,
      display_order: category.display_order ?? categories.length + 1,
      product_count: category.product_count ?? 0,
    };

    let updated: Category[];
    if (existingIndex >= 0) {
      updated = [...categories];
      updated[existingIndex] = { ...updated[existingIndex], ...baseCategory };
    } else {
      updated = [...categories, baseCategory];
    }

    setStorageItem(STORAGE_KEYS.CATEGORIES, updated);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').upsert(baseCategory);
      } catch (e) {
        console.warn('Supabase saveCategory error:', e);
      }
    }
    return baseCategory;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    setStorageItem(
      STORAGE_KEYS.CATEGORIES,
      categories.filter((c) => c.id !== id)
    );
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteCategory error:', e);
      }
    }
    return true;
  },

  // --- BRANDS ---
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('brands').select('*').order('name', { ascending: true });
        if (!error && data && data.length > 0) return data as Brand[];
      } catch (e) {
        console.warn('Supabase getBrands fallback to local:', e);
      }
    }
    return getStorageItem<Brand[]>(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
  },

  async saveBrand(brand: Partial<Brand> & { name: string }): Promise<Brand> {
    const brands = await this.getBrands();
    const existingIndex = brand.id ? brands.findIndex((b) => b.id === brand.id) : -1;

    const baseBrand: Brand = {
      id: brand.id || `brand-${Date.now()}`,
      name: brand.name,
      slug:
        brand.slug ||
        brand.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      logo_url: brand.logo_url || '',
      description: brand.description || '',
      is_featured: brand.is_featured ?? true,
    };

    let updated: Brand[];
    if (existingIndex >= 0) {
      updated = [...brands];
      updated[existingIndex] = { ...updated[existingIndex], ...baseBrand };
    } else {
      updated = [...brands, baseBrand];
    }

    setStorageItem(STORAGE_KEYS.BRANDS, updated);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('brands').upsert(baseBrand);
      } catch (e) {
        console.warn('Supabase saveBrand error:', e);
      }
    }
    return baseBrand;
  },

  async deleteBrand(id: string): Promise<boolean> {
    const brands = await this.getBrands();
    setStorageItem(
      STORAGE_KEYS.BRANDS,
      brands.filter((b) => b.id !== id)
    );
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('brands').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteBrand error:', e);
      }
    }
    return true;
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Order[];
      } catch (e) {
        console.warn('Supabase getOrders fallback to local:', e);
      }
    }
    return getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id || o.order_number === id) || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
    const orders = await this.getOrders();
    const orderNumber = `VOLT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    setStorageItem(STORAGE_KEYS.ORDERS, updated);

    // Adjust product inventory
    const products = await this.getProducts();
    const updatedProducts = products.map((prod) => {
      const purchased = orderData.items.find((item) => item.product_id === prod.id);
      if (purchased) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - purchased.quantity),
        };
      }
      return prod;
    });
    setStorageItem(STORAGE_KEYS.PRODUCTS, updatedProducts);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').insert(newOrder);
      } catch (e) {
        console.warn('Supabase createOrder error:', e);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    adminNotes?: string,
    trackingNumber?: string
  ): Promise<boolean> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return false;

    orders[index].status = status;
    orders[index].updated_at = new Date().toISOString();
    if (adminNotes !== undefined) orders[index].admin_notes = adminNotes;
    if (trackingNumber !== undefined) orders[index].tracking_number = trackingNumber;

    setStorageItem(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').update({
          status,
          admin_notes: orders[index].admin_notes,
          tracking_number: orders[index].tracking_number,
          updated_at: orders[index].updated_at,
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase updateOrderStatus error:', e);
      }
    }

    return true;
  },

  async updatePaymentStatus(orderId: string, payment_status: PaymentStatus): Promise<boolean> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return false;

    orders[index].payment_status = payment_status;
    orders[index].updated_at = new Date().toISOString();
    setStorageItem(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').update({ payment_status }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase updatePaymentStatus error:', e);
      }
    }

    return true;
  },

  // --- REVIEWS ---
  async getReviews(productId?: string): Promise<Review[]> {
    const reviews = getStorageItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter((r) => r.product_id === productId && r.is_approved);
    }
    return reviews;
  },

  async addReview(review: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Promise<Review> {
    const reviews = await this.getReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      is_approved: true, // auto-approve in demo
      created_at: new Date().toISOString(),
    };
    const updated = [newRev, ...reviews];
    setStorageItem(STORAGE_KEYS.REVIEWS, updated);
    return newRev;
  },

  async toggleReviewApproval(reviewId: string, approved: boolean): Promise<boolean> {
    const reviews = await this.getReviews();
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, is_approved: approved } : r));
    setStorageItem(STORAGE_KEYS.REVIEWS, updated);
    return true;
  },

  async deleteReview(reviewId: string): Promise<boolean> {
    const reviews = await this.getReviews();
    setStorageItem(
      STORAGE_KEYS.REVIEWS,
      reviews.filter((r) => r.id !== reviewId)
    );
    return true;
  },

  // --- COUPONS ---
  async getCoupons(): Promise<Coupon[]> {
    return getStorageItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
    const coupons = await this.getCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!found || !found.is_active) {
      return { valid: false, error: 'Invalid or inactive promo coupon' };
    }

    if (subtotal < found.min_order_amount) {
      return {
        valid: false,
        error: `Minimum order amount of $${found.min_order_amount.toFixed(2)} required for this coupon`,
      };
    }

    return { valid: true, coupon: found };
  },

  async saveCoupon(coupon: Omit<Coupon, 'id'> & { id?: string }): Promise<Coupon> {
    const coupons = await this.getCoupons();
    const newCoupon: Coupon = {
      ...coupon,
      id: coupon.id || `cpn-${Date.now()}`,
      code: coupon.code.toUpperCase(),
    };
    const filtered = coupons.filter((c) => c.id !== newCoupon.id);
    const updated = [newCoupon, ...filtered];
    setStorageItem(STORAGE_KEYS.COUPONS, updated);
    return newCoupon;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const coupons = await this.getCoupons();
    setStorageItem(
      STORAGE_KEYS.COUPONS,
      coupons.filter((c) => c.id !== id)
    );
    return true;
  },

  // --- BANNERS ---
  async getBanners(): Promise<Banner[]> {
    return getStorageItem<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  },

  async saveBanner(banner: Omit<Banner, 'id'> & { id?: string }): Promise<Banner> {
    const banners = await this.getBanners();
    const newBanner: Banner = {
      ...banner,
      id: banner.id || `ban-${Date.now()}`,
    };
    const filtered = banners.filter((b) => b.id !== newBanner.id);
    const updated = [...filtered, newBanner].sort((a, b) => a.display_order - b.display_order);
    setStorageItem(STORAGE_KEYS.BANNERS, updated);
    return newBanner;
  },

  async deleteBanner(id: string): Promise<boolean> {
    const banners = await this.getBanners();
    setStorageItem(
      STORAGE_KEYS.BANNERS,
      banners.filter((b) => b.id !== id)
    );
    return true;
  },

  // --- SETTINGS ---
  async getSettings(): Promise<SiteSettings> {
    return getStorageItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    setStorageItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // --- CUSTOMERS / USERS ---
  async getCustomers(): Promise<any[]> {
    return getStorageItem<any[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },

  async saveCustomer(customer: any): Promise<any> {
    const customers = await this.getCustomers();
    const id = customer.id || `usr-${Date.now()}`;
    const newCust = {
      ...customer,
      id,
      created_at: customer.created_at || new Date().toISOString(),
    };
    const filtered = customers.filter((c) => c.id !== id);
    const updated = [newCust, ...filtered];
    setStorageItem(STORAGE_KEYS.CUSTOMERS, updated);
    return newCust;
  },

  async deleteCustomer(id: string): Promise<boolean> {
    const customers = await this.getCustomers();
    setStorageItem(
      STORAGE_KEYS.CUSTOMERS,
      customers.filter((c) => c.id !== id)
    );
    return true;
  },

  // --- FAQS ---
  async getFaqs(): Promise<FAQItem[]> {
    return getStorageItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  },

  async saveFaq(faq: Partial<FAQItem> & { question: string; answer: string }): Promise<FAQItem> {
    const faqs = await this.getFaqs();
    const id = faq.id || `faq-${Date.now()}`;
    const newFaq: FAQItem = {
      id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      display_order: faq.display_order ?? faqs.length + 1,
      is_published: faq.is_published ?? true,
    };
    const filtered = faqs.filter((f) => f.id !== id);
    const updated = [...filtered, newFaq].sort((a, b) => a.display_order - b.display_order);
    setStorageItem(STORAGE_KEYS.FAQS, updated);
    return newFaq;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const faqs = await this.getFaqs();
    setStorageItem(
      STORAGE_KEYS.FAQS,
      faqs.filter((f) => f.id !== id)
    );
    return true;
  },

  // --- CMS PAGES ---
  async getCmsPages(): Promise<CMSPage[]> {
    return getStorageItem<CMSPage[]>(STORAGE_KEYS.CMS, INITIAL_CMS_PAGES);
  },

  async getCmsPageBySlug(slug: string): Promise<CMSPage | null> {
    const pages = await this.getCmsPages();
    return pages.find((p) => p.slug === slug) || null;
  },

  async saveCmsPage(page: CMSPage): Promise<CMSPage> {
    const pages = await this.getCmsPages();
    const updated = pages.map((p) => (p.slug === page.slug || p.id === page.id ? { ...page, updated_at: new Date().toISOString() } : p));
    if (!pages.some((p) => p.slug === page.slug || p.id === page.id)) {
      updated.push({ ...page, updated_at: new Date().toISOString() });
    }
    setStorageItem(STORAGE_KEYS.CMS, updated);
    return page;
  },

  // --- CONTACT MESSAGES ---
  async getContactMessages(): Promise<ContactMessage[]> {
    return getStorageItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  },

  async saveContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>): Promise<ContactMessage> {
    const messages = await this.getContactMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    const updated = [newMsg, ...messages];
    setStorageItem(STORAGE_KEYS.MESSAGES, updated);
    return newMsg;
  },

  async markMessageRead(id: string): Promise<boolean> {
    const messages = await this.getContactMessages();
    const updated = messages.map((m) => (m.id === id ? { ...m, is_read: true } : m));
    setStorageItem(STORAGE_KEYS.MESSAGES, updated);
    return true;
  },

  async deleteContactMessage(id: string): Promise<boolean> {
    const messages = await this.getContactMessages();
    setStorageItem(
      STORAGE_KEYS.MESSAGES,
      messages.filter((m) => m.id !== id)
    );
    return true;
  },

  // --- LIVE SUPABASE SYNC HELPER ---
  async syncAllToSupabase(): Promise<{ success: boolean; message: string; counts?: Record<string, number> }> {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        message: 'Supabase credentials are not configured in .env.local yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const products = await this.getProducts();
      const categories = await this.getCategories();
      const brands = await this.getBrands();

      let pCount = 0;
      let cCount = 0;
      let bCount = 0;

      if (categories.length > 0) {
        const { error: catErr } = await supabase.from('categories').upsert(categories);
        if (!catErr) cCount = categories.length;
      }

      if (brands.length > 0) {
        const { error: brErr } = await supabase.from('brands').upsert(brands);
        if (!brErr) bCount = brands.length;
      }

      if (products.length > 0) {
        const { error: prodErr } = await supabase.from('products').upsert(products);
        if (!prodErr) pCount = products.length;
      }

      return {
        success: true,
        message: `Successfully synchronized data with Supabase!`,
        counts: { products: pCount, categories: cCount, brands: bCount },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Database sync error: ${err?.message || 'Unknown error'}`,
      };
    }
  },
};
