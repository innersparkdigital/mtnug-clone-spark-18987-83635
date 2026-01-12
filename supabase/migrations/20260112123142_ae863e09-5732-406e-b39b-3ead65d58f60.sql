-- Drop the policies FIRST before dropping the column
DROP POLICY IF EXISTS "Admins can view all course enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Admins can view all lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Now drop the is_admin column safely
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;

-- Create an enum for roles
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for users to see their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for admins to view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy for admins to manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure policies for admins to view all data
CREATE POLICY "Admins can view all course enrollments"
ON public.course_enrollments
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all lesson progress"
ON public.lesson_progress
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Grant the test user admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('ec08f3b1-7415-4f19-8d07-31cfd4ba068f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;