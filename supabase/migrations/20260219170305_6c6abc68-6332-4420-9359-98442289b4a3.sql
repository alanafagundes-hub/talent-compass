
-- 1. Add missing columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Add created_at to user_roles if missing
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 3. Create user_area_assignments table
CREATE TABLE IF NOT EXISTS public.user_area_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, area_id)
);

ALTER TABLE public.user_area_assignments ENABLE ROW LEVEL SECURITY;

-- 4. RLS for user_profiles (admin can do everything, users can read own)
CREATE POLICY "Admins can select all user_profiles"
ON public.user_profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Admins can insert user_profiles"
ON public.user_profiles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user_profiles"
ON public.user_profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. RLS for user_area_assignments
CREATE POLICY "Admins can select user_area_assignments"
ON public.user_area_assignments FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Admins can insert user_area_assignments"
ON public.user_area_assignments FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user_area_assignments"
ON public.user_area_assignments FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
