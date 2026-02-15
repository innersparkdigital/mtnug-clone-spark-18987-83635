
-- Insert Barbara Mugambe
INSERT INTO public.specialists (name, type, bio, education, certifications, specialties, languages, country, experience_years, price_per_hour, available_options, is_active)
VALUES (
  'Nampiima Barbara Mugambe',
  'Clinical Psychologist',
  'Barbara is a Clinical Psychologist with over 5 years of experience in trauma-informed therapy, child and adolescent mental health, and behavioral interventions. She holds a Bachelor''s degree in Organizational Psychology and is completing a Master of Science in Clinical Psychology at Makerere University (Expected 2026). She has worked in clinical and humanitarian settings including Butabika Mental Hospital and Africa Humanitarian Action (AHA) Uganda, delivering psychotherapy to refugees, children, adolescents, and families experiencing PTSD, depression, and anxiety. Barbara integrates Narrative Exposure Therapy (NET), Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and trauma-informed somatic approaches to help clients regulate emotions, process trauma, and develop resilience.',
  'Master of Science in Clinical Psychology – Makerere University (Expected January 2026), Bachelor of Organizational Psychology – Makerere University (2021)',
  ARRAY['Certificate in Narrative Exposure Therapy (VIVO International, 2024)', 'Certificate in Acceptance & Commitment Therapy (Dr. Russ Harris)', 'Certificate in Life Coaching & Wellness (2019)'],
  ARRAY['Depression & Anxiety Disorders', 'Trauma & PTSD Recovery', 'Emotional Regulation & Behavioral Therapy', 'Child & Adolescent Mental Health', 'Family Psychoeducation', 'Refugee & Humanitarian Mental Health', 'Suicide Prevention & Mental Health Literacy', 'Employee Assistance & Workplace Mental Health'],
  ARRAY['English'],
  'Uganda',
  5,
  75000,
  ARRAY['voice', 'video', 'chat'],
  true
);

-- Insert availability: Tue-Fri 12:00-17:00
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '12:00', '17:00', true
FROM public.specialists, unnest(ARRAY[2,3,4,5]) AS day
WHERE name = 'Nampiima Barbara Mugambe';
