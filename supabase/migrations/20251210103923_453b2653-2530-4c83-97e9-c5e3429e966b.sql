-- Create specialists table
CREATE TABLE public.specialists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('therapist', 'psychotherapist', 'counselor')),
  experience_years INTEGER NOT NULL DEFAULT 1,
  price_per_hour INTEGER NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  available_options TEXT[] NOT NULL DEFAULT '{"voice", "video"}',
  bio TEXT,
  education TEXT,
  certifications TEXT[],
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create specialist reviews table
CREATE TABLE public.specialist_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID NOT NULL REFERENCES public.specialists(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create specialist availability table
CREATE TABLE public.specialist_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID NOT NULL REFERENCES public.specialists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(specialist_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialist_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialist_availability ENABLE ROW LEVEL SECURITY;

-- Specialists are publicly viewable
CREATE POLICY "Anyone can view active specialists"
ON public.specialists
FOR SELECT
USING (is_active = true);

-- Reviews are publicly viewable
CREATE POLICY "Anyone can view reviews"
ON public.specialist_reviews
FOR SELECT
USING (true);

-- Anyone can submit reviews
CREATE POLICY "Anyone can submit reviews"
ON public.specialist_reviews
FOR INSERT
WITH CHECK (true);

-- Availability is publicly viewable
CREATE POLICY "Anyone can view availability"
ON public.specialist_availability
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX idx_specialists_type ON public.specialists(type);
CREATE INDEX idx_specialists_is_active ON public.specialists(is_active);
CREATE INDEX idx_specialist_reviews_specialist_id ON public.specialist_reviews(specialist_id);
CREATE INDEX idx_specialist_availability_specialist_id ON public.specialist_availability(specialist_id);

-- Insert sample specialists data
INSERT INTO public.specialists (name, type, experience_years, price_per_hour, specialties, languages, bio, education, certifications) VALUES
('Dr. Sarah Nakamya', 'therapist', 8, 100000, ARRAY['Anxiety', 'Depression', 'Trauma', 'Relationship Issues', 'Workplace Mental Health'], ARRAY['English', 'Luganda'], 'Dr. Sarah Nakamya is a licensed clinical psychologist with over 8 years of experience helping individuals navigate complex emotional challenges. She specializes in evidence-based therapies including CBT and EMDR for trauma recovery.', 'PhD in Clinical Psychology, Makerere University', ARRAY['Licensed Clinical Psychologist', 'EMDR Certified', 'CBT Specialist']),
('James Okello', 'counselor', 5, 75000, ARRAY['Grief', 'Family Therapy', 'Addiction', 'Stress Management'], ARRAY['English', 'Luo'], 'James is a compassionate counselor dedicated to helping families and individuals overcome grief, addiction, and stress. He creates a safe, non-judgmental space for healing and growth.', 'Masters in Counseling Psychology, Kyambogo University', ARRAY['Certified Grief Counselor', 'Family Therapy Specialist']),
('Dr. Grace Tumusiime', 'psychotherapist', 12, 150000, ARRAY['PTSD', 'Bipolar Disorder', 'Schizophrenia', 'Personality Disorders', 'Clinical Assessment'], ARRAY['English', 'Runyankole'], 'Dr. Grace is a senior psychotherapist with extensive experience in treating complex mental health conditions. She combines traditional psychotherapy with modern approaches for comprehensive care.', 'MD, Psychiatry Specialization, Mbarara University', ARRAY['Board Certified Psychiatrist', 'Trauma-Informed Care Specialist']),
('Emmanuel Wasswa', 'therapist', 6, 80000, ARRAY['Depression', 'Self-Esteem', 'Life Transitions', 'Career Counseling'], ARRAY['English', 'Luganda', 'Swahili'], 'Emmanuel helps clients navigate life transitions, build self-esteem, and overcome depression. His warm, empathetic approach creates lasting positive change.', 'Masters in Psychology, Uganda Christian University', ARRAY['Certified Life Coach', 'Depression Specialist']),
('Dr. Amina Hassan', 'psychotherapist', 10, 120000, ARRAY['Anxiety Disorders', 'OCD', 'Eating Disorders', 'Trauma Recovery'], ARRAY['English', 'Arabic'], 'Dr. Amina specializes in anxiety disorders and eating disorders, using a combination of CBT and mindfulness-based approaches to help clients achieve lasting recovery.', 'PhD in Clinical Psychology, University of Nairobi', ARRAY['Anxiety Disorders Specialist', 'Eating Disorder Certified']),
('Patricia Namutebi', 'counselor', 4, 60000, ARRAY['Relationship Issues', 'Pre-Marital Counseling', 'Couples Therapy', 'Communication'], ARRAY['English', 'Luganda'], 'Patricia is passionate about helping couples and individuals build stronger, healthier relationships through improved communication and understanding.', 'Bachelor in Social Work, Makerere University', ARRAY['Relationship Counselor', 'Pre-Marital Specialist']);

-- Insert sample availability (Mon-Fri 9am-5pm for all)
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time)
SELECT s.id, d.day, '09:00'::TIME, '17:00'::TIME
FROM public.specialists s
CROSS JOIN (SELECT generate_series(1, 5) as day) d;

-- Insert sample reviews
INSERT INTO public.specialist_reviews (specialist_id, reviewer_name, rating, comment, is_verified)
SELECT 
  s.id,
  CASE (random() * 5)::int 
    WHEN 0 THEN 'Anonymous Client'
    WHEN 1 THEN 'John M.'
    WHEN 2 THEN 'Sarah K.'
    WHEN 3 THEN 'David O.'
    ELSE 'Mary N.'
  END,
  4 + (random())::int,
  CASE (random() * 4)::int
    WHEN 0 THEN 'Very professional and understanding. Helped me through a difficult time.'
    WHEN 1 THEN 'Excellent therapist! I felt heard and supported throughout my sessions.'
    WHEN 2 THEN 'Highly recommend. The sessions have been transformative for my mental health.'
    WHEN 3 THEN 'Compassionate and knowledgeable. Made me feel comfortable from the first session.'
    ELSE 'Great experience. Very insightful and helpful advice.'
  END,
  (random() > 0.5)
FROM public.specialists s
CROSS JOIN generate_series(1, 3);