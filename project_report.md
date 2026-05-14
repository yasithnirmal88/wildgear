# Wild Trail Gear - Project Report & Directory Structure

## 🌟 Project Overview
Wild Trail Gear is a modern outdoor equipment rental management system. It features a high-end public catalog for customers to browse gear and a secure, real-time administrative dashboard for managing inventory, customers, and rental transactions.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS (Modular)
- **Animations**: GSAP (GreenSock Animation Platform)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (Bucket: `equipment`)
- **PDF Generation**: jsPDF & html2canvas

---

## 📁 Directory Structure

```text
WILD-TRAIL-GEAR/
├── app/                      # Next.js App Router Pages
│   ├── admin/                # Admin Management Dashboard
│   │   └── page.tsx          # Real-time Admin UI & Logic
│   ├── catalog/              # Public Rental Catalog
│   │   └── page.tsx          # Filterable Gear Listing
│   ├── about/                # Static About Page
│   ├── contact/              # Contact & Location Page
│   ├── layout.tsx            # Global Layout & Providers
│   └── page.tsx              # Landing Page (Home)
├── components/               # Reusable React Components
│   ├── home/                 # Home Page Sections (Hero, Featured, etc.)
│   ├── Icons.tsx             # Custom SVG Icon Set
│   ├── Nav.tsx               # Global Navigation
│   └── Footer.tsx            # Site Footer
├── lib/                      # Core Utilities & Configurations
│   ├── supabase.ts           # Supabase Client Initialization
│   ├── catalog-data.ts       # Seed Data & Type Definitions
│   └── constants.ts          # Global Constants (WhatsApp links, etc.)
├── public/                   # Static Assets
│   ├── images/               # Product & Brand Images
│   └── logo.png              # Wild Trail Gear Branding
├── .env.local                # Local Environment Variables
├── next.config.js            # Next.js Configuration (Standard Deployment)
├── package.json              # Dependencies & Scripts
└── tsconfig.json             # TypeScript Configuration
```

---

## 🚀 Recent Architecture Improvements

### 1. Backend Migration (Firebase → Supabase)
We successfully migrated the entire backend infrastructure to Supabase to resolve reliability issues with image uploads and to provide a more robust relational data model.
- **Data Integrity**: Switched from NoSQL (Firestore) to PostgreSQL, enabling foreign key constraints and automatic timestamp triggers.
- **Storage Hardening**: Implemented path-level security for the `equipment` bucket, enforcing that all admin uploads reside in the `items/` folder.
- **Real-time Sync**: Leveraged Supabase Replication for instant UI updates across the Admin and Catalog pages.

### 2. Standardized Data Schema
Unified the data model across the frontend and backend using `image_url` for consistency. All catalog items now follow a strict `CatalogItem` interface.

### 3. Production-Grade Security (RLS)
Implemented explicit Row Level Security (RLS) policies for all tables and storage objects:
- **Public**: Can read items.
- **Admins**: Full CRUD access to items, customers, and rental records.
- **Storage**: Public read access to the `equipment` bucket, with authenticated-only write access to the `items/` folder.

### 4. Performance Optimization
Added database indices on frequently filtered columns (`category`, `status`, `phone`) to ensure sub-millisecond query performance as the business scales.

---

## 📋 Maintenance Notes
- **Admin Access**: Protected via a secret key URL parameter (`?key=trail2026`) and Supabase Auth.
- **Deployment**: Configured for standard Next.js deployment on Vercel.
- **Environment**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in the production environment.
