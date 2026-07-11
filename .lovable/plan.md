# Therapist & Client dashboards — calm redesign + recurring scheduling

Muted indigo accent, warm off-white base, dark mode toggle, plus a new "assign this tool on a recurring schedule" feature that surfaces as a daily calendar in the client's space and a weekly adherence preview for the therapist.

---

## Stage 1 — Global design tokens (foundation)

**`src/index.css`** — new palette:

- Light: warm off-white base (`--background: 40 33% 98%` ≈ #FAF9F7), warm neutral cards (`--card: 0 0% 100%`), muted-indigo primary (`--primary: 232 30% 56%` ≈ #6B6FB5), deeper indigo hover (#3F4A8A), soft warm border (`--border: 30 15% 90%`).
- Dark: warm charcoal (`--background: 240 8% 10%` ≈ #16161B, not pure black), slightly-elevated card (`--card: 240 8% 14%`), desaturated indigo primary (`--primary: 232 35% 68%`) so it doesn't glare, WCAG-AA text contrast.
- New shadow tokens: `--shadow-soft` (`0 1px 2px rgba(20,20,30,0.04), 0 4px 16px rgba(20,20,30,0.06)`) and `--shadow-lift` (used on hover).
- New motion tokens: `--ease-calm: cubic-bezier(0.22, 1, 0.36, 1)`, `--dur-calm: 200ms`.
- Utility `.card-calm` — replaces the raw shadcn card border/box on the two dashboards only, so the rest of the site is unaffected.
- Utility `.hover-lift` — `translateY(-2px)` + shadow bump on hover, respects `prefers-reduced-motion`.

**`tailwind.config.ts`** — add `card-calm`, `surface-warm`, `surface-cool` background tokens mapped to the CSS variables so the redesigned components stay in the token system.

**`src/contexts/ThemeContext.tsx`** (new) — light/dark/system, persisted in `localStorage` under `innerspark-theme`, applies `.dark` on `<html>`. Small, no dependency. Wired into `App.tsx` above the router.

**`src/components/ThemeToggle.tsx`** (new) — sun/moon icon button, mounted in the therapist header and the client `/my-progress` header only (does not touch the marketing site).

---

## Stage 2 — Client dashboard ("My Space") redesign

Rewrite `src/pages/ClientPortal.tsx` around three sections:

1. **Greeting block** — time-of-day salutation (Good morning / afternoon / evening) + first name + a rotating short line from a small `CLIENT_ENCOURAGEMENTS` array (7–10 lines, seeded by `new Date().getDay()` so it's stable within the day). Never mentions overdue items. Language check: only warm, opt-in phrasing.
2. **Today strip** (Mon–Sun week bar, today highlighted with a filled indigo pill, other days with soft dots showing tool count). Tapping a day filters the tool list below to that day. Rendered from the new `assignment_schedules` table (see Stage 4). If no schedules exist yet, the strip is hidden and the flow degrades gracefully to the current list.
3. **Tool cards** — new `ClientToolCard` component. Each card: tool-specific Lucide icon in a soft indigo tile, title, one-line description, optional therapist note as a quoted subline, due-date chip only when a real due date is set (soft amber only if overdue by >24h), completed state = faded card + subtle check + "Done today" text (no badge/streak). Uses `.card-calm` + `.hover-lift`.
4. **Therapist note card** — warmer treatment: `bg-primary/8`, small quote-mark icon top-left, italic body, "— {therapist name}" attribution line.
5. **Catch-up section** — soft, collapsible, appears only when there are missed scheduled items from the last 3 days. Header: "Whenever you're ready". Same card styling, no red, no counters. Auto-hides after 3 days.
6. **Library tab** — segmented control at the top: `Today` / `All tools`. `All tools` shows every assigned tool (current behaviour, unfiltered).
7. **Motion** — page fade-in 200ms, cards stagger 40ms via CSS `animation-delay`, no bouncing.

---

## Stage 3 — Therapist dashboard redesign

Rewrite `src/components/therapist/ClientRoster.tsx` and `src/pages/TherapistPortal.tsx`:

1. **Header** — greeting ("Good afternoon, Dr. …"), `ThemeToggle`, sign-out.
2. **"Needs attention" strip** — top of the page, appears only when at least one exists: clients with overdue scheduled tools OR unresolved safety alerts OR no activity in 7+ days. Each entry is a small pill-card with the client's first name + reason + "Open →". Soft amber background, never red unless there is an unresolved safety alert.
3. **Stat cards row** — 5 cards using existing `Total / Contacted / Booked / Completed / Paid` numbers but restyled as `.card-calm` with a small Lucide icon + a subtle "vs last week" delta arrow (`ArrowUp`/`ArrowDown`/`Minus`) computed from data already loaded. Icons: `Users`, `MessageCircle`, `CalendarCheck`, `CheckCircle2`, `Wallet`.
4. **Commission panel** — visually separated: `bg-surface-warm` (a warm cream in light, subtly-warmer charcoal in dark), left-border accent, its own heading "Financial". Same content as today, just visually pulled apart from the client area.
5. **Client cards** — replaces the current row list. Each client is a `.card-calm` showing: name, contact chip, status line (`3 tools active · 1 overdue` computed from `assignment_tools` + `assignment_schedules`), last-activity relative time. Two actions on the right: `Copy link` (secondary/ghost) and `New assignment` (primary — visually dominant, indigo). A small 7-day compact adherence preview (7 dots, filled = completed on that day) sits under the name; hover shows a tooltip per day.
6. **Motion** — page fade + stagger identical to client side.

---

## Stage 4 — Recurring scheduling feature (end-to-end)

**New DB table** — `assignment_schedules`:

```
id                  uuid pk
assignment_tool_id  uuid fk → assignment_tools (cascade)
client_id           uuid fk → therapist_clients (cascade)
frequency           text check in ('one_time','daily','weekly','custom')
days_of_week        int[]           -- 0=Sun … 6=Sat, used when frequency='custom' or 'weekly'
time_of_day         time            -- optional, e.g. 20:00 for "Evening reflection"
start_date          date not null
end_date            date            -- null = ongoing
timezone            text default 'Africa/Nairobi'
created_at, updated_at
```

- Grants for `authenticated` + `service_role` (no `anon` — always token- or auth-scoped).
- RLS:
  - Therapist can `SELECT/INSERT/UPDATE/DELETE` schedules for their own clients (via `is_client_therapist`).
  - Anonymous client-portal reads go through a new `SECURITY DEFINER` RPC (`client_snapshot` gets extended, no direct table read).
- `updated_at` trigger uses existing `update_updated_at_column()`.

**New RPCs**:

- `create_assignment_schedule(_assignment_tool_id, _frequency, _days_of_week, _time_of_day, _start_date, _end_date)` — validates therapist ownership, inserts row.
- `delete_assignment_schedule(_id)` — therapist-scoped.
- `client_snapshot` extended to include `schedules` per tool AND a computed `today_tool_ids` + `catchup_tool_ids` array (last 3 days of missed scheduled instances, excluding items already completed today).

**Therapist UI** — extend `AssignmentBuilder`:

- After the existing per-tool config block, add a **"Schedule"** subsection:
  - Radio: `Just once` (default, current behaviour — no schedule row created) / `Daily` / `Weekly` (pick weekdays) / `Custom` (day-picker).
  - Optional `Time of day` (`<input type="time">`).
  - `Start date` (defaults to today) / `End date` (blank = ongoing).
- On save, after `create_client_assignment` succeeds, iterate over selected tools and, for any with a non-`once` schedule, call `create_assignment_schedule` for the newly-created `assignment_tool_id`. The RPC returns tool IDs so we can map.

**Client UI** — driven by the extended `client_snapshot`:

- Week strip reads `schedules` + submission history to compute per-day status (`scheduled`, `completed`, `missed`).
- "Today" filter uses `today_tool_ids`.
- Catch-up section uses `catchup_tool_ids`.

**Therapist adherence preview** — the 7-day dot strip on each client card is a lightweight aggregate: count of scheduled-and-completed vs scheduled-and-missed per day for the last 7 days, using the same RPC output (new RPC: `therapist_adherence_preview(_therapist_id)` returning `{ client_id, days: [{date, scheduled, completed}] }`).

---

## What is intentionally NOT changed

- Marketing site, blog, Kenya funnel, admin dashboard visuals — untouched. Tokens only apply where the new `.card-calm` / `.hover-lift` classes are used (client portal + therapist portal + `AssignmentBuilder`).
- The 11 existing tool components (SessionReflectionTool, ThoughtRecordTool, etc.) are untouched — they inherit token colors automatically.
- No new gamification, streaks, badges, or push nudges. Ever. Per the design principle.
- Fonts unchanged (Plus Jakarta Sans + Inter is already warm enough).

---

## Rough file map

New: `src/contexts/ThemeContext.tsx`, `src/components/ThemeToggle.tsx`, `src/components/client-portal/WeekStrip.tsx`, `src/components/client-portal/ClientToolCard.tsx`, `src/components/client-portal/GreetingBlock.tsx`, `src/components/therapist/NeedsAttentionStrip.tsx`, `src/components/therapist/TherapistStatCards.tsx`, `src/components/therapist/ClientCard.tsx`, `src/components/therapist/ScheduleFields.tsx`, `src/lib/clientEncouragements.ts`, `src/lib/toolIcons.ts`.

Modified: `src/index.css`, `tailwind.config.ts`, `src/App.tsx` (ThemeProvider), `src/pages/ClientPortal.tsx`, `src/pages/TherapistPortal.tsx`, `src/components/therapist/ClientRoster.tsx`, `src/components/therapist/AssignmentBuilder.tsx`.

DB: 1 migration — `assignment_schedules` table + `create_assignment_schedule` / `delete_assignment_schedule` RPCs + extended `client_snapshot` + `therapist_adherence_preview`.

---

## Order of operations when you approve

1. Migration (schedules table + RPCs).
2. Design tokens + ThemeContext + toggle.
3. Client portal redesign consuming extended snapshot.
4. Therapist portal redesign + adherence preview.
5. Schedule fields inside the assignment builder.
6. Manual smoke: create client → open builder → schedule daily + weekly + one-time → open client portal → verify week strip, today filter, catch-up, and completed states in both themes.

Ready to build this exactly as scoped — say the word.
