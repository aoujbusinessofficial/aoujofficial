-- ==============================================================================
-- AOUJ LUXURY FASHION - ADMIN WRITE & MANAGEMENT POLICIES
-- Run this in Supabase SQL Editor to allow the Admin Dashboard to add/edit products,
-- update order statuses, manage promo codes, and update client records.
-- ==============================================================================

-- 1. Full write access to products & images
DROP POLICY IF EXISTS "Allow admin full access to products" ON public.products;
CREATE POLICY "Allow admin full access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to product_images" ON public.product_images;
CREATE POLICY "Allow admin full access to product_images" ON public.product_images FOR ALL USING (true) WITH CHECK (true);

-- 2. Full management access to orders & order items
DROP POLICY IF EXISTS "Allow admin full access to orders" ON public.orders;
CREATE POLICY "Allow admin full access to orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to order_items" ON public.order_items;
CREATE POLICY "Allow admin full access to order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- 3. Full management access to profiles & measurements
DROP POLICY IF EXISTS "Allow admin full access to profiles" ON public.profiles;
CREATE POLICY "Allow admin full access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to user_measurements" ON public.user_measurements;
CREATE POLICY "Allow admin full access to user_measurements" ON public.user_measurements FOR ALL USING (true) WITH CHECK (true);

-- 4. Full management access to promo codes
DROP POLICY IF EXISTS "Allow admin full access to promo_codes" ON public.promo_codes;
CREATE POLICY "Allow admin full access to promo_codes" ON public.promo_codes FOR ALL USING (true) WITH CHECK (true);

RAISE NOTICE 'AOUJ Admin RLS policies applied successfully!';
