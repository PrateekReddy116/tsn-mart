-- ============================================================
-- TSN Mart — Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  qty         INTEGER NOT NULL DEFAULT 0,
  stock       BOOLEAN NOT NULL DEFAULT TRUE,
  image       TEXT NOT NULL DEFAULT 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png',
  category    TEXT NOT NULL DEFAULT 'other',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  customer_address    TEXT NOT NULL,
  items               JSONB NOT NULL DEFAULT '[]',
  subtotal            NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount            NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total               NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method      TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'whatsapp')),
  payment_id          TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer Profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  role        TEXT NOT NULL DEFAULT 'customer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved Items table
CREATE TABLE IF NOT EXISTS saved_items (
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read (public storefront)
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products: only authenticated users (admins) can write
CREATE POLICY "products_admin_insert"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "products_admin_update"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products_admin_delete"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Orders: anyone can insert (customers placing orders)
CREATE POLICY "orders_public_insert"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Orders: only authenticated users (admins) can read
CREATE POLICY "orders_admin_read"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Orders: users can read their own orders
CREATE POLICY "orders_user_read"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Customer Profiles RLS
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_profiles_read_own"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "customer_profiles_insert_own"
  ON customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "customer_profiles_update_own"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Saved Items RLS
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_items_read_own"
  ON saved_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "saved_items_insert_own"
  ON saved_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_items_delete_own"
  ON saved_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- Seed default products
-- ============================================================

INSERT INTO products (name, price, qty, stock, image, category) VALUES
  ('Rice (1kg)',    60,  10, TRUE,  'https://res.cloudinary.com/dcvrojcte/image/upload/q_auto/f_auto/v1781604274/DAWAT-20-KG-600x600_sejnzd.webp', 'rice'),
  ('Milk (1L)',     50,   8, TRUE,  'https://cdn-icons-png.flaticon.com/512/3050/3050158.png', 'dairy'),
  ('Eggs (12)',     80,   0, FALSE, 'https://cdn-icons-png.flaticon.com/512/837/837560.png', 'dairy'),
  ('Bread',         40,  15, TRUE,  'https://cdn-icons-png.flaticon.com/512/3050/3050159.png', 'bakery'),
  ('Sugar (1kg)',   45,   0, FALSE, 'https://cdn-icons-png.flaticon.com/512/2674/2674503.png', 'rice'),
  ('Onions (1kg)',  30,   0, FALSE, 'https://cdn-icons-png.flaticon.com/512/2674/2674467.png', 'rice'),
  ('Whisker',      120,   5, TRUE,  'https://cdn-icons-png.flaticon.com/512/1046/1046784.png', 'personal'),
  ('Sandal Soap',   55,  20, TRUE,  'https://cdn-icons-png.flaticon.com/512/2553/2553651.png', 'personal'),
  ('Microfiber',   199,   7, TRUE,  'https://cdn-icons-png.flaticon.com/512/2767/2767016.png', 'home')
ON CONFLICT DO NOTHING;
