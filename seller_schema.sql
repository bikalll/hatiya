-- Add seller columns to profiles
alter table public.profiles
add column if not exists seller_status text check (seller_status in ('pending', 'approved', 'rejected')),
add column if not exists store_name text;

-- Add seller columns to products
alter table public.products
add column if not exists seller_id uuid references public.profiles(id),
add column if not exists is_verified boolean default false;

-- Update Product RLS Policies

-- Drop existing read policy to replace it
drop policy if exists "Enable read access for all users" on public.products;

-- New Read Policy: Everyone can see verified products OR their own products
create policy "Public view verified products"
on public.products for select
using (
  (is_verified = true) or 
  (auth.uid() = seller_id) or
  (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
);

-- Drop existing write policy
drop policy if exists "Enable write access for authenticated users" on public.products;

-- New Insert Policy: Approved sellers can insert
create policy "Approved sellers can insert products"
on public.products for insert
with check (
  auth.uid() = seller_id and
  exists (select 1 from public.profiles where id = auth.uid() and seller_status = 'approved')
);

-- New Update Policy: Sellers can update their own products, Admins can update all
create policy "Sellers and Admins can update products"
on public.products for update
using (
  (auth.uid() = seller_id) or
  (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
);

-- New Delete Policy: Sellers can delete their own products, Admins can delete all
create policy "Sellers and Admins can delete products"
on public.products for delete
using (
  (auth.uid() = seller_id) or
  (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
);

-- Policy to allow anyone to register as a seller (update their own profile) is already covered by "Users can view own profile" 
-- BUT we need an update policy for users modifying their own profile (which wasn't fully explicit in rbac_setup.sql except for admins).
-- Let's create a specific policy for users to become sellers (update seller_status/store_name)
-- Actually, strict security would mean they shouldn't be able to set their own status to 'approved'.
-- So they should only be able to set it to 'pending'.

create policy "Users can apply to become seller"
on public.profiles for update
using (auth.uid() = id)
with check (
  auth.uid() = id and
  (
    -- If they are changing seller_status, they can only set it to 'pending'
    (seller_status = 'pending' and (select seller_status from public.profiles where id = auth.uid()) is null)
    or
    -- Or they are just updating other fields and not pretending to be approved
    (seller_status is not distinct from (select seller_status from public.profiles where id = auth.uid()))
  )
);
