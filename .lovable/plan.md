# Phase 2 — Client Assignment & Client Portal

Big feature. To keep this shippable and safe (per your Reagan-approval note on the Safety Check-in), I'll break Phase 2 into three sub-phases and land them one message each. This plan covers all three so you can approve the whole shape now.

## Sub-phase 2A — Foundation (ships first)

**Database (migration)**

- Extend `assignment_tools` to store per-tool config: `tool_key`, `title` (therapist override), `therapist_note`, `due_date`, `config jsonb` (e.g. homework steps, PHQ-9 variant, goal steps, activity grid template).
- Extend `tool_submissions` with `submission_type` (`draft` | `final`), `mood_score`, `screening_score`, `screening_severity`, `safety_flag bool`, `payload jsonb`, `client_note`. Auto-save writes drafts; submit flips to final.
- New table `safety_alerts` (already scaffolded — add `severity` `low`|`medium`|`red`, `crisis_message_shown bool`, `resolved_by`, `resolved_at`).
- RPC `save_tool_submission(_token, _tool_id, _payload, _final)` — SECURITY DEFINER, token-scoped, no direct anon writes to tables.
- RPC `client_snapshot(_token)` — returns client + therapist + active assignment + tools + latest submissions in one call.
- RLS: token access strictly through the two RPCs. Direct table access remains therapist/admin only. GRANTs on every new/changed table for `authenticated` + `service_role`.

**Therapist portal — assignment builder** (`/therapist`)

- Client roster: add-client form (name, email, phone, presenting concern) → generates `access_token`, shows a copy-link + "Send invite" button.
- "New assignment" wizard on a client:
  1. Pick tools from the 12 (checkboxes with descriptions).
  2. Per-tool config panel (homework tasks, goal steps, PHQ-9/GAD-7/PCL-5 selector, activity template, etc.).
  3. Personal note (rich text) + due date defaults.
  4. Review + send. Emails the client via `send-transactional-email` with the `client-assignment-invite` template (I'll add it).

**Client portal** (`/my-progress/:token`)

- Full-screen, app-shell layout (same treatment as Whisper — `fixed inset-0`, safe-area padded, no site chrome).
- First visit: passcode set (min 6 chars), stored hashed via RPC. Later visits: passcode required.
- 30-min idle timeout, auto-lock back to passcode.
- Warm welcome header: client first name, therapist name, personal note, tool cards (assigned only).
- Persistent quiet footer on every screen: **Need support now? 📞 0800 212 121 (free) or open Amani in the app.**
- Auto-save every 30s to `tool_submissions` as draft; explicit "Save" flips to final and timestamps.

**Build-order override**: I'll ship Sub-phase 2A with **Tool 8 (Session Reflection) and Tool 12 (Safety Check-in)** first, exactly as you specified. Reagan sign-off gate applied — Tool 12 wording ships as you wrote it, and I'll flag it in the release note for his review before we announce it to clients.

## Sub-phase 2B — Core CBT tools

Ships next message after 2A is approved.

- Tool 1 — Thought Recording Worksheet (6 steps, emotion dropdown + intensity slider, before/after rating).
- Tool 2 — Homework Tracker (therapist-set tasks, status toggle, per-task reflection, blockers field).
- Tool 3 — Emotion & Trigger Diary (multi-select emotions with per-emotion intensity, situation → thought → behaviour → coping → outcome).

## Sub-phase 2C — Remaining tools + screening + safety wiring

- Tool 4 — Activity Scheduling (Mon–Sun × Morning/Afternoon/Evening grid, per-slot status + note, weekly reflection).
- Tool 5 — Event/Situation Scoring (0–100 slider with auto severity label, per-situation history line graph via recharts).
- Tool 6 — Goal Setting & Tracking (therapist-defined goal + steps, client tick + notes, blockers).
- Tool 7 — Relaxation Toolbox (audio card w/ play + helpfulness rating, written technique card, affirmation card with paced reveal). Audio files stored in `content-media` bucket.
- Tool 9 — PHQ-9 / GAD-7 / PCL-5 (validated items, one question per screen, progress bar, plain-language result, recharts trend). **Clinical thresholds** → PHQ-9 ≥15, GAD-7 ≥15, PCL-5 ≥33 auto-fires alert.
- Tool 10 — Strengths & Gratitude Journal.
- Tool 11 — Self-Care Tracker (sleep hours + quality, water, exercise, medication, mood emoji).

**Safety-alert wiring (finalised in 2C)**

- Tool 12 answers or a low mood on Tool 11 → new edge function `fire-safety-alert` inserts into `safety_alerts` and emails Reagan + assigned therapist via `send-transactional-email` with a new `safety-alert-clinical` template.
- WhatsApp deep-link included in the email body (`https://wa.me/<therapist_phone>?text=...`).
- Africa's Talking SMS deferred to Phase 4 as previously agreed; if you want SMS sooner, say the word and I'll ask you to add the AT connector before 2C ships.
- Red alerts hide all other tools in the client portal until an admin/therapist clears `resolved` via the admin UI.

## Technical details

- Auto-save uses debounced RPC call (500ms after last edit + 30s heartbeat) that upserts on `(assignment_tool_id, submission_type='draft')`.
- Screening scoring lives client-side for immediate feedback but is re-computed server-side inside `save_tool_submission` for trust; the `severity` and `safety_flag` fields are authoritative from the server.
- Charts use `recharts` (already in the project).
- Client portal is React Router route `/my-progress/:token` registered in `App.tsx`; no auth guard, all access via token + passcode RPC.
- Emails: two new templates (`client-assignment-invite`, `safety-alert-clinical`) registered in `registry.ts`.

## Out of scope this phase (per your notes)

- Africa's Talking SMS → Phase 4.
- Pre-session summary cron → Phase 4.
- Admin oversight analytics tab → Phase 5.

## What I need from you

Approve this plan and I'll ship **Sub-phase 2A** in the next message (schema + RPCs + assignment builder + client portal shell + Tool 8 + Tool 12). Then confirm 2A visually, and I'll roll straight into 2B and 2C.
