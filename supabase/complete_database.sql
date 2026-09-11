-- =========================================================
-- VOLTLAB ELECTRONICS â€” COMPLETE SUPABASE DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'staff', 'customer');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. CATEGORIES & SUBCATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price <= price),
  cost_price NUMERIC(10, 2),
  stock INT DEFAULT 0 NOT NULL CHECK (stock >= 0),
  min_stock_warning INT DEFAULT 5 NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  main_image TEXT NOT NULL,
  video_url TEXT,
  youtube_video_id TEXT,
  warranty_info TEXT DEFAULT '1 Year Official Warranty',
  shipping_info TEXT DEFAULT 'Dispatched in 24 hours. Free delivery on orders over $50.',
  return_info TEXT DEFAULT '7 Days Money-Back Guarantee.',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_bestseller BOOLEAN DEFAULT false NOT NULL,
  is_new_arrival BOOLEAN DEFAULT false NOT NULL,
  is_on_sale BOOLEAN DEFAULT false NOT NULL,
  average_rating NUMERIC(2, 1) DEFAULT 0.0 NOT NULL,
  review_count INT DEFAULT 0 NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PRODUCT IMAGES (Gallery)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. PRODUCT VARIANTS (Colors, Storage, Specs)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Color: Midnight Black" or "Capacity: 20000mAh"
  sku TEXT UNIQUE,
  price_override NUMERIC(10, 2),
  stock INT DEFAULT 0 NOT NULL,
  attributes JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. PRODUCT SPECIFICATIONS (Technical Details)
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_group TEXT DEFAULT 'General',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL
);

-- 8. INVENTORY & AUDIT LOGS
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  change_amount INT NOT NULL,
  reason TEXT NOT NULL, -- 'restock', 'order_placed', 'order_cancelled', 'manual_adjustment'
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. CUSTOMERS & SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address_type TEXT DEFAULT 'shipping', -- 'shipping' or 'billing'
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'US' NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. SHIPPING METHODS
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cost NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  estimated_days TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  max_discount_amount NUMERIC(10, 2),
  start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expiry_date TIMESTAMPTZ,
  usage_limit INT,
  used_count INT DEFAULT 0 NOT NULL,
  per_user_limit INT DEFAULT 1 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. ORDERS & ORDER ITEMS
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'failed', 'refunded'
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  coupon_id UUID REFERENCES coupons(id),
  shipping_method_id UUID REFERENCES shipping_methods(id),
  shipping_method_name TEXT,
  status order_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT NOT NULL, -- 'cod', 'bank_transfer', 'online_card'
  payment_details JSONB DEFAULT '{}'::jsonb,
  tracking_number TEXT,
  shipping_carrier TEXT,
  estimated_delivery TIMESTAMPTZ,
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  variant_name TEXT,
  sku TEXT,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(wishlist_id, product_id)
);

-- 14. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN DEFAULT false NOT NULL,
  is_approved BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. CMS & STORE CONFIGURATION
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_url TEXT DEFAULT '/shop',
  display_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  display_order INT DEFAULT 0 NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_settings',
  store_name TEXT DEFAULT 'VoltLab Electronics' NOT NULL,
  tagline TEXT DEFAULT 'Next-Gen Tested Electronics & Power Gadgets',
  logo_url TEXT,
  favicon_url TEXT,
  phone TEXT DEFAULT '+1 (800) 555-VOLT',
  email TEXT DEFAULT 'support@voltlab.tech',
  address TEXT DEFAULT '100 Silicon Way, Tech Valley, CA 94016',
  youtube_channel_url TEXT DEFAULT 'https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ',
  youtube_channel_name TEXT DEFAULT 'VoltLab Electronics',
  currency TEXT DEFAULT 'USD' NOT NULL,
  currency_symbol TEXT DEFAULT '$' NOT NULL,
  free_shipping_threshold NUMERIC(10, 2) DEFAULT 50.00 NOT NULL,
  tax_rate NUMERIC(4, 2) DEFAULT 0.00 NOT NULL,
  is_maintenance_mode BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
-- =========================================================
-- VOLTLAB ELECTRONICS â€” ROW LEVEL SECURITY POLICIES
-- Migration: 002_rls_policies.sql
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: check if current user has staff or admin rights
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles can be viewed by profile owner or admin"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR public.is_staff());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (public.is_admin());

-- 2. PUBLIC CATALOG ACCESS (Categories, Subcategories, Brands, Products, Variants, Images, Specs)
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT USING (true);
CREATE POLICY "Staff can manage categories"
  ON categories FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view subcategories"
  ON subcategories FOR SELECT USING (true);
CREATE POLICY "Staff can manage subcategories"
  ON subcategories FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view brands"
  ON brands FOR SELECT USING (true);
CREATE POLICY "Staff can manage brands"
  ON brands FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  USING (is_published = true OR public.is_staff());
CREATE POLICY "Staff can manage products"
  ON products FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT USING (true);
CREATE POLICY "Staff can manage product images"
  ON product_images FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view product variants"
  ON product_variants FOR SELECT USING (true);
CREATE POLICY "Staff can manage product variants"
  ON product_variants FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view product specifications"
  ON product_specifications FOR SELECT USING (true);
CREATE POLICY "Staff can manage product specifications"
  ON product_specifications FOR ALL USING (public.is_staff());

-- 3. ORDERS & ORDER ITEMS
-- Anyone can place an order (even guest), but logged in users see their own
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Customers can view their own orders or staff can view all"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id OR public.is_staff());

CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  USING (public.is_staff());

CREATE POLICY "Customers can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Order items viewable by order owner or staff"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR public.is_staff())
    )
  );

