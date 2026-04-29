-- Phase 1: RBAC foundation
-- Add 'content_admin' role to existing app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_admin';

-- Page-level permissions table (Super Admin grants per-user access to specific admin sections)
CREATE TABLE IF NOT EXISTS public.admin_page_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  page_key TEXT NOT NULL,
  granted_by UUID,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, page_key)
);

ALTER TABLE public.admin_page_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage page permissions
CREATE POLICY "Admins manage page permissions"
ON public.admin_page_permissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view their own permissions (so the UI can decide what to show)
CREATE POLICY "Users view their own page permissions"
ON public.admin_page_permissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Helper to check page access (admin always allowed)
CREATE OR REPLACE FUNCTION public.has_page_access(_user_id UUID, _page_key TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(_user_id, 'admin')
    OR EXISTS (
      SELECT 1 FROM public.admin_page_permissions
      WHERE user_id = _user_id AND page_key = _page_key
    );
$$;

-- Allow admins to view all profiles for the user-management UI
-- (existing policy already covers this via has_role admin)

-- Allow admins to view user_roles for any user (for management UI)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Admins can view all user roles'
  ) THEN
    CREATE POLICY "Admins can view all user roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Admins can manage user roles'
  ) THEN
    CREATE POLICY "Admins can manage user roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;