# TSN Mart — Next.js + Supabase

A full-stack grocery storefront with admin panel, built with Next.js 16 (App Router), Supabase (Postgres + Auth), and deployed on Vercel.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| State | Zustand (cart) |
| Backend | Supabase (Postgres + Row Level Security) |
| Auth | Supabase Auth (email/password) |
| Hosting | Vercel |

---

## Features

- **Storefront** — product grid, category filters, search, cart sidebar, 10% discount on ₹500+
- **Payment** — PhonePe/UPI QR code + WhatsApp COD flow
- **Admin panel** — add/edit/delete products, manage stock (protected by Supabase Auth)
- **Orders panel** — view all orders, filter by payment method, search customers
- **Secure** — RLS on all tables; admin routes protected by server-side auth check

---

## Setup

### 1. Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** → paste contents of `supabase/schema.sql` → Run

### 2. Create admin user

In Supabase Dashboard → **Authentication** → **Users** → **Add User**
- Enter your email and a strong password
- This becomes your admin login

### 3. Configure environment variables

Copy `.env.local` and fill in your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these in: Supabase Dashboard → **Settings** → **API**

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set environment variables (same 3 as above) in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Storefront (SSR, loads products)
│   ├── layout.tsx
│   ├── globals.css
│   ├── login/page.tsx        # Admin login (Supabase Auth)
│   ├── admin/
│   │   ├── layout.tsx        # Auth guard (server-side)
│   │   ├── page.tsx          # Product management
│   │   └── customers/page.tsx # Orders view
│   └── api/
│       ├── products/route.ts  # GET / POST / PATCH / DELETE
│       └── orders/route.ts    # GET / POST
├── components/
│   ├── StorefrontClient.tsx  # Main storefront wrapper
│   ├── Header.tsx
│   ├── HeroBanner.tsx
│   ├── CategoryChips.tsx
│   ├── ProductGrid.tsx
│   ├── CartSidebar.tsx
│   ├── PaymentModal.tsx
│   ├── CustomerModal.tsx
│   ├── SuccessModal.tsx
│   ├── AdminNav.tsx
│   ├── AdminProductsClient.tsx
│   └── OrdersClient.tsx
├── lib/
│   ├── types.ts
│   ├── store.ts              # Zustand cart store
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       └── middleware.ts     # Session refresh helper
└── proxy.ts                  # Route protection (Next.js Proxy)
supabase/
└── schema.sql                # DB schema + RLS + seed data
```

---

## Security Notes

- Admin credentials are managed by Supabase Auth (not hardcoded in source)
- All admin routes protected server-side via Supabase session check
- Database uses Row Level Security — customers can only insert orders; products are read-only for anon users
- API routes validate auth before any write operations