-- 4. WISHLISTS & WISHLIST ITEMS
CREATE POLICY "Users can manage own wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist items"
  ON wishlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
      AND wishlists.user_id = auth.uid()
    )
  );

-- 5. REVIEWS
CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true OR public.is_staff());

CREATE POLICY "Authenticated users can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage reviews"
  ON reviews FOR ALL
  USING (public.is_staff());

-- 6. CMS (Banners, Pages, FAQ, Contact Messages, Newsletter)
CREATE POLICY "Public can view active banners"
  ON banners FOR SELECT USING (is_active = true OR public.is_staff());
CREATE POLICY "Staff can manage banners"
  ON banners FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view CMS pages"
  ON pages FOR SELECT USING (true);
CREATE POLICY "Staff can manage CMS pages"
  ON pages FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view published FAQ"
  ON faq FOR SELECT USING (is_published = true OR public.is_staff());
CREATE POLICY "Staff can manage FAQ"
  ON faq FOR ALL USING (public.is_staff());

CREATE POLICY "Anyone can submit contact message"
  ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can view and manage contact messages"
  ON contact_messages FOR ALL USING (public.is_staff());

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can manage newsletter subscribers"
  ON newsletter_subscribers FOR ALL USING (public.is_staff());

-- 7. SETTINGS & COUPONS
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update site settings"
  ON site_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Public can read active coupons"
  ON coupons FOR SELECT USING (is_active = true OR public.is_staff());
CREATE POLICY "Staff can manage coupons"
  ON coupons FOR ALL USING (public.is_staff());

CREATE POLICY "Public can view active shipping methods"
  ON shipping_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Staff can manage shipping methods"
  ON shipping_methods FOR ALL USING (public.is_staff());
-- =========================================================
-- VOLTLAB ELECTRONICS â€” SEED DATA (20+ DEMO ELECTRONICS PRODUCTS)
-- Migration: 003_seed_data.sql
-- =========================================================

-- 1. SITE SETTINGS
INSERT INTO site_settings (id, store_name, tagline, phone, email, address, youtube_channel_url, youtube_channel_name, currency, currency_symbol, free_shipping_threshold)
VALUES (
  'current_settings',
  'VoltLab Electronics',
  'Tested & Benchmarked High-Power Electronics, GaN Chargers & Tech Gear',
  '+880 1700-000000',
  'support@voltlab.tech',
  'Multiplan Center, Level 4, New Elephant Road, Dhaka-1205, Bangladesh',
  'https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ',
  'VoltLab Electronics',
  'BDT',
  'à§³',
  2000.00
) ON CONFLICT (id) DO NOTHING;

-- 2. SHIPPING METHODS
INSERT INTO shipping_methods (name, cost, estimated_days, is_active) VALUES
('à¦¢à¦¾à¦•à¦¾ à¦¸à¦¿à¦Ÿà¦¿à¦° à¦­à§‡à¦¤à¦°à§‡ (Inside Dhaka)', 60.00, '1-2 Days', true),
('à¦¢à¦¾à¦•à¦¾à¦° à¦¬à¦¾à¦‡à¦°à§‡ - à¦¸à¦¾à¦°à¦¾à¦¦à§‡à¦¶à§‡ (Outside Dhaka)', 120.00, '2-3 Days', true),
('à¦«à§à¦°à¦¿ à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦°à¦¿ (Free Delivery over à§³2,000)', 0.00, '2-3 Days', true);

-- 3. COUPONS
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active) VALUES
('WELCOME10', '10% off your first electronics order', 'percentage', 10.00, 1000.00, 1000, true),
('VOLT200', 'à§³200 flat discount over à§³2,500', 'fixed', 200.00, 2500.00, 500, true),
('YOUTUBE15', '15% YouTube Subscriber Special Discount', 'percentage', 15.00, 1500.00, 2000, true);

-- 4. BANNERS
INSERT INTO banners (title, subtitle, badge, image_url, cta_text, cta_url, display_order, is_active) VALUES
(
  'Next-Gen 140W GaN Fast Chargers',
  'Ultra-compact, multi-port power stations with real-time digital wattage displays and PD 3.1 protocol.',
  'LAB TESTED & CERTIFIED',
  'https://images.unsplash.com/photo-1609592806787-3d9c5d0a64c4?auto=format&fit=crop&w=1400&q=80',
  'Explore Fast Chargers',
  '/shop?category=chargers',
  1,
  true
),
(
  'True Wireless ANC Studio Earbuds',
  'Active noise cancellation, titanium audio drivers, and up to 40 hours battery backup with low-latency gaming mode.',
  'BESTSELLER 2026',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1400&q=80',
  'Shop Audio Gear',
  '/shop?category=audio',
  2,
  true
);

-- 5. FAQ
INSERT INTO faq (question, answer, category, display_order) VALUES
('How do I know the products are genuine and tested?', 'Every product in VoltLab is hand-tested in our hardware lab, verified with digital multimeters and power-delivery analyzers as seen on our YouTube channel before being approved for stock.', 'Products & Quality', 1),
('What is your warranty coverage?', 'All products come with our 1-Year Official Replacement Warranty covering manufacturing defects and electrical failures.', 'Warranty', 2),
('How fast do you dispatch orders?', 'Orders placed before 2:00 PM EST are bench-tested, securely packed in anti-static ESD packaging, and shipped the same business day.', 'Shipping', 3),
('Do you support international shipping?', 'Yes, we ship to over 50 countries worldwide with real-time tracking numbers provided upon dispatch.', 'Shipping', 4);
