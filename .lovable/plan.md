# Admin Dashboard + Therapist Portal Wrap-up

This is additive. Nothing existing is removed. The safety check-in flow stays untouched. All new views use the existing Calm design system (deep-blue theme, 16px radius cards, Inter, InnerSpark blue `#3B4FD4`, dark mode toggle).

---

## Part A — Finish previous turn (Improvements 1 email reminders + calendar)

### A1. Weekly calendar view on Client Portal
- New `src/components/client-portal/WeeklyCalendarView.tsx`: 7-day strip + day detail with due tasks grouped by date, using existing `assignment_schedules` data. Replaces the flat list on `/my-progress/[id]`, keeps unscheduled tasks in a secondary section.
- No change to submission or safety logic.

### A2. Email reminders (Resend, already integrated)
- New edge function `send-task-reminders/index.ts`:
  - **Hourly**: sends "Your task is due today" email for assignments whose scheduled time falls in the next hour and haven't been completed.
  - **Sunday 6pm**: sends a "Week ahead" summary listing the coming week's tasks.
- Cron via `pg_cron` (hourly + weekly). Logs to existing `client_reminder_log` table.

---

## Part B — Admin Improvement 1: UI restructure

Reskin `src/pages/AdminDashboard.tsx` shell only (tabs stay):

- Personalised header: "Good morning, {firstName} 👋 Here is your InnerSpark overview for today." (time-of-day aware).
- 6 stat cards in 2 rows of 3 (spec said 8 items across 2 rows of 3 — we'll ship 6 as written and add the extra 2 as a third row):
  1. Active clients · 2. Sessions this week · 3. Revenue this week (UGX)
  4. Safety flags active (red if >0) · 5. Therapists active · 6. Homework completion %
  7. New enquiries today · 8. Inactive clients 7d+ (amber)
- Each card: left color border, icon top-left, big number, label, WoW trend arrow.
- 4 large section cards below (Clients, Therapists, Session Logs, Analytics) each with a live one-liner ("3 clients need follow-up").
- Reuse existing tabs — the cards just deep-link to them.

---

## Part C — Admin Improvement 2: Read-only client view

New `src/components/admin/AdminClientsTab.tsx`:
- Table across **all** clients (all therapists): name, therapist, concern, last submission, risk dot, homework %, next session, View.
- Filters: therapist, risk level, last activity, concern. Quick "Show all Red flags" chip.
- View opens `AdminClientDetailPanel.tsx` — a read-only wrapper around the existing `ClientDetailPanel` tabs (Overview, Submissions, Screening, Pre-Session, Schedule, Sessions). All edit/reaction/assign controls hidden via a `readOnly` prop.
- New RPC `admin_list_all_clients()` (SECURITY DEFINER, admin-only) so admin bypasses per-therapist RLS safely.

---

## Part D — Admin Improvement 3: Session Logs dashboard

New `src/components/admin/SessionLogsTab.tsx`:
- Real-time table via Supabase Realtime on `therapist_session_feedback`.
- Columns per spec (timestamp, session date, therapist, client, new/returning, service, duration, progress, homework Y/N, next appt Y/N, next date, View).
- 3 summary cards: sessions this month · % with next appt (retention) · crisis protocol count (red).
- Filters: therapist, date range, progress status, next-appt booked.
- **Crisis alert**: DB trigger on `therapist_session_feedback` insert — when `progress_status` in ('At risk','Crisis protocol activated'), invokes `send-crisis-alert` edge function → emails Reagan + Raymond via Resend and inserts into `safety_alerts`.
- **Missing-logs Monday cron**: new edge function `send-missing-log-reminders` scheduled 8am Monday Africa/Nairobi. Compares bookings vs submitted logs, WhatsApp-message text is generated and admin gets a click-to-send list (we don't have programmatic outbound WhatsApp; we surface the pre-filled `wa.me` links in-dashboard + email Raymond the list). Explicit note in UI.
- CSV export.

---

## Part E — Admin Improvement 4: Advanced features

1. **Revenue tab** (`AdminRevenueTab.tsx`): Chart.js weekly bars + table per therapist (sessions, revenue, 15% commission, 85% earnings). CSV export. Data source: existing `payments` + `therapist_session_feedback`.
2. **Therapist performance** (`TherapistPerformanceTab.tsx`): card grid, sortable by any metric (clients, sessions/mo, avg progress, homework rate, follow-up rate, retention).
3. **Client journey timeline**: added as a new tab inside `AdminClientDetailPanel` — chronological merge of enquiries, sessions, submissions, screenings, safety flags.
4. **Enquiries tab** (`EnquiriesTab.tsx`): unified feed of `chat_leads` (Amani), `contact_submissions`, WhatsApp callback requests. Columns per spec, source/outcome/date filters, conversion funnel summary at top.
5. **Bulk WhatsApp outreach**: button in Clients tab → composer modal with pre-filled template, per-client personalisation, generates a list of `wa.me` deep-links (admin clicks each, or copies all). Logs sends to `client_reminder_log`.
6. **CSV export**: shared `exportToCSV(rows, filename)` util wired into every tab's toolbar.

---

## Database migration (single file)

- `admin_list_all_clients()` RPC (SECURITY DEFINER, admin-only).
- Trigger `notify_admin_on_crisis_session()` on `therapist_session_feedback` after insert.
- pg_cron schedules for hourly task reminders, Sunday summary, Monday missing-logs.
- Extend `client_reminder_log` if needed (add `channel`, `kind`).

## Edge functions

- `send-task-reminders` (hourly + weekly modes)
- `send-crisis-alert` (called by trigger via `pg_net`)
- `send-missing-log-reminders` (Monday 8am)

All use Resend (already configured, `RESEND_API_KEY` set) and the existing branded email templates.

## What I'm **not** doing (out of scope / not supported)

- Programmatic outbound WhatsApp send — InnerSpark uses `wa.me` deep-links, no WhatsApp Business API. Bulk outreach and missing-log reminders surface pre-filled links + email digests instead.
- No changes to safety check-in tool.
- No change to existing therapist edit permissions.

## Order of execution

1. DB migration (RPC + trigger + cron).
2. Edge functions (task reminders, crisis alert, missing-log reminders).
3. Calendar view on client portal.
4. Admin dashboard shell restructure (stat cards + section cards).
5. Read-only client view + admin detail panel.
6. Session Logs tab.
7. Revenue + Therapist Performance + Enquiries + Bulk outreach + CSV util.

Reply **proceed** and I'll ship it in that order.
