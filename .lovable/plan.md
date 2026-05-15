
# Phase 4 Mega-Build — Execution Plan

This is ~5 phases of work in one prompt. To keep it shippable and avoid breaking the working flows you listed under "DO NOT CHANGE", I'll execute in waves and check in between waves. Each wave below is independently shippable.

## Wave 1 — Admin: Therapist Management + Per-Question View (Areas 1A, 1B)

**1A — Therapists tab in admin dashboard**
- Migration: new `therapists` table (name, email, phone, photo_url, specialisations[], qualification, license_number, licensing_body, years_experience, bio, languages[], session_types[], availability[], license_status, platform_status, session_count, rating, suspension_reason, suspension_review_date, removed_at). RLS: admin-only manage; public read of `platform_status='active'`. Storage bucket `therapist-photos` (public).
- New admin section component with list table + Add/Edit side panel + Suspend/Remove confirmation modals.
- Note: session_count and rating start at 0 (no session/rating tables wired yet — we'll show real numbers when those exist; placeholder bookings table integration deferred).

**1B — Per-question expandable rows on Company → Employees tab**
- Reuse existing `PerQuestionEmployeeBreakdown` component (already built).
- Add chevron-expand rows in the Employees table on `CorporateAdmin`.
- Add "Understanding Your Results" legend box (Healthy/At Risk/Critical) at the top of the tab.

## Wave 2 — Admin: Report Builder Sync + Mini Bakeries Insights (Areas 1C, 1D)

**1C — Report Builder fix**
- Audit `corporate_reports` write path. Make Preview, PDF, and Email all read from the same record (no draft/send split).
- Fix `companyReportPdf.ts` to render all 10 sections in order from the saved record.
- Update HR email template to include sections A, B (text table), D, G, H, I, J + top-3 flagged questions from C. Embed risk legend in section B.
- Send button: disabled until A, H, I, J marked complete. Show checklist.
- Replace Send with "Report Sent — [date]" after send. Add Resend button requiring "RESEND" confirmation.

**1D — Mini Bakeries insights**
- Diagnose company_id linkage between `corporate_companies` and `corporate_screenings`/`corporate_employees`.
- Fix Analytics tab queries; add proper empty-state UI.
- Verify 14 May 2026 data renders.

## Wave 3 — Language + Field-Data Screening Improvements (Areas 2, 3)

**Area 2 — Language selector on corporate screening**
- Top-of-page selector (English / Luganda / Kiswahili) before consent.
- Translation: use existing `translate` edge function (already in project) instead of adding `GOOGLE_TRANSLATE_API_KEY` — saves a secret and a build step. Cache translations client-side.
- Per-question 🔊 audio assist via Web Speech API.
- Emoji visual scale (😞→😄) when non-English selected.
- Persist language in session + save to `corporate_screenings.language` (new column).
- Results page/email in selected language. HR dashboard stays English.

**Area 3 — Field-data improvements**
- `?mode=community` URL param: rename "screening" → "Wellbeing Check" in display only.
- Myths dismissal card before consent in community mode.
- Airtime incentive confirmation: add `participation_incentive_ugx` to `corporate_companies`; show in confirmation when set.
- Offline PWA: register service worker, cache assessment shell, queue submissions in localStorage, sync on reconnect.
- Facilitator view `?facilitator=true&campaign=[code]` with live participation counter (30s polling).

## Wave 4 — Missing Pages (Area 4)

Build in order, all new files, no impact on existing routes:
1. `/whisper` — anonymous message form. Reuse existing `submit-whisper` edge function. Add crisis keyword detection client-side that flags as `CRISIS_LEVEL_1` and triggers existing crisis alert path.
2. `/app` — Google Play live + Apple App Store live (per your final note, updating from "coming soon"). Hero, features 2×2, stats, screenshots carousel, download CTA + QR.
3. `/online-therapy` — already exists at `src/pages/OnlineTherapy.tsx`; rebuild per spec (hero, 3 steps, why, therapist preview grid pulling first 4 from specialists, pricing, trust signals).
4. `/support-groups` — already exists; rebuild per spec (5 placeholder groups, how-to-join, pricing).
5. `/events` — already exists as `EventsTraining.tsx`; rebuild per spec at `/events` route (filters, grid, past events, request form, sponsor CTA). Request form posts via existing contact submission flow + `info@innersparkafrica.com` forward.

## Technical notes

- Skipping Google Cloud Translate secret in favor of existing `translate` edge function.
- Apple App Store: per your final note ("our app is live under play store and apple store"), I'll add live App Store links. **Need URL** — if not provided, I'll add a placeholder `https://apps.apple.com/app/innerspark` and you can swap.
- iOS link memory note (`AppComingSoon`) will be updated to reflect live status.
- Therapist `session_count` / `rating` will display 0 until a sessions/ratings system is wired (out of scope here).

## Proposed execution

Given the size, I recommend I ship **Wave 1 first**, you verify, then I proceed to Wave 2, etc. Reply "go" to start Wave 1, or specify a different starting wave / different ordering.

**Questions before I start:**
1. Apple App Store URL for `/app` page? (Or use placeholder)
2. For therapist photos — is a 2MB public bucket OK?
3. For language translations — OK to use existing `translate` edge function (no new Google Translate key needed)?
