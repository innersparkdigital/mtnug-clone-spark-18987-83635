INSERT INTO public.specialists (
  name, type, bio, experience_years, price_per_hour, specialties, languages, country, is_active, available_options, education, certifications
) VALUES (
  'Atibuni Simon',
  'Clinical Psychologist',
  'Simon is a Clinical Psychologist (MSc Candidate) with experience in individual and group counselling, psychometrics, and faith-integrated psychosocial support. He completed his internship under supervision at Butabika National Referral Mental Hospital. His approach integrates clinical assessment, active listening, evidence-based counselling techniques, and culturally sensitive support to help families restore communication, strengthen bonds, and resolve conflicts constructively.',
  3,
  50000,
  ARRAY['Couples Therapy & Conflict Resolution', 'Family Systems Counselling', 'Premarital & Marital Counselling', 'Communication & Relationship Skills', 'Emotional Regulation in Relationships', 'Faith-Informed Counselling', 'Psychometric Assessment', 'Suicide Prevention Awareness'],
  ARRAY['English'],
  'Uganda',
  true,
  ARRAY['Virtual Therapy', 'Chat Therapy'],
  'MSc Clinical Psychology and Counselling (Expected 2026); BA Philosophy – St. Thomas Aquinas National Major Seminary; Diploma in Social Sciences',
  ARRAY['Member – African Suicide Prevention Association (ASPA)']
);

-- Add availability: Monday-Thursday 8:00-12:00
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '08:00', '12:00', true
FROM public.specialists, unnest(ARRAY[1,2,3,4]) AS day
WHERE name = 'Atibuni Simon';