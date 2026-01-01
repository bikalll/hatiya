-- Extended Seller Schema Migration v2
-- Run in Supabase SQL Editor

-- =============================================
-- STEP 1: Add Extended Business Information
-- =============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS business_type text CHECK (business_type IN ('individual', 'company', 'partnership')),
ADD COLUMN IF NOT EXISTS business_registration_number text,
ADD COLUMN IF NOT EXISTS tax_id text;

-- =============================================
-- STEP 2: Add Contact Information
-- =============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS postal_code text;

-- =============================================
-- STEP 3: Add Bank/Payout Information
-- =============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bank_name text,
ADD COLUMN IF NOT EXISTS bank_account_name text,
ADD COLUMN IF NOT EXISTS bank_account_number text,
ADD COLUMN IF NOT EXISTS bank_swift_code text;

-- =============================================
-- STEP 4: Add Store Details
-- =============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS store_description text,
ADD COLUMN IF NOT EXISTS store_logo_url text,
ADD COLUMN IF NOT EXISTS store_banner_url text;

-- =============================================
-- STEP 5: Add Verification Documents
-- =============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS id_document_url text,
ADD COLUMN IF NOT EXISTS business_document_url text;

-- =============================================
-- STEP 6: Add Seller Timestamps & Admin Notes
-- =============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS seller_applied_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS seller_approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS seller_rejected_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_notes text;

-- =============================================
-- STEP 7: Create Storage Bucket for Documents
-- =============================================

-- Run this in your Supabase dashboard under Storage:
-- Create bucket: seller-documents (private)
-- Create bucket: store-assets (public)

-- Storage Policies (run in SQL if buckets exist):
-- Allow authenticated users to upload to their own folder

-- INSERT INTO storage.buckets (id, name, public) VALUES ('seller-documents', 'seller-documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-assets', 'store-assets', true);

-- =============================================
-- STEP 8: Update RLS Policies for Extended Fields
-- =============================================

-- Policy for users to update their own seller-related fields
-- (already exists from seller_schema.sql, but we can refine it)

DROP POLICY IF EXISTS "Users can apply to become seller" ON public.profiles;

CREATE POLICY "Users can update own profile including seller fields"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Users cannot set their own status to approved
  (seller_status IS NULL OR seller_status = 'pending' OR seller_status = (SELECT seller_status FROM public.profiles WHERE id = auth.uid()))
);

-- =============================================
-- VERIFICATION: Check columns exist
-- =============================================

-- Run this query to verify:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position;
