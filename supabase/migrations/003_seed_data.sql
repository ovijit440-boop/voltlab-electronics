-- =========================================================
-- VOLTLAB ELECTRONICS — SEED DATA (20+ DEMO ELECTRONICS PRODUCTS)
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
  '৳',
  2000.00
) ON CONFLICT (id) DO NOTHING;

-- 2. SHIPPING METHODS
INSERT INTO shipping_methods (name, cost, estimated_days, is_active) VALUES
('ঢাকা সিটির ভেতরে (Inside Dhaka)', 60.00, '1-2 Days', true),
('ঢাকার বাইরে - সারাদেশে (Outside Dhaka)', 120.00, '2-3 Days', true),
('ফ্রি ডেলিভারি (Free Delivery over ৳2,000)', 0.00, '2-3 Days', true);

-- 3. COUPONS
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active) VALUES
('WELCOME10', '10% off your first electronics order', 'percentage', 10.00, 1000.00, 1000, true),
('VOLT200', '৳200 flat discount over ৳2,500', 'fixed', 200.00, 2500.00, 500, true),
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
