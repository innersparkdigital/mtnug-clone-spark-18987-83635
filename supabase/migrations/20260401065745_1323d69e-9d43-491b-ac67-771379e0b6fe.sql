
-- Create trainings table
CREATE TABLE public.trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  session_focus TEXT[] DEFAULT '{}',
  target_audience TEXT NOT NULL DEFAULT '',
  facilitator_name TEXT NOT NULL DEFAULT 'Faith Wambui',
  facilitator_title TEXT NOT NULL DEFAULT 'Counselling Psychologist, InnerSpark Africa',
  training_date TIMESTAMPTZ NOT NULL,
  end_time TEXT DEFAULT '11:00AM',
  flier_image_url TEXT,
  meeting_link TEXT,
  meeting_password TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create training registrations table
CREATE TABLE public.training_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES public.trainings(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organisation TEXT,
  position TEXT,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can view active trainings
CREATE POLICY "Anyone can view trainings" ON public.trainings
  FOR SELECT USING (true);

-- Anyone can register for trainings
CREATE POLICY "Anyone can register for trainings" ON public.training_registrations
  FOR INSERT WITH CHECK (true);

-- Admins can manage trainings
CREATE POLICY "Admins can manage trainings" ON public.trainings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can view registrations
CREATE POLICY "Admins can view registrations" ON public.training_registrations
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert the first training
INSERT INTO public.trainings (title, description, session_focus, target_audience, facilitator_name, facilitator_title, training_date, end_time, flier_image_url, meeting_link, meeting_password)
VALUES (
  'Wellness Talk – Mental Resilience & Wellbeing',
  'Join InnerSpark Africa for a free 1-hour virtual wellness talk designed specifically for journalists and media professionals. Journalists often work under pressure, tight deadlines, and are exposed to difficult or traumatic events. This session will provide practical tools to help you manage stress and protect your mental wellbeing.',
  ARRAY['Managing stress in high-pressure media environments', 'Coping with trauma exposure', 'Building emotional resilience'],
  'Uganda Journalists Association',
  'Faith Wambui Chege',
  'Counselling Psychologist, InnerSpark Africa',
  '2026-04-04 10:00:00+03',
  '11:00AM',
  '/images/trainings/wellness-talk-uja.jpg',
  'https://meet.google.com/uky-toye-uwb',
  NULL
);
