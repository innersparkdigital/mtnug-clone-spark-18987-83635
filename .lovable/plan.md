# Therapist + Client Dashboard UI/UX Overhaul

Improve the existing `/therapist` and `/my-progress/[token]` dashboards. This is a redesign on top of the current data model — no schema changes required (we already have `assignment_schedules`, `tool_submissions`, `safety_alerts`, and the `client_snapshot` + `therapist_client_overview` RPCs).

## 1. Design system (both dashboards)

Extend the existing `.calm-theme` tokens in `src/index.css` to match the exact palette:

- Light: bg `#F8F9FF`, surface `#FFFFFF`, primary `#3B4FD4`, navy `#0F1035`, success `#2E7D5E`, amber `#D97706`, danger `#C0392B`, text `#1A1A2E` / `#555555`, border `#E5E7EB`.
- Dark: bg `#0D0F1A`, surface `#1A1D2E`, primary `#5B6EE8`, text `#F1F5F9` / `#94A3B8`, borders `rgba(255,255,255,0.08)`.
- Card standard: `border-radius: 16px`, `padding: 20px 24px`, shadow `0 2px 16px rgba(59,79,212,0.07)`, hover lift `translateY(-2px)` + `0 6px 24px rgba(59,79,212,0.14)`, 0.25s ease.
- Typography: Inter (already imported alongside Plus Jakarta) — use Inter 600/700 headings, 400 body, 500 labels with `letter-spacing: 0.02em`.
- Dark toggle already exists (`CalmThemeToggle`) — keep floating top-right, persist via existing localStorage.

Add utility classes: `.stat-card`, `.stat-accent-blue|teal|green|red`, `.gradient-header`, `.milestone-card`.

## 2. Therapist dashboard (`/therapist`)

Update `TherapistPortal.tsx` and `components/therapist/ClientRoster.tsx`.

**Welcome header** — gradient `linear-gradient(135deg,#3B4FD4,#0F1035)` with dynamic greeting: `Good morning, {name}. You have {sessionsToday} sessions today and {newSubmissions} clients with new submissions.` Compute from `therapist_client_overview` (submissions in last 24h).

**Stat row** (4 cards, left border-accent 4px):
1. Total active clients
2. Sessions this month (count of `tool_submissions` — placeholder proxy)
3. Homework completion rate (completed / assigned this month) with small SVG ring
4. Safety flags this week (red when >0)

**Client grid** (2-col desktop, 1-col mobile): each card shows avatar initials, name + presenting concern, last submission date, 7-day mood sparkline (Chart.js line, no axes), homework badge (`2/3 done` colored), risk dot (red/amber/green: red = open safety alert or PHQ-9 severe; amber = overdue tools; green = otherwise), `View full analysis` button. Sort red → amber → green.

**Client detail panel** — new file `components/therapist/ClientDetailPanel.tsx`, right-slide `Sheet` (shadcn), 5 tabs:
- **Overview**: identity + risk badge + key numbers + auto-generated pre-session summary paragraph.
- **Tool responses**: per-tool renderers reading from `tool_submissions.payload`:
  - Thought record table
  - Emotion diary horizontal timeline
  - Homework checklist with expandable reflections
  - PHQ-9 / GAD-7 heat map (CSS grid, dates × questions, green→red)
  - Goals progress bars
  - Event scoring line chart
- **Mood trend**: Chart.js line, 30/60/90 toggle, 7-day moving average, session date verticals.
- **Screening scores**: PHQ-9, GAD-7, PCL-5 line charts with severity zone backgrounds.
- **Assign & schedule**: reuse existing `AssignmentBuilder` + `ScheduleFields`, add reminder time + "Show on client calendar" toggle.

## 3. Client dashboard (`/my-progress/[token]`)

Update `pages/ClientPortal.tsx` using existing `GreetingBlock`, `WeekStrip`, `ClientToolCard`.

**Greeting**: time-of-day + task-aware copy per spec (already partially in `clientEncouragements.ts` — extend for task-aware branch).

**Today's task calendar**: keep `WeekStrip`, when a day is tapped show task cards with tool icon, due time, status pill (Not started / In progress / Completed), est. time ("About 3 minutes" from tool metadata), Begin button.

**My Progress** (new `components/client-portal/ProgressAnalytics.tsx`):
- Mood trend 30-day line with gradient fill + auto sentence.
- Homework completion ring (animated fill from 0).
- Gentle check-in card ("You have checked in 8 times this month…") — no streak scolding.
- Latest PHQ-9 / GAD-7 with warm delta sentence.
- Goal progress bars.

**My Journey** (new `components/client-portal/MilestoneTimeline.tsx`): vertical timeline of milestones derived client-side from submissions (first session, first check-in, PHQ-9 threshold crossings, goals done, cumulative check-ins). Tap → open a share modal that renders a milestone card to canvas via `html2canvas` (already a dep from certificates) and offers download + `navigator.share`. Card contains only milestone text + date + InnerSpark logo + tagline.

## 4. Technical

- Charts: `chart.js` + `react-chartjs-2` (add deps).
- Heat map: CSS grid, no library.
- Animations: keep existing framer-motion; new fades ≤0.4s.
- Dark mode: extend existing `.calm-theme` + `.calm-dark` variables — no separate stylesheets.
- Mobile: verify at 360px, stacked layouts, sparklines 60px tall.
- Privacy: RPCs already scope by therapist / token; share card only writes text + date to canvas.
- Language: strip any streak-scold copy; use nudge-tone throughout.

## Files touched

```text
src/index.css                                     tokens + card utilities
src/pages/TherapistPortal.tsx                     header + stats + toggle placement
src/components/therapist/ClientRoster.tsx         grid card redesign + risk sort
src/components/therapist/ClientDetailPanel.tsx    NEW right-slide analytics
src/components/therapist/tools/*.tsx              NEW per-tool renderers + heatmap
src/components/therapist/MoodTrendChart.tsx       NEW
src/components/therapist/ScreeningChart.tsx       NEW
src/pages/ClientPortal.tsx                        wire progress + journey
src/components/client-portal/ProgressAnalytics.tsx NEW
src/components/client-portal/MilestoneTimeline.tsx NEW
src/components/client-portal/ShareMilestoneCard.tsx NEW
src/lib/clientEncouragements.ts                   task-aware branch
package.json                                      + chart.js react-chartjs-2
```

## Out of scope

- No DB schema changes (existing tables cover it).
- No new RPCs (existing `client_snapshot` + `therapist_client_overview` provide the data; anything extra is computed client-side from `tool_submissions`).
- No changes to the marketing site theme — stays scoped under `.calm-theme`.

Confirm and I'll build it in one pass.
