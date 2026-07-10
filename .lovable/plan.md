# Therapist Client Assignment & Progress Tracking

Big feature — I'll build it in phases on top of the existing app (Lovable Cloud + React + Supabase). Nothing existing gets rebuilt; this is additive.

## Scope confirmation

Before I start, two quick calls I'll make unless you say otherwise:

1. **Client accounts:** clients access their assignment via a unique tokenized link + a lightweight passcode (name + password on first visit). This satisfies "does not require existing account" and keeps data private under RLS.
2. **SMS alerts:** safety alerts go out by **email + WhatsApp deep-link to Reagan/therapist immediately**; Africa's Talking SMS will be wired in Phase 4 once you confirm you want us to enable the AT connector and provide credentials.
3. **Domain:** `dashboard.innersparkafrica.com` copy is in the email; you'll point that subdomain to the site separately. Login lives at `/auth` today.

Say the word if you want any of these adjusted.

## Data model (new tables)

- `therapist_profiles` — links `auth.users` → therapist record (name, email, phone, specialisation, `must_change_password`, `is_active`).
- `therapist_clients` — client roster per therapist (name, email, phone, presenting concern, `access_token uuid`, `passcode_hash`).
- `client_assignments` — one per active assignment (therapist_id, client_id, personal_note, created_at, tools jsonb[]).
- `assignment_tools` — one row per selected tool per assignment (tool_key, config e.g. homework text + due date, status).
- `tool_submissions` — client responses (assignment_tool_id, payload jsonb, submitted_at, mood_score, screening_score, safety_flag bool).
- `safety_alerts` — fired on risky safety check-in (client_id, therapist_id, payload, notified_at, resolved).
- `client_activity` — last_seen per client for 7-day inactivity report.

Full RLS: therapist sees only their clients; client (via edge function using token) sees only their assignment; admin sees all via `has_role`. GRANTs to `authenticated` + `service_role` on every table. Anon read only via the token-based edge function, never direct table access.

## Backend (edge functions)

- `admin-create-therapist` — creates auth user, generates temp password, inserts therapist_profile with `must_change_password=true`, sends welcome email via existing `send-transactional-email` (new template `therapist-welcome`).
- `therapist-create-assignment` — validates therapist owns the client, creates assignment + tools, generates client link, sends email (new template `client-assignment-invite`).
- `client-portal` — token-scoped fetch/save for the client-facing page (no auth required beyond token + optional passcode).
- `fire-safety-alert` — triggered by submission with risk indicators; sends email to Reagan + assigned therapist and logs to `safety_alerts`. SMS via Africa's Talking added in Phase 4.
- `generate-presession-summary` — cron 12h before next appointment (deferred to Phase 4).

## Frontend

**Admin (extends existing AdminDashboard):**
- New tab "Therapists" — list, create modal (name/email/phone/specialisation), activate/deactivate, reassign clients.
- New tab "Assignments Overview" — total active assignments, per-therapist completion, safety flags 24h, 7-day inactivity list.

**Therapist dashboard (new area `/therapist`):**
- Forced password change on first login when `must_change_password=true`.
- Client list → client detail → "Create Assignment" checklist of the 14 tools with per-tool config (homework text, due date), personal note field, copy-link button.
- Progress view per client: tool status ticks, submission viewer, mood trend chart, PHQ-9/GAD-7/PCL-5 score trends, safety flag banner.

**Client portal `/my-progress/:token`:**
- Warm welcome screen exactly as you wrote (client name, therapist name, tool cards, personal note, crisis resources).
- Passcode set on first visit → stored hashed; subsequent visits require passcode.
- Renders only assigned tools as friendly forms; autosave; submit; timestamped.
- Fully mobile-first, safe-area padded, no site chrome (same treatment as Whisper).

**Tool components (14):**
Thought record, activity scheduling, event scoring, goals, homework, emotion/trigger diary, relaxation, session reflection, safety check-in (triggers alert), PHQ-9, GAD-7, PCL-5, gratitude/strengths, self-care tracker. Each is a small controlled form saving to `tool_submissions`.

## Emails (new transactional templates)

- `therapist-welcome` — Email 1 copy, InnerSpark branded, temp password inline.
- `client-assignment-invite` — Email 2 copy, list of assigned tool names, unique link, crisis footer.
- `safety-alert-therapist` / `safety-alert-clinical-director` — internal alerts.

## Session timeouts

- Client portal: 30 min idle timeout (localStorage timestamp check).
- Therapist/admin: rely on Supabase session refresh; add explicit sign-out after 8h/4h idle via `AuthContext` timer.

## Build order (phases, one message each unless small)

1. **Phase 1** — DB schema + admin "Add Therapist" + welcome email + forced password change.
2. **Phase 2** — Therapist client roster + assignment creation + unique link + client welcome screen with the 14 tools rendered as forms + client email.
3. **Phase 3** — Submissions viewer on therapist dashboard, mood/screening trends.
4. **Phase 4** — Safety alert system (email + WhatsApp now, Africa's Talking SMS once credentials are in), pre-session summary cron.
5. **Phase 5** — Admin oversight tab (completion rates, 24h flags, 7-day inactivity).

## What I need from you to proceed

Confirm the three scope calls at the top, then I'll ship Phase 1 (migration + admin UI + welcome email) in the next message.
