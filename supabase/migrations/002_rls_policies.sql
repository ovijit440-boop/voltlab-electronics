-- =========================================================
-- VOLTLAB ELECTRONICS — ROW LEVEL SECURITY POLICIES
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
