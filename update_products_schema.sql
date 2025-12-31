-- Add is_featured column to products table
alter table public.products 
add column is_featured boolean default false;

-- Update RLS to allow reading featured column (already covered by "Select *")
-- No extra policy needed if "Enable read access for all users" using (true) exists.
