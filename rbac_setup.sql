-- Create a profiles table linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

-- Policy: Only admins can update profiles (or you can manually update in dashboard)
create policy "Admins can update profiles" 
  on public.profiles for update 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
