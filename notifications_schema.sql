-- 1. Helper function to check if a user is an admin
-- This assumes you have a 'profiles' table with a 'role' column. 
-- If you don't have a profiles table, run rbac_setup.sql first, OR we can create a simple version here.
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if result exists in profiles table
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- specific user, or null for ALL
    type TEXT NOT NULL, -- 'payment', 'opening', 'general'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_link TEXT -- optional link to redirect
);

-- 3. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Policies

-- Admins can do everything
-- We use the function we defined above
CREATE POLICY "Admins can do everything on notifications"
ON public.notifications
FOR ALL
USING (
    public.is_admin(auth.uid())
);

-- Users can view their own notifications or global ones (user_id is null)
CREATE POLICY "Users can view their notifications"
ON public.notifications
FOR SELECT
USING (
    auth.uid() = user_id OR user_id IS NULL
);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their notifications"
ON public.notifications
FOR UPDATE
USING (
    auth.uid() = user_id
);
