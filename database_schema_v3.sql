-- ============================================================
-- SANIBARE HATIYA - Complete Database Schema
-- Version 3.0 - Separate Tables for Customers, Sellers, Admins
-- ============================================================
-- Run this script in Supabase SQL Editor
-- This creates a proper multi-role architecture
-- ============================================================

-- ============================================================
-- SECTION 1: CREATE USER ROLE ENUM
-- ============================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- SECTION 2: UPDATE PROFILES TABLE (Base User Info)
-- ============================================================

-- The profiles table is auto-created by Supabase on auth.users insert
-- We'll add a role column and basic info

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- ============================================================
-- SECTION 3: CREATE CUSTOMERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.customers (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Shipping Information
    shipping_address text,
    shipping_city text,
    shipping_country text DEFAULT 'Nepal',
    shipping_postal_code text,
    
    -- Billing Information
    billing_address text,
    billing_same_as_shipping boolean DEFAULT true,
    
    -- Preferences
    preferred_payment_method text,
    newsletter_subscribed boolean DEFAULT false,
    
    -- Stats
    total_orders integer DEFAULT 0,
    total_spent numeric(12,2) DEFAULT 0,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- SECTION 4: CREATE SELLERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sellers (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Store Information
    store_name text NOT NULL,
    store_description text,
    store_logo_url text,
    store_banner_url text,
    store_slug text UNIQUE,
    
    -- Business Information
    business_name text NOT NULL,
    business_type text CHECK (business_type IN ('individual', 'company', 'partnership')),
    business_registration_number text,
    tax_id text,
    
    -- Contact Information
    business_email text,
    business_phone text,
    country text DEFAULT 'Nepal',
    city text,
    address text,
    postal_code text,
    
    -- Bank/Payout Information
    bank_name text,
    bank_account_name text,
    bank_account_number text,
    bank_swift_code text,
    
    -- Verification Documents
    id_document_url text,
    business_document_url text,
    
    -- Verification Status
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    admin_notes text,
    
    -- Timestamps
    applied_at timestamp with time zone DEFAULT now(),
    approved_at timestamp with time zone,
    rejected_at timestamp with time zone,
    
    -- Stats
    total_products integer DEFAULT 0,
    total_sales integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    rating numeric(2,1) DEFAULT 0,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- SECTION 5: CREATE ADMINS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admins (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Admin Level
    admin_level text DEFAULT 'moderator' CHECK (admin_level IN ('super_admin', 'admin', 'moderator')),
    
    -- Permissions (JSON for flexibility)
    permissions jsonb DEFAULT '{"sellers": true, "products": true, "orders": true, "customers": false, "settings": false}'::jsonb,
    
    -- Activity
    last_login timestamp with time zone,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- SECTION 6: UPDATE PRODUCTS TABLE
-- ============================================================

-- Ensure products has proper seller relationship
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.sellers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES public.admins(id);

-- ============================================================
-- SECTION 7: CREATE ORDERS TABLE (if not exists)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer
    customer_id uuid REFERENCES public.customers(id),
    customer_name text,
    customer_email text,
    customer_phone text,
    
    -- Shipping
    shipping_address text,
    shipping_city text,
    shipping_country text,
    
    -- Order Details
    items jsonb NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    shipping_cost numeric(12,2) DEFAULT 0,
    tax numeric(12,2) DEFAULT 0,
    total_amount numeric(12,2) NOT NULL,
    
    -- Status
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_method text,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- SECTION 8: CREATE SELLER ORDERS VIEW
-- ============================================================

-- View for sellers to see orders containing their products
CREATE OR REPLACE VIEW public.seller_orders AS
SELECT 
    o.id as order_id,
    o.customer_name,
    o.status,
    o.payment_status,
    o.created_at,
    item->>'product_id' as product_id,
    item->>'name' as product_name,
    (item->>'quantity')::int as quantity,
    (item->>'price')::numeric as price,
    p.seller_id
FROM public.orders o
CROSS JOIN LATERAL jsonb_array_elements(o.items) as item
JOIN public.products p ON p.id::text = item->>'product_id';

-- ============================================================
-- SECTION 9: ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS POLICIES
DROP POLICY IF EXISTS "Customers can view own data" ON public.customers;
CREATE POLICY "Customers can view own data" ON public.customers
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Customers can update own data" ON public.customers;
CREATE POLICY "Customers can update own data" ON public.customers
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Customers can insert own data" ON public.customers;
CREATE POLICY "Customers can insert own data" ON public.customers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- SELLERS POLICIES
DROP POLICY IF EXISTS "Sellers can view own data" ON public.sellers;
CREATE POLICY "Sellers can view own data" ON public.sellers
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Sellers can update own data except status" ON public.sellers;
CREATE POLICY "Sellers can update own data except status" ON public.sellers
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        status = (SELECT status FROM public.sellers WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can apply as seller" ON public.sellers;
CREATE POLICY "Users can apply as seller" ON public.sellers
    FOR INSERT WITH CHECK (auth.uid() = id AND status = 'pending');

DROP POLICY IF EXISTS "Public can view approved sellers" ON public.sellers;
CREATE POLICY "Public can view approved sellers" ON public.sellers
    FOR SELECT USING (status = 'approved');

-- ADMINS POLICIES
DROP POLICY IF EXISTS "Admins can view all sellers" ON public.sellers;
CREATE POLICY "Admins can view all sellers" ON public.sellers
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can update sellers" ON public.sellers;
CREATE POLICY "Admins can update sellers" ON public.sellers
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can view own data" ON public.admins;
CREATE POLICY "Admins can view own data" ON public.admins
    FOR SELECT USING (auth.uid() = id);

-- ============================================================
-- SECTION 10: HELPER FUNCTIONS
-- ============================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.admins WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is seller
CREATE OR REPLACE FUNCTION public.is_seller(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.sellers WHERE id = user_id AND status = 'approved');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
    user_role text;
BEGIN
    IF EXISTS (SELECT 1 FROM public.admins WHERE id = user_id) THEN
        RETURN 'admin';
    ELSIF EXISTS (SELECT 1 FROM public.sellers WHERE id = user_id) THEN
        RETURN 'seller';
    ELSE
        RETURN 'customer';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SECTION 11: TRIGGERS
-- ============================================================

-- Trigger to auto-create customer record on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'customer');
    
    INSERT INTO public.customers (id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SECTION 12: CREATE DEFAULT ADMIN (Optional)
-- ============================================================

-- To create an admin, first create a regular user in Supabase Auth,
-- then run this with their user ID:
-- 
-- INSERT INTO public.admins (id, admin_level, permissions)
-- VALUES (
--     'YOUR-USER-UUID-HERE',
--     'super_admin',
--     '{"sellers": true, "products": true, "orders": true, "customers": true, "settings": true}'
-- );
-- 
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR-USER-UUID-HERE';

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check sellers table columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sellers';

-- Check admins table columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admins';
