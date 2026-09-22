# Corporate Wellbeing Dashboard — complete

## URL
`/corporate-dashboard` — separate from client and therapist portals.

## Done in Supabase

| Item | Status |
|---|---|
| All 6 corporate tables | Live |
| RLS (HR cannot read individual screens) | Live |
| `get_company_hr_dashboard_stats()` | Live (min group = 5) |
| Demo Co Ltd + **12** screens | Seeded |
| Demo S.P.A.R.K training | Seeded |
| Polished HR UI | In GitHub |

Demo company id: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`

## Your last 2 steps

### 1. Link an HR login
Authentication → Users → Add user (e.g. `hr@demo.innerspark.local`) → copy UUID → run:

```sql
INSERT INTO public.corporate_hr_admins (
  company_id, user_id, full_name, email, must_change_password, is_active
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'PASTE-AUTH-USER-UUID-HERE',
  'HR Admin',
  'hr@demo.innerspark.local',
  true,
  true
)
ON CONFLICT (user_id) DO UPDATE SET company_id = EXCLUDED.company_id, is_active = true;
```

### 2. Publish the app
Lovable Publish or deploy GitHub so `/corporate-dashboard` is live.

Then: sign in → set password → accept consent → full dashboard with charts.

## Acceptance
- Consent blocks until accepted
- ≥5 screens → risk, WHO-5 trend, drivers, recommendations
- <5 screens → privacy hold message
- No individual employee data ever shown
- Request form notifies InnerSpark team
