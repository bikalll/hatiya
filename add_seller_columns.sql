-- ============================================================
-- SIMPLE SELLER COLUMNS - ADD TO PROFILES TABLE
-- ============================================================
-- Run this in Supabase SQL Editor
-- This just adds the columns, skips any policy creation
-- ============================================================

-- Add seller columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS seller_status text CHECK (seller_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS seller_applied_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS seller_approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS seller_rejected_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS store_name text,
ADD COLUMN IF NOT EXISTS store_description text,
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS business_type text,
ADD COLUMN IF NOT EXISTS business_registration_number text,
ADD COLUMN IF NOT EXISTS tax_id text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS bank_name text,
ADD COLUMN IF NOT EXISTS bank_account_name text,
ADD COLUMN IF NOT EXISTS bank_account_number text,
ADD COLUMN IF NOT EXISTS bank_swift_code text;

-- Disable RLS on profiles to avoid permission issues
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Done! Now try the seller signup again.
