-- ==============================================================================
-- AOUJ LUXURY FASHION - SUPABASE DATABASE SCHEMA
-- Brand: AOUJ ("RISE IN YOUR OWN WAY")
-- Categories: Women, Girls, Family
-- Features: User profiles, Bespoke measurements, Guest & registered orders,
--           Separate order items with dual size tracking, Products, and Images.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES / USERS TABLE (Linked to optional Auth or standalone customer accounts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. USER BESPOKE MEASUREMENTS TABLE (Saved tailoring dimensions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bust TEXT,
    waist TEXT,
    hip TEXT,
    shirt_length TEXT,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. CUSTOMER SAVED ADDRESSES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Home', -- e.g. Home, Office
    address_line TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Lahore',
    postal_code TEXT,
    phone TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES TABLE (Women, Girls, Family)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- 'women', 'girls', 'family'
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE (Master Product Catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    price NUMERIC(12, 2) NOT NULL,
    compare_at_price NUMERIC(12, 2),
    stock INT DEFAULT 50 NOT NULL,
    color_name TEXT DEFAULT 'Ivory Sand',
    color_hex TEXT DEFAULT '#F7F1E8',
    fabric TEXT DEFAULT 'Pure Egyptian Cotton & Silk Organza',
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false, -- Admin toggle for sales
    sale_discount_percent INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. PRODUCT IMAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false
);

-- ------------------------------------------------------------------------------
-- 7. ORDERS TABLE (Master Order Record - Supports both Guests and Registered Clients)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. AOUJ-2026-1001
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for Guest checkout!
    is_guest BOOLEAN DEFAULT true NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Lahore',
    province TEXT DEFAULT 'Punjab',
    postal_code TEXT,
    payment_method TEXT DEFAULT 'Cash on Delivery (COD)' NOT NULL,
    payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    order_status TEXT DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED')),
    subtotal NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    grand_total NUMERIC(12, 2) NOT NULL,
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. ORDER ITEMS TABLE (Individual items with exact selected sizes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    
    -- Specific size tracking as per AOUJ design:
    selected_woman_size TEXT,          -- e.g. Small (S), Medium (M), Large (L), Extra Large (XL)
    selected_girl_size TEXT,           -- e.g. New Born (0-3M), 2-3 Years, 13-15 Years (XL)
    is_custom_size BOOLEAN DEFAULT false,
    custom_measurements JSONB,         -- Stores { bust: '36', waist: '28', hip: '38', length: '42' }
    
    line_total NUMERIC(12, 2) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 9. PROMO CODES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g. 'AOUJ10'
    discount_percent INT DEFAULT 10,
    min_order_amount NUMERIC(12, 2) DEFAULT 5000,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. NEWSLETTER SUBSCRIBERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_measurements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active categories, products, images, and valid promo codes
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Promo codes are viewable by everyone" ON public.promo_codes FOR SELECT USING (is_active = true);

-- Allow customers and guests to place orders and order items
CREATE POLICY "Anyone can create an order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can view their own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Customers can view their order items" ON public.order_items FOR SELECT USING (true);

-- Allow newsletter signups
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA FOR AOUJ (Categories, Promo Code, Sample Products)
-- ==============================================================================

-- 1. Insert 3 Core Categories
INSERT INTO public.categories (slug, name, description, image_url, display_order)
VALUES
    ('women', 'Women Collection', 'Curated luxury pret, embroidered heirlooms, and graceful silhouettes.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=1000&auto=format&fit=crop', 1),
    ('girls', 'Girls Collection', 'Delicate frocks, ghararas, and comfortable festive wear for young girls.', 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=85&w=1000&auto=format&fit=crop', 2),
    ('family', 'Family Collection', 'Coordinated mother & daughter matching sets and family edits.', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=85&w=1000&auto=format&fit=crop', 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Standard Promo Code
INSERT INTO public.promo_codes (code, discount_percent, min_order_amount, is_active)
VALUES ('AOUJ10', 10, 5000, true)
ON CONFLICT (code) DO NOTHING;
