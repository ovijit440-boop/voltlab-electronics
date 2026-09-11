# ⚡ VoltLab Electronics — Production E-Commerce Platform

> A modern, production-ready, full-stack electronics e-commerce platform inspired by YouTube hardware teardowns and circuit benchmarking. Built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## 🌟 Key Highlights

- **Benchmarked Electronics Brand**: Custom branding with YouTube video integration, oscilloscope teardowns, and live performance metrics.
- **Full-Featured Storefront**:
  - Sticky navigation with instant search autocomplete (by title, SKU, tags).
  - Multi-attribute shop filter (Category, Price slider, In-stock, Rating, Brand).
  - Rich Product Details with image gallery zoom, tech specs table, embedded YouTube teardown player, customer reviews, and "Frequently Bought Together" bundles.
  - Cart drawer with live free-shipping progress tracker and promo coupon applicator (`WELCOME10`, `VOLT20`).
  - Streamlined Checkout with address validation, delivery options, and a modular payment architecture (Credit Card / Online, Cash on Delivery, Bank Transfer).
  - Real-time Order Tracking with a visual fulfillment timeline (`pending` → `confirmed` → `processing` → `shipped` → `delivered`).
- **Customer Account Portal (`/account`)**:
  - Order history with status badges and printable invoices.
  - Hardware Wishlist with 1-click "Move to Cart".
- **Zero-Code Admin Dashboard (`/admin`)**:
  - Executive KPI cards (Total sales, today's sales, low stock alerts, revenue graphs).
  - Full Product CRUD (Add, edit, delete, duplicate, toggle featured/bestseller, upload images, specs, YouTube video IDs).
  - Order Management (Update lifecycle status, payment status, tracking numbers, internal technician notes).
  - Inventory Control (Real-time stock adjustment, minimum stock warnings, out-of-stock highlights).
  - Coupon Manager (Percentage and fixed discount promos).
  - Banner Manager (Homepage hero carousel control).
  - Review Moderation (Approve, hide, or delete customer reviews).
  - Store Settings (Currency, free shipping threshold, YouTube channel link, maintenance mode).
- **Production-Ready Relational Supabase Schema**:
  - 20+ relational PostgreSQL tables with UUIDs, indexes, and constraints.
  - Complete Row Level Security (RLS) policies protecting customer and administrative data.
  - Realistic seed migrations containing 20+ detailed demo electronics products.
- **Dual-Mode Resiliency**:
  - Out-of-the-box local storage & state adapter that allows complete end-to-end testing immediately without entering credentials.
  - Automatically switches to live Supabase PostgreSQL when `.env.local` is provided!
- **SEO & Performance**:
  - Dynamic `generateMetadata` on all products and categories.
  - Valid `schema.org/Product` JSON-LD structured data.
  - Automated `sitemap.xml` and `robots.txt`.
  - Dark / Light mode preference persistence.
  - Netlify OpenNext ready (`netlify.toml`).

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yourusername/voltlab-electronics.git
cd voltlab-electronics
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials (available in Supabase Console > Project Settings > API):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*(Note: If you leave these blank during initial testing, the application automatically runs in persistent local sandbox mode).*

### 3. Run Supabase Database Migrations
Go to your Supabase SQL Editor and run the SQL migration files in sequence:
1. `supabase/migrations/001_initial_schema.sql` (Creates all 20+ tables & relationships)
2. `supabase/migrations/002_rls_policies.sql` (Applies Row Level Security)
3. `supabase/migrations/003_seed_data.sql` (Seeds initial categories, banners, coupons, and site settings)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Panel.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deploy to Netlify

1. Push your repository to GitHub.
2. Log in to [Netlify](https://app.netlify.com) and click **"Add new site"** → **"Import an existing project"**.
3. Select your GitHub repository.
4. Set the build environment variables in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
5. Click **Deploy Site**. The included `netlify.toml` will configure the `@netlify/plugin-nextjs` OpenNext adapter automatically!

---

## 🛡️ Default Demo Sandbox Accounts
- **Admin**: Sign in at `/login` or click **"Admin Demo"** (direct access to `/admin`).
- **Customer**: Click **"Customer Demo"** at `/login` to test placing orders, managing wishlists, and viewing receipts.

---

## 📄 License
MIT License. Created for makers, electrical engineers, and hardware enthusiasts.
