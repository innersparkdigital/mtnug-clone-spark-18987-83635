# Per-Question Intelligence Layer — Corporate Wellbeing Screening

The existing 8-question flow stays intact. We add a single source-of-truth intelligence module, store richer per-question data, and rebuild the results / HR / internal admin views to read from it. Nothing is removed.

## 1. Single source of truth: `QUESTION_INTELLIGENCE`

New file `src/lib/wellbeingIntelligence.ts`:
- Object keyed `q1..q8`: `text`, `domain` (`who5` | `workplace`), `reverseScored` (true for q8), `flagName`, criticality (q5 special), per-band interpretation (4 bands), individual recommendation, company recommendation, recommended InnerSpark service slug.
- Helpers:
  - `computeAnswers(rawAnswers: number[])` → per-q `{ rawAnswer, effectiveScore, percentageScore, flagged, criticalFlag }` (applies q8 reversal, q5 criticality).
  - `computeAggregate(answers)` → `who5Score`, `workplaceScore`, `overallScore`, `riskCategory` (`healthy ≥70`, `at_risk 40–69`, `critical <40`), `triggeredFlags`, `triggeredClusters` (BURNOUT / ANXIETY / DEPRESSION_RISK), `crisisAlertRequired`, `crisisAlertLevel` (1 severe, 2 urgent, 3 monitor).
  - `priorityAreas(answers)` → 2–3 lowest %.
  - `nextSteps(flags)` → service routing (Q1/Q5→therapy, Q2/Q8→stress/group, Q3/Q4→meditation/burnout, Q6/Q7→workplace+therapy).
  - `companyAggregate(records)` → per-q averages, flag counts, clusters (≥3 employees), risk distribution, recommended service package, 30-day plan template.

## 2. Database (additive, non-breaking)

New migration:
- Add columns to `corporate_screenings`: `per_question jsonb` (the 8-entry detail), `triggered_flags text[]`, `triggered_clusters text[]`, `crisis_alert_level int`, `risk_category text` (parallel to existing `wellbeing_category`).
- New table `corporate_crisis_alerts`: `id`, `company_id`, `employee_id`, `screening_id`, `level int`, `triggers text[]`, `status text default 'pending'` (pending|contacted|resolved), `notes`, `created_at`, `updated_at`. Admin-only RLS (insert allowed for anon to fire from screening submit; select/update admin only).

Existing `total_score`, `who5_*`, `workplace_responses`, `wellbeing_category` continue to be written as today.

## 3. Submission flow update (`CorporateWellbeingCheck.tsx`)

- After collecting raw answers, run `computeAnswers` + `computeAggregate`.
- Insert into `corporate_screenings` with the new fields plus existing fields.
- If `crisisAlertRequired`, also insert into `corporate_crisis_alerts` (independent try/catch so it fires even if the report email fails).
- Pass the rich result object into the results view.

## 4. Employee results page (same route, redesigned)

Sections in order:
- 2.5s "Analysing your responses…" loader.
- Big overall % + risk label + trend vs previous (already partly built).
- **Priority areas** card: 2–3 lowest questions with question text + recommendation excerpt.
- **Per-question breakdown**: 8 cards each showing question, plain-English answer label, score `x/5 (y%)`, mini bar, clinical meaning, personalised recommendation, soft amber/red highlight when flagged. Never shows internal flag names.
- **Recommended next steps**: 1–3 service buttons (deep-link to therapy / support groups / meditations / etc.).
- Existing "Get a copy by email" + "Talk to someone" CTA preserved.

## 5. HR admin (`CorporateAdmin.tsx`) — new view per company

Add a "Triggers & Insights" tab/section at the top of the company detail:
- Triggers dashboard: ranked flags with count, plain language, recommended service, productivity-cost estimate (`affectedEmployees * 1.25 days/month` placeholder constant).
- Per-question company averages with GREEN/AMBER/RED badge + company recommendation for AMBER/RED.
- Cluster analysis card (BURNOUT / ANXIETY / DEPRESSION_RISK) when ≥3 employees match.
- Recommended service package + "Request this service" button (writes to existing `corporate_service_interests`).
- Auto-generated 30-day action plan (week 1–4) from template, editable consultant notes preserved.
- Employee list keeps overall score only (no per-question breakdown for HR).

## 6. InnerSpark internal admin

In existing admin dashboard add a "Crisis Alerts" tab (`src/components/admin/` new `CorporateCrisisAlertsTab.tsx`):
- Queue of `corporate_crisis_alerts` ordered by level then created_at.
- Shows employee anonymous code (last 6 of employee id), company name, triggers, age, status.
- Status update buttons (pending → contacted → resolved) with note field.
- Internal-only per-employee per-question detail viewer (admin role required).

## 7. UI / behavioural rules

- All copy lives in `wellbeingIntelligence.ts`. Components import and render — no hardcoded interpretations.
- Q8 reversal happens once inside `computeAnswers`; downstream code never sees raw Q8.
- Crisis alert insert is wrapped in its own promise; report failures cannot block it.
- Employee UI never renders `FLAG_*` strings; HR/internal UIs do.

## 8. Files

Created:
- `src/lib/wellbeingIntelligence.ts`
- `src/components/wellbeing/EmployeeResultsBreakdown.tsx`
- `src/components/business/CompanyTriggersDashboard.tsx`
- `src/components/business/CompanyClusterAnalysis.tsx`
- `src/components/business/CompanyActionPlan.tsx`
- `src/components/admin/CorporateCrisisAlertsTab.tsx`
- One Supabase migration for the new columns + `corporate_crisis_alerts` table + RLS.

Edited:
- `src/pages/CorporateWellbeingCheck.tsx` (submit + results section).
- `src/pages/CorporateAdmin.tsx` (insert new sections at top of company detail; pull `per_question`).
- `src/pages/AdminDashboard.tsx` (register Crisis Alerts tab).

## 9. Out of scope (explicit)

- Email template redesign — current `b2b-employee-results` keeps working; we pass the new fields as additional `templateData` for a later template update.
- No removal of existing `wellbeing_category` / `total_score` / consultant notes flow.
- Productivity-cost number is a transparent placeholder constant; no payroll integration.

Once approved I will run the migration and ship the code in one pass.
