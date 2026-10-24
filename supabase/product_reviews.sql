-- =============================================================================
-- AOUJ LUXURY ATELIER: PRODUCT REVIEWS TABLE & POLICIES
-- Run this script in your Supabase SQL Editor to permanently store reviews in the database.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  city TEXT DEFAULT 'Pakistan',
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Allow everyone (public & patrons) to read product reviews
DROP POLICY IF EXISTS "Allow public read product_reviews" ON public.product_reviews;
CREATE POLICY "Allow public read product_reviews"
  ON public.product_reviews FOR SELECT
  USING (true);

-- 2. Allow clients to submit reviews
DROP POLICY IF EXISTS "Allow public insert product_reviews" ON public.product_reviews;
CREATE POLICY "Allow public insert product_reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (true);

-- 3. Allow updating helpful count
DROP POLICY IF EXISTS "Allow public update product_reviews" ON public.product_reviews;
CREATE POLICY "Allow public update product_reviews"
  ON public.product_reviews FOR UPDATE
  USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews(created_at DESC);
