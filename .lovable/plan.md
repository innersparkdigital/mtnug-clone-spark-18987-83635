## Therapist Portal Improvements — Implementation Plan

Five additive improvements to `/therapist` and `/my-progress/[token]`. Existing safety-alert flow (Reagan/Raymond) stays untouched — every new tool routes final submissions through the same `save_tool_submission` RPC that already fires safety alerts.

---

### 1. Client calendar with daily tasks + Resend reminders

**Client portal (`ClientPortal.tsx`)**
- Replace flat task list with a `WeeklyCalendarView` component:
  - 7-day grid (Mon–Sun), week nav arrows, "This week" reset
  - Each cell renders `ClientToolCard`s scheduled that day, derived from `assignment_schedules` (existing table) expanded per-day
  - Status pill: not started (grey) / in progress (blue) / completed (green ✓)
  - Today's cards get `ring-2 ring-primary/50` glow
  - Day header shows "Day complete 💙" when all cards done
- Keep existing "unscheduled tasks" section below

**Reminders (Resend)**
- New edge function `send-client-reminders` (cron, every 15 min):
  - Finds `assignment_schedules` rows where next occurrence is within 55–65 min and not yet reminded today (new table `client_reminder_log(assignment_tool_id, client_id, sent_for_date, kind)`)
  - Sends "You have something waiting for you today 💙" via Resend to `therapist_clients.email`
  - Deep-links to `/my-progress/[token]`
- New edge function `send-weekly-summary` (cron, Sunday 18:00 Africa/Nairobi): one email per client with next 7 days of scheduled tasks

---

### 2. Session feedback per client (therapist → admin)

**New table** `therapist_session_feedback` with fields from the Google Sheet: session_date, therapist_id, client_id, is_new_client, service_delivered, duration, homework_given, homework_text, progress_status (enum), next_appt_booked, next_appt_date, next_appt_service, notes. RLS: therapist owns their rows, admin reads all.

**Therapist portal**
- New "Session log" tab inside `ClientDetailPanel` with:
  - "Log session" form (auto-fills therapist + client name)
  - History table of prior sessions for this client
- Roster: summary chip per client showing "Last session: X" and progress status color

**Admin dashboard**
- New tab `SessionFeedbackTab` with filters (therapist / date / progress status) and per-client summary cards (total sessions, last date, current status, next appt booked)

---

### 3. Custom questions tool (recurring optional)

- New tool key `custom-questions` in `WELLBEING_TOOLS`
- `AssignmentBuilder`: when selected, therapist adds N questions with response type (text / scale 1-10 / yes-no / multiple choice with options); stored in `assignment_tools.config.questions`
- Recurring via existing `assignment_schedules` (already supports weekly + days_of_week)
- Client portal: renders form dynamically from config; submits through existing `save_tool_submission` (safety-alert path preserved)
- Therapist view: `PrettyResponseList` extended to render custom-question submissions grouped per question with a mini trend line for scale/yes-no responses over time
- Recurring reminder emails piggyback on Improvement 1's `send-client-reminders`

---

### 4. Therapist reactions + short encouragement note

**New table** `submission_reactions(submission_id, therapist_id, emoji, note text ≤100, created_at)` with RLS: therapist writes own, client reads reactions on their submissions via token RPC.

**Therapist**: reaction bar (💙 ⭐ 💪 🌟 🙏) + 100-char note field below each submission in `ClientDetailPanel`.

**Client**: reactions rendered under each submission in a soft blue box: "[Therapist] reacted to your [tool] 💙" + optional note. On new reaction, edge function sends Resend email "Your therapist saw your work 💙".

**RPC** `add_submission_reaction(_submission_id, _emoji, _note)` — SECURITY DEFINER, verifies therapist owns the client, enqueues email.

---

### 5. Three new tools

Added to `WELLBEING_TOOLS` catalog with icons and short descriptions; each is a new component under `src/components/client-portal/tools/`:

- **CognitiveReframing.tsx** — 4 text fields + 1-10 scale ("how do you feel now")
- **LifeSkillsPractice.tsx** — therapist sets skill in assignment config; client answers tried (yes/partly/no) + 3 text fields
- **SupportNetwork.tsx** — 3 trusted people, support description, pulling-away field, reconnect step; next occurrence shows "how did the step go"

All submit through `save_tool_submission` → safety flags still trigger Reagan/Raymond alerts unchanged.

Applicability shown as small hint chips in `AssignmentBuilder` per tool ("Best for: anxiety, low self-esteem, trauma…").

---

### Technical section

**DB migrations (one file):**
- `therapist_session_feedback` table + progress_status enum + RLS + GRANTs + updated_at trigger
- `submission_reactions` table + RLS + GRANTs
- `client_reminder_log` table (dedupe key: `(assignment_tool_id, sent_for_date, kind)` unique)
- RPCs: `add_submission_reaction`, `log_session_feedback`, `get_client_reactions_by_token`
- Extend `client_snapshot` RPC to return reactions per submission
- Extend `WELLBEING_TOOLS` catalog

**Edge functions (new):**
- `send-client-reminders` (cron */15 min) — Resend
- `send-weekly-summary` (cron Sun 18:00) — Resend
- Reactions email uses existing `send-transactional-email` with new template `client-reaction-notice`

**Cron:** two `cron.schedule` calls added (using `supabase--insert`, not migration, per instructions).

**Files touched:**
- `src/pages/ClientPortal.tsx` (calendar view)
- `src/components/client-portal/WeeklyCalendarView.tsx` (new)
- `src/components/client-portal/tools/{CognitiveReframing,LifeSkillsPractice,SupportNetwork,CustomQuestions}.tsx` (new)
- `src/components/therapist/{AssignmentBuilder,ClientDetailPanel,SessionFeedbackForm,ReactionBar}.tsx`
- `src/components/admin/SessionFeedbackTab.tsx` (new)
- `src/lib/wellbeingToolsCatalog.ts`
- `supabase/functions/send-client-reminders/`, `send-weekly-summary/` (new)
- `supabase/functions/_shared/transactional-email-templates/{client-reminder,weekly-summary,client-reaction-notice}.tsx` (new)

**Safety invariant:** every new tool's client submission goes through `save_tool_submission` unchanged; safety_alert insertion logic and Reagan/Raymond notification remain the sole path — no new tool bypasses it.

Rollout order: DB migration → tool catalog + client components → therapist UI (reactions, session log, custom Qs) → calendar view → email templates + cron → admin tab.