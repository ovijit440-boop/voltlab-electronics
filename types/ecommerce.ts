export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  icon?: string;
  is_featured: boolean;
  display_order: number;
  product_count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  is_featured: boolean;
}

export interface ProductSpecification {
  spec_group?: string;
  key: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price_override?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  price: number;
  discount_price?: number;
  stock: number;
  min_stock_warning: number;
  category: string;
  category_id?: string;
  brand: string;
  brand_id?: string;
  main_image: string;
  gallery_images: string[];
  video_url?: string;
  youtube_video_id?: string;
  warranty_info: string;
  shipping_info: string;
  return_info: string;
  tags: string[];
  features: string[];
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  is_published: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  average_rating: number;
  review_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_variant?: ProductVariant;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  expiry_date?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ShippingAddress {
  full_name: string;
  phone: string;
  email: string;
  street_address: string;
  apartment?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  sku: string;
  variant_name?: string;
  price: number;
  quantity: number;
  total: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  coupon_code?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'cod' | 'bank_transfer' | 'online_card' | 'bkash' | 'nagad' | 'rocket';
  tracking_number?: string;
  shipping_carrier?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  store_name: string;
  tagline: string;
  logo_url?: string;
  favicon_url?: string;
  phone: string;
  email: string;
  address: string;
  youtube_channel_url: string;
  youtube_channel_name: string;
  currency: string;
  currency_symbol: string;
  free_shipping_threshold: number;
  tax_rate: number;
  is_maintenance_mode: boolean;
  announcement_badge?: string;
  announcement_text?: string;
  is_announcement_active?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_published: boolean;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}
