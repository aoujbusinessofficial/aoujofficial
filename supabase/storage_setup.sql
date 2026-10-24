-- ==============================================================================
-- AOUJ LUXURY ATELIER - SUPABASE STORAGE BUCKETS SETUP
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Policy: Allow Public Read Access for product-images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 4. Policy: Allow Public Read Access for avatars
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 5. Policy: Allow Anyone (or Authenticated) to upload product images
DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
CREATE POLICY "Allow upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- 6. Policy: Allow Anyone to upload avatars
DROP POLICY IF EXISTS "Allow upload avatars" ON storage.objects;
CREATE POLICY "Allow upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

-- 7. Policy: Allow Updating & Deleting
DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
CREATE POLICY "Allow update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow delete product images" ON storage.objects;
CREATE POLICY "Allow delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
