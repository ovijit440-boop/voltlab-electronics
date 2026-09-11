# ⚡ Servicing World (সার্ভিসিং ওয়ার্ল্ড) — Electronics E-Commerce Platform

> A modern, production-ready, full-stack electronics e-commerce platform inspired by the YouTube channel [Servicing World / Bishowjit Datta](https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ). Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Supabase PostgreSQL**.

---

## 🌟 Key Highlights

- **Real YouTube Channel Electronics Catalog**:
  - **লকার মেশিন ও কন্ট্রোলার**: ৩২ খেলা ডিজিটাল লকার মেশিন (32-Channel Chaser), ১৬ খেলা ডিজিটাল লকার ফ্লাশার মেশিন (16-Channel Chaser).
  - **মরিচ বাতি ও লাইটিং**: ১০০ এলইডি ওয়াটারপ্রুফ মাল্টি কালার মরিচ বাতি (40ft), ২০০ এলইডি হেভি কপার গোল্ডেন ওয়ার্ম হোয়াইট বাতি (80ft).
  - **টিভি রিপেয়ারিং পার্টস**: ইউনিভার্সাল এলইডি টিভি কম্বো মাদারবোর্ড কিট (T.V56/53 + রিমোট), ডিজিটাল এলইডি ব্যাকলাইট টেস্টার (0-300V), কালার সিআরটি টিভি ইউনিভার্সাল কিট (14-21").
  - **সার্ভিসিং ও সোল্ডারিং টুলস**: ডিটি-৯২০৫এ ডিজিটাল মাল্টিমিটার, ৬০W অ্যাডজাস্টেবল টেম্পারেচার তাতাল কিট, হেভি ডিউটি অ্যালুমিনিয়াম ডিসোল্ডারিং সাকশন পাম্প, অরিজিনাল আসাহি রাং তার (100g) ও সার্ভিসিং রজন।
  - **ব্লেন্ডার মোটর ও পার্টস**: ৭৫০ ওয়াট ১০০% পিওর কপার ইউনিভার্সাল ব্লেন্ডার মোটর, ইউনিভার্সাল রাবার কাপলার ও জার ব্লেড কম্বো।
  - **অডিও অ্যামপ্লিফায়ার ও মডিউল**: ২.১ চ্যানেল ব্লুটুথ ৫.০ সাবউফার অ্যামপ্লিফায়ার বোর্ড (TPA3116D2 ২০০W), ১২V ব্লুটুথ ইউএসবি এফএম অডিও ডিকোডার মডিউল।
  - **পাওয়ার অ্যাডাপ্টার ও ব্যাটারি**: ১২V ৫A এসএমপিএস পাওয়ার অ্যাডাপ্টার, ৩এস ১২.৬V ৪০A লিথিয়াম আয়ন ব্যাটারি বিএমএস প্রোটেকশন বোর্ড।
  - **সিসি ক্যামেরা ও অ্যাক্সেসরিজ**: ২ মেগাপিক্সেল নাইট ভিশন এইচডি ডোম সিসি ক্যামেরা ও কানেক্টর কিট।

- **Full-Featured Storefront**:
  - Bangladeshi localized currency formatting in Taka (`৳`).
  - Sticky navigation with instant search autocomplete (Bangla & English).
  - Multi-attribute shop filter (Category, Price slider, In-stock, Rating).
  - Rich Product Details with image gallery, tech specifications table, embedded YouTube teardown player, customer reviews, and warranties.
  - Cart drawer with live free-shipping progress tracker (Free shipping on orders over ৳২,০০০).
  - Streamlined Checkout supporting Cash on Delivery (ক্যাশ অন ডেলিভারি), bKash, Nagad, Rocket, and Bank Transfer.
  - Real-time Order Tracking (`/track-order`).

- **Zero-Code Admin Dashboard (`/admin`)**:
  - Executive KPI cards (Total sales, today's sales, low stock alerts, revenue graphs).
  - Full Product CRUD (Add, edit, delete, upload images via ImgBB API, specs, YouTube video links).
  - Order Management (Update status, payment status, tracking numbers, customer notes).
  - Inventory Control (Real-time stock adjustment, minimum stock warnings).
  - Category, Coupon, Banner, Review, and Content Management.
  - Site Settings (Store name, hotline, address, announcement banner toggle).

- **Database & Architecture**:
  - Persistent Dual-Mode Adapter (`lib/store/db-adapter.ts`).
  - Seamlessly connects to Supabase PostgreSQL or falls back to robust local storage.
  - ImgBB API integration for instant, free image hosting.

---

## 🛠️ Getting Started Locally

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
git clone https://github.com/ovijit440-boop/servicing-world.git
cd servicing-world
npm install
```

### 3. Environment Variables
Create a `.env.local` file based on `.env.example`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ImgBB API Key
NEXT_PUBLIC_IMGBB_API_KEY=7a72f02b65e930275334abe25b3c27d0
IMGBB_API_KEY=7a72f02b65e930275334abe25b3c27d0

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
├── app/                    # Next.js App Router (Storefront & Admin)
│   ├── admin/             # Full Admin Dashboard pages
│   ├── api/upload/        # ImgBB API endpoint for image uploads
│   ├── product/[slug]/    # Dynamic product detail page
│   ├── shop/              # Product catalog & filter page
│   ├── checkout/          # Checkout with COD & bKash
│   └── page.tsx           # Homepage with Hero, Banner & Products
├── components/            # Reusable UI components
│   ├── storefront/        # Header, Footer, Hero, ProductCards, CartDrawer
│   ├── providers/         # Cart, Wishlist, Auth & Theme providers
│   └── ui/                # ImageUploader, buttons, modals
├── lib/                   # Utility functions & Database adapters
│   ├── store/             # db-adapter.ts & demo-data.ts
│   ├── supabase/          # client.ts
│   └── utils.ts           # BDT currency formatter & helper functions
├── public/                # Static assets (logo.png, favicon.png)
└── supabase/              # SQL schema & migrations (complete_database.sql)
```

---

## 📍 Store Information
- **Shop**: Servicing World (সার্ভিসিং ওয়ার্ল্ড)
- **Proprietor**: Bishowjit Datta (বিশ্বরজিৎ দত্ত)
- **Address**: Harta Bazar, Girls School Road, Wazirpur, Barishal, Bangladesh
- **Hotline / WhatsApp / Imo**: `+880 1785-958427`
- **YouTube Channel**: [Servicing World](https://www.youtube.com/channel/UCo60TsGBAlADhFamHpr4sJQ)

---

## 📄 License
MIT License. Created for Servicing World.
