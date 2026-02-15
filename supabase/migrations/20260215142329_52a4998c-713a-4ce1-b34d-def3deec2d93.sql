
-- Insert Nicole Ngetich
INSERT INTO public.specialists (name, type, bio, education, certifications, specialties, languages, country, experience_years, price_per_hour, available_options, is_active)
VALUES (
  'Mary Nicole Cheruto Ngetich',
  'counselor',
  'Nicole is a Registered Psychologist and Professional Counsellor with over 6 years of clinical experience in child, adolescent, and family therapy. She is the Founder of The Empathy Place in Nairobi, where she provides integrative, evidence-based psychotherapy grounded in emotional safety, relational attunement, and compassion. Her work focuses heavily on adolescent emotional development, teen mental wellness, and strengthening parent-teen relationships. Nicole is also certified in Chemical Dependency and integrates addiction-informed care into her therapeutic practice.',
  'Bachelor of Arts in Psychology – United States International University – Africa (2019, GPA 3.90); Certificate in Chemical Dependency – United States International University – Africa (2019)',
  ARRAY['Registered Psychologist – Kenya', 'Certified in Chemical Dependency Counselling'],
  ARRAY['Child & Adolescent', 'Teen Mental Wellness', 'Family Therapy', 'Psychological Assessment', 'Chemical Dependency', 'Crisis Intervention', 'Employee Wellness', 'Group Therapy'],
  ARRAY['English', 'Kiswahili'],
  'Kenya',
  6,
  75000,
  ARRAY['voice', 'video'],
  true
);

-- Insert Anna Mary Namigo
INSERT INTO public.specialists (name, type, bio, education, certifications, specialties, languages, country, experience_years, price_per_hour, available_options, is_active)
VALUES (
  'Namigo Anna Mary',
  'counselor',
  'Anna Mary is a Psychosocial Support Practitioner with 3–5 years of professional experience supporting children, youth, and adults facing emotional, social, and psychological challenges. Her work focuses on trauma support, grief counselling, mentorship, life skills development, and community mental health awareness. She has experience providing one-on-one counselling, facilitating peer support groups, mentoring young people, and conducting mental health awareness workshops. Her background in social work strengthens her ability to integrate counselling with child protection, family support, and community-based interventions.',
  'Diploma in Social Work and Social Administration – Nkumba University (2022–2024); Diploma in Mental Health – Aliso Empower Yourself (2024–2025); Certificate in Social Work and Social Administration – Uganda Catholic Management & Training Institute (2019–2021); Bachelor in Child Protection and Development – University of Kisubi (Ongoing)',
  ARRAY[]::text[],
  ARRAY['Child & Adolescent', 'Trauma & Emotional Support', 'Grief Counselling', 'Youth Mentorship', 'Family Support', 'Gender-Based Violence', 'Life Skills', 'Crisis Intervention', 'Community Mental Health'],
  ARRAY['English', 'Luganda', 'Runyankole', 'Lusoga'],
  'Uganda',
  3,
  75000,
  ARRAY['voice', 'video'],
  true
);

-- Insert Mary Evelyn Abio
INSERT INTO public.specialists (name, type, bio, education, certifications, specialties, languages, country, experience_years, price_per_hour, available_options, is_active)
VALUES (
  'Abio Mary Evelyn',
  'counselor',
  'Mary Evelyn is a Counselling Psychologist with 6–10 years of professional experience in mental health, HIV/AIDS psychosocial care, and child & adolescent counselling. She holds a Master of Mental Health Counselling Psychology from Uganda Martyrs University and completed her internship at Butabika National Referral Mental Hospital. Her practice integrates child protection, adolescent counselling, trauma-informed care, and psychosocial support. She is particularly passionate about working with vulnerable children and young people, empowering them with resilience skills, emotional regulation strategies, and supportive therapeutic relationships.',
  'Master of Mental Health Counselling Psychology – Uganda Martyrs University (2025); Certificate in Child Protection – Makerere University; Certificate in Child & Adolescent Counselling – TASO College of Health Sciences; Bachelor''s Degree in Administrative & Secretarial Science – Kyambogo University',
  ARRAY[]::text[],
  ARRAY['Child & Adolescent', 'Trauma & Emotional Support', 'HIV/AIDS Psychosocial Support', 'ART Adherence', 'Gender-Based Violence', 'Community Mental Health', 'Crisis Intervention', 'Peer Support'],
  ARRAY['English', 'Luganda', 'Ateso'],
  'Uganda',
  6,
  75000,
  ARRAY['voice', 'video'],
  true
);

-- Insert availability for Nicole (Mon-Sat 9-19)
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, d, '09:00', '19:00', true FROM public.specialists, generate_series(1, 6) AS d WHERE name = 'Mary Nicole Cheruto Ngetich';

-- Insert availability for Anna Mary (Mon=1, Wed=3, Thu=4, Fri=5, Sun=0)
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, d, '09:00', '16:00', true FROM public.specialists, unnest(ARRAY[0, 1, 3, 4, 5]) AS d WHERE name = 'Namigo Anna Mary';

-- Insert availability for Mary Evelyn (Mon-Thu 9-12)
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, d, '09:00', '12:00', true FROM public.specialists, generate_series(1, 4) AS d WHERE name = 'Abio Mary Evelyn';
