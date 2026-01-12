-- Add is_admin column to profiles table for admin access
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update the existing user to be an admin for testing
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'ec08f3b1-7415-4f19-8d07-31cfd4ba068f';

-- Create RLS policy for admins to view all enrollments and progress
CREATE POLICY "Admins can view all course enrollments"
ON public.course_enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can view all lesson progress"
ON public.lesson_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Create policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);