# Corporate Wellbeing Dashboard — setup

## URL
`/corporate-dashboard`

## 1. Run SQL in Supabase
Open **SQL Editor** → New query → paste and **Run** the full file:

`supabase/migrations/20260922122000_corporate_hr_full_schema.sql`

This creates:
- `corporate_companies`, `corporate_employees`, `corporate_screenings`
- `corporate_hr_admins`, `corporate_hr_service_requests`, `corporate_trainings`
- RLS so HR **cannot** read individual screenings
- `get_company_hr_dashboard_stats()` — aggregates only, min group = 5

## 2. Create HR login (Auth)
Authentication → Users → Add user  
Email e.g. `hr@yourcompany.com` + temporary password  
Copy the new user’s **UUID**.

## 3. Seed a demo company (above privacy threshold)
```sql
-- Company
INSERT INTO public.corporate_companies (id, name, industry, country, employee_count, context_notes)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Demo Co Ltd',
  'Technology',
  'Uganda',
  40,
  'Q3 delivery peak and a recent team restructure.'
);

-- Link HR admin (replace USER_UUID)
INSERT INTO public.corporate_hr_admins (company_id, user_id, full_name, email, must_change_password, is_active)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'USER_UUID',
  'HR Admin',
  'hr@yourcompany.com',
  true,
  true
);

-- 12 employees + screens (above min 5)
INSERT INTO public.corporate_employees (id, company_id, employee_code, department)
SELECT gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'E' || g, 'Ops'
FROM generate_series(1, 12) g;

INSERT INTO public.corporate_screenings (
  company_id, employee_id, who5_percentage, total_score, wellbeing_category, workplace_responses, completed_at
)
SELECT
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  e.id,
  (40 + (random() * 50))::int,
  (10 + (random() * 25))::int,
  (ARRAY['green','yellow','red'])[1 + floor(random()*3)::int],
  jsonb_build_object(
    'q1', (1 + floor(random()*5))::int,
    'q2', (1 + floor(random()*4))::int,
    'q3', (1 + floor(random()*5))::int,
    'q4', (1 + floor(random()*3))::int,
    'q5', (1 + floor(random()*5))::int
  ),
  now() - (random() * interval '20 days')
FROM public.corporate_employees e
WHERE e.company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Optional training row
INSERT INTO public.corporate_trainings (company_id, title, module_code, scheduled_at, status, attendees_count)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'S.P.A.R.K Resilience',
  'SPARK_RESILIENCE',
  now() + interval '14 days',
  'scheduled',
  25
);
```

## 4. Privacy threshold test (below 5)
```sql
DELETE FROM public.corporate_screenings
WHERE company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  AND id NOT IN (
    SELECT id FROM public.corporate_screenings
    WHERE company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    LIMIT 3
  );
```
Dashboard should show: **Not enough responses yet to show this breakdown while protecting individual privacy.**

## 5. Acceptance checklist
- [ ] Consent blocks dashboard until accepted
- [ ] ≥5 screens → risk bars, WHO-5 trend, drivers, recommendations
- [ ] <5 screens → privacy hold message (no charts)
- [ ] No employee names/scores in any HR view
- [ ] Request screening/training notifies InnerSpark team

## 6. Publish app
Deploy / Publish so `/corporate-dashboard` is live (Lovable Publish or GitHub → host).
