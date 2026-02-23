INSERT INTO public.specialists (
  name, type, bio, experience_years, price_per_hour, specialties, languages, country, is_active, available_options, education, certifications
) VALUES (
  'Odeth Kempogo',
  'Professional Counsellor',
  'Odeth is a Professional Counsellor with 8+ years of experience in mental health, emergency response, and community development programming. Her counselling experience spans youth mentorship, family support, crisis intervention, refugee psychosocial services, and call-centre mental health response under the Ministry of Health. Her approach is empathetic, structured, and solution-focused, helping families and couples navigate conflict, stress, and communication challenges.',
  8,
  50000,
  ARRAY['Couples & Relationship Counselling', 'Family Conflict Resolution', 'Youth & Teen Guidance', 'Emotional Support & Crisis Intervention', 'CBT Techniques', 'Self-Esteem & Resilience Building', 'Psychosocial Support for Vulnerable Families', 'Stress & Anxiety Management'],
  ARRAY['English', 'Luganda', 'Runyankore'],
  'Uganda',
  true,
  ARRAY['Virtual Therapy', 'Chat Therapy'],
  'Bachelor of Guidance and Counselling – Kyambogo University; Postgraduate Diploma in Project Planning & Management – Uganda Management Institute',
  NULL
);

-- Add availability: Monday-Friday 9:00-15:00
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '09:00', '15:00', true
FROM public.specialists, unnest(ARRAY[1,2,3,4,5]) AS day
WHERE name = 'Odeth Kempogo';