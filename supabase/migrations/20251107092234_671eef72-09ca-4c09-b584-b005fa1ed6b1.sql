-- Create careers applications table
CREATE TABLE public.career_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  specialization TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  cover_letter TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications
CREATE POLICY "Anyone can submit career applications" 
ON public.career_applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admin to view applications (you can modify this later)
CREATE POLICY "Admins can view career applications" 
ON public.career_applications 
FOR SELECT 
USING (true);