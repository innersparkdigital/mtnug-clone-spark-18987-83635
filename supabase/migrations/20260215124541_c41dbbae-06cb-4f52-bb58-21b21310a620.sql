
-- Insert Tuhaise Angella Kansiime
INSERT INTO public.specialists (name, type, experience_years, price_per_hour, specialties, languages, available_options, bio, education, certifications, country, is_active)
VALUES (
  'Tuhaise Angella Kansiime',
  'Addiction / Substance Abuse Specialist',
  1,
  75000,
  ARRAY['Addiction', 'Substance Abuse', 'Psychosocial Support', 'Behavioral Change & Rehabilitation', 'Youth & Young Adult Mental Health', 'Emotional Regulation & Coping Skills', 'Social Work & Case Management'],
  ARRAY['English', 'Luganda'],
  ARRAY['voice', 'video'],
  'Angella is a compassionate and emerging clinical counselling professional with a strong academic foundation in social work and addiction-focused mental health care. She has practical clinical exposure from Butabika National Mental Referral Hospital, where she supported individuals facing substance use disorders and other mental health challenges. Her approach integrates medically assisted therapy principles, psychosocial support, and client-centered counselling techniques.',
  'Master of Clinical Counselling Psychology (MCPC) – University of Kisubi (Pending – 2025), Bachelor of Social Work and Social Administration (BSWASA) – Uganda Christian University (2023), Certificate Level 1 in Special Cookery – YWCA (2024)',
  ARRAY['Training on Specialized and Contextualized Care & Treatment of Addiction using MAT & Psychosocial Support (2025)', 'Internship – Butabika National Mental Referral Hospital (2025)', 'Internship – Ministry of Finance, Planning & Economic Development (2022)', '13th International East Africa Psychology Conference (2025)', '12th International East Africa Psychology Conference (2024)', '3rd Mental Health Conference (2024)', 'Uganda Counselling Association Student Symposium (2024)', 'Asia Youth International MUN Virtual Conference (2024)'],
  'Uganda',
  true
);

-- Insert Akugizibwe Julius
INSERT INTO public.specialists (name, type, experience_years, price_per_hour, specialties, languages, available_options, bio, education, certifications, country, is_active)
VALUES (
  'Akugizibwe Julius',
  'Addiction / Substance Abuse Specialist',
  4,
  75000,
  ARRAY['Addiction', 'Substance Abuse', 'Trauma & Emotional Regulation', 'Relapse Prevention & Recovery Planning', 'Family Therapy & Reintegration Support', 'Youth & School Counseling', 'Crisis Intervention', 'HIV/AIDS Psychosocial Support', 'Behavioral Change Interventions'],
  ARRAY['English', 'Luganda'],
  ARRAY['voice', 'video'],
  'Julius is a results-oriented counselor and psychosocial support practitioner with over four years of experience working with individuals affected by substance use disorders, trauma, and emotional distress. He currently serves as an Addiction Psychotherapist at a rehabilitation center in Kampala, where he designs individualized treatment plans, facilitates relapse prevention programs, and supports family reintegration processes.',
  'Bachelor''s Degree in Community Psychology – Makerere University (CGPA 4.45), Certificate in Public Policy, Education & Research – Future Africa Fellowship (2023–2024)',
  ARRAY['Certificate in HIV/AIDS Counseling', 'Certificate in Holistic Counseling', 'Certificate in Developmental Counseling', 'Certificate in Effective Counseling', 'Certificate in Project Planning & Management', 'Certificate in Leadership & Classroom Pedagogy', 'Certificate in Research & Youth Empowerment', 'Certificate in Leadership, Civic Participation & Project Planning'],
  'Uganda',
  true
);

-- Insert Nabulya Immaculate
INSERT INTO public.specialists (name, type, experience_years, price_per_hour, specialties, languages, available_options, bio, education, certifications, country, is_active)
VALUES (
  'Nabulya Immaculate',
  'Addiction / Substance Abuse Specialist',
  8,
  75000,
  ARRAY['Addiction', 'Substance Abuse', 'Medication Assisted Therapy (MAT)', 'Harm Reduction & HIV Prevention', 'Relapse Prevention & Recovery Support', 'Trauma-Informed Care', 'Family Reintegration & Therapy', 'Psychosocial Support for Key Populations', 'ART Adherence Counseling', 'Group Therapy & Peer Support Facilitation'],
  ARRAY['English', 'Luganda'],
  ARRAY['voice', 'video'],
  'Immaculate is a highly experienced Counselling Psychologist with over eight years of post-qualification experience in addiction treatment, medication-assisted therapy (MAT), and psychosocial rehabilitation. She has worked extensively within Butabika National Mental Referral Hospital''s MAT program, supporting individuals with substance use disorders, HIV, trauma-related conditions, and co-occurring mental health challenges. She specializes in addiction recovery, relapse prevention, harm reduction programming, and family reintegration.',
  'Master''s Degree in Counselling Psychology – Kyambogo University (2019–2024), Bachelor''s Degree in Social Work & Community Development – Kyambogo University (2014–2017)',
  ARRAY['National Trainer in Medication Assisted Therapy (MAT) – Mbale Regional Referral Hospital', 'South-to-South Learning Exchange – Kenya MAT Clinics Benchmarking', 'Integrated HIV, STI & ART Service Delivery Training', 'Continuous Quality Improvement (CQI) & Mentorship in Key Population Programming'],
  'Uganda',
  true
);

-- Insert Enock Nyaanga Omwanza
INSERT INTO public.specialists (name, type, experience_years, price_per_hour, specialties, languages, available_options, bio, education, certifications, country, is_active)
VALUES (
  'Enock Nyaanga Omwanza',
  'Addiction / Substance Abuse Specialist',
  4,
  75000,
  ARRAY['Addiction', 'Substance Abuse', 'Relapse Prevention & Recovery Planning', 'Group Therapy (A.A Step Work Model)', 'Family Reintegration & Recovery Support', 'Crisis Intervention', 'HIV Testing & Counseling', 'Community Mental Health Outreach', 'Behavioral Change & Psychoeducation'],
  ARRAY['English', 'Kiswahili'],
  ARRAY['voice', 'video'],
  'Enock is a licensed Counselling Psychologist and addiction specialist with over 4 years of professional experience in substance use rehabilitation, community mental health, and behavioral recovery programs. He has worked across multiple rehabilitation centers in Kenya, supporting individuals battling alcohol and drug dependency through structured recovery plans, A.A step work programs, relapse prevention strategies, and family reintegration support.',
  'Bachelor of Arts in Psychology (Second Class Honors) – Kenyatta University (2021)',
  ARRAY['Licensed by the Counselors and Psychologists Board (Kenya) – 2025', 'Certificate – International Society of Substance Use Professionals (2023)', 'Certificate – Kenya Counseling and Psychological Association (2023)', 'Certificate – HIV Testing & Counseling in HIV Prevention Services (2023)', 'Certificate – Adherence Counseling (2022)', 'Certificate – Psychological First Aid (Irish Red Cross, 2025)', 'Certificate – Advocacy for Digital Health Justice (Afya na Haki Institute, 2025)'],
  'Kenya',
  true
);

-- Now insert availability for all 4

-- Tuhaise Angella: Mon-Fri 9AM-4PM
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '09:00', '16:00', true
FROM public.specialists, unnest(ARRAY[1,2,3,4,5]) AS day
WHERE name = 'Tuhaise Angella Kansiime';

-- Akugizibwe Julius: Wed, Sat, Sun 12PM-9PM
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '12:00', '21:00', true
FROM public.specialists, unnest(ARRAY[3,6,0]) AS day
WHERE name = 'Akugizibwe Julius';

-- Nabulya Immaculate: Mon-Sat 12PM-9PM
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '12:00', '21:00', true
FROM public.specialists, unnest(ARRAY[1,2,3,4,5,6]) AS day
WHERE name = 'Nabulya Immaculate';

-- Enock Nyaanga: Mon-Fri 8AM-12PM
INSERT INTO public.specialist_availability (specialist_id, day_of_week, start_time, end_time, is_available)
SELECT id, day, '08:00', '12:00', true
FROM public.specialists, unnest(ARRAY[1,2,3,4,5]) AS day
WHERE name = 'Enock Nyaanga Omwanza';
