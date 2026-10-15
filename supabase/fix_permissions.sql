-- ==============================================================================
-- AOUJ LUXURY FASHION - FIX DATABASE PERMISSIONS (ENABLE ALL OPERATIONS)
-- Run this in Supabase SQL Editor (1-Click Run) to allow profiles, orders, and products
-- to be saved, viewed, and managed freely.
-- ==============================================================================

-- 1. PROFILES (Allow signups, logins, and reading profiles)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. USER MEASUREMENTS (Allow saving bespoke custom measurements)
ALTER TABLE public.user_measurements DISABLE ROW LEVEL SECURITY;

-- 3. ORDERS & ORDER ITEMS (Allow clients and admin to insert, view, update, delete)
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 4. PRODUCTS & IMAGES (Allow admin to add, edit, and delete products)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;

-- 5. PROMO CODES & CATEGORIES
ALTER TABLE public.promo_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- 6. Insert Bilal Fazal profile as ADMIN right away
INSERT INTO public.profiles (email, full_name, phone, role)
VALUES ('islgujrat30@gmail.com', 'Bilal Fazal', '+92 300 0000000', 'ADMIN')
ON CONFLICT (email) DO UPDATE 
SET full_name = EXCLUDED.full_name,
    role = 'ADMIN';

RAISE NOTICE 'Permissions updated and Admin profile for Bilal Fazal activated!';
