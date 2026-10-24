-- ==============================================================================
-- AOUJ LUXURY FASHION - AUTHENTICATION, LOCKOUT & PROFILE PICTURE SCHEMA UPDATE
-- Run this in Supabase SQL Editor to add password security, 3-attempt lockout,
-- OTP password reset, and profile pictures.
-- ==============================================================================

-- 1. Add authentication & security columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reset_otp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reset_otp_expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Create password_resets table for dedicated OTP verification history
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.password_resets DISABLE ROW LEVEL SECURITY;

-- 3. Update existing admin Bilal Fazal with initial password (hash of 'admin123')
-- SHA-256 hash of 'admin123' = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
UPDATE public.profiles
SET password_hash = 'fb410fa8c0436f594f168a00996266ccaf86d86b2ad9f07dfd99994a3c54bb7b',
    password = 'admin123',
    failed_attempts = 0,
    locked_until = NULL,
    role = 'ADMIN'
WHERE email = 'islgujrat30@gmail.com';

DO $$
BEGIN
    RAISE NOTICE 'AOUJ Auth schema updated successfully with password protection, 3-attempt lockout, and OTP reset!';
END $$;
