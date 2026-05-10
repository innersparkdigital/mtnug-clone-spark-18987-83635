## Phase 3 Rebuild — Pages 7-11

This phase covers Blog, For Business, For Professionals, Donate Therapy, and Corporate Wellbeing Check. The Corporate Wellbeing security fix is **first priority** — it ships before any cosmetic work.

---

### PRIORITY 0 — Security fix: Corporate Wellbeing Check (`/corporate-wellbeing-check`)

Before anything else:
- Strip the public page down to: hero + access-code input + reassurance copy + "no access code?" / "for HR managers" sections.
- Move all dashboard rendering (company data, employee names, scores, analytics) behind a successful access-code lookup or admin auth. No company/employee data should render until a valid code is submitted.
- Verify `/corporate-admin` route is gated by `isAdmin` (already enforced via RBAC) — confirm no analytics leak via the public URL.
- Audit RLS on `corporate_employees`, `corporate_screenings`, `corporate_companies` — they already require admin role for SELECT (verified in schema). Confirm no edge function or RPC is leaking the data.
- Update SEO: title + meta + `noindex` on the public access-code page.

---

### Page 7 — Blog (`/blog`)

**Data layer**
- Add a small `BLOG_AUTHORS` map in `src/lib/blogAuthors.ts` mapping each existing slug → `{ name, credentials, photo, specialistSlug, experience }`. Pull names/photos from the `/specialists` directory.
- Add a `BLOG_DATES_OVERRIDE` map to retro-stagger the 11 same-day posts across Dec 2025 → May 2026.

**UI**
- Featured article hero (largest card, monthly rotation by `new Date().getMonth() % posts.length`).
- Geographic tabs: All | Uganda | Kenya | Tanzania | Pan-Africa (filter by a `region` field added to the post map; default existing posts to "Uganda").
- Author byline on each card and at top of each post page (`src/pages/blog/*`).
- Author bio card component `BlogAuthorCard.tsx` rendered at bottom of every post with "Book a session with [name]" CTA.
- Related articles (3) using simple category match.
- WhatsApp + LinkedIn share buttons (extend `SocialShareButtons.tsx` if needed).
- "Write for us" pitch form on `/blog` index → posts to `contact_submissions` with subject `"Blog Pitch"`.

**New posts** (added to `blogPosts` map + corresponding stub pages with full SEO):
1. Mental Health ROI: What East African HR Directors Need to Know
2. Burnout in Uganda's Telecom and Banking Sectors — 2025 Data
3. How to Choose an EAP Provider in Uganda — A Practical Guide for HR
4. Mental Health Support for Kenyan Professionals
5. 5 Signs Your Team Needs a Mental Health Intervention

**SEO**: New title + meta on `/blog`.

---

### Page 8 — For Business (`/for-business`)

- Inline citations on every stat (WHO 2022, Deloitte 2023, ILO 2022, "InnerSpark client programme data 2024–2025").
- Replace empty "Companies Who Benefited" with 2–3 anonymized case study cards.
- Replace generic CTAs with: "Book a Free Discovery Call" / "Get a Free Team Screening" / "See Pricing for My Team Size".
- New **Pricing table** (Screening, S.P.A.R.K, Basic, Standard, Premium, Custom) with UGX + USD.
- New **ROI Calculator** component (input: employee count → output: estimated savings, transparent formula based on ILO 31 days/year × avg daily wage assumption).
- New **S.P.A.R.K™ Framework** visual section.
- New **Onboarding timeline** (5 steps, "<2 weeks").
- Trust badges row (encryption, aggregate-only, UDPA 2019, no individual sharing).
- New **Request a Proposal** form (separate from screening request) → posts to `contact_submissions` with subject `"Proposal Request"`.

---

### Page 9 — For Professionals (`/for-professionals`)

- Replace opaque compensation copy with transparent earnings range (65–75%, ~UGX 6M–10M / mo at 20 sessions/wk).
- Promote "No monthly fees" to hero benefit.
- Add approval timeline (10 min / 5 days / 2 weeks).
- Accepted registration bodies by country (Uganda/Kenya/Tanzania/Rwanda + international fallback email).
- "Actively recruiting" specialties strip.
- 2–3 therapist testimonial quotes.
- Referral program section (UGX 50,000 after 10 sessions).
- Tech requirements section.
- New SEO title + meta.

---

### Page 10 — Donate Therapy (`/donate-therapy`)

- Add USD alongside UGX on every tier.
- Live impact counter at top (read aggregated count from existing `income_entries` where `source='donation'`, fallback static).
- Donor stories section (3 anonymized).
- Recurring donation toggle (monthly).
- "Gift a therapy" share link (generates WhatsApp/email shareable URL).
- Corporate CSR section linking to `/for-business`.
- Tax receipt request line.
- Transparency section on how donations are managed.
- *Note*: Stripe/Flutterwave international card processing requires backend wiring — defer activation; add UI placeholder + "Coming soon: international card payments" to keep scope sane unless you want me to enable Stripe in this phase.

---

### Page 11 — Corporate Wellbeing Check

Covered in Priority 0 above. Authenticated dashboard keeps existing analytics; add:
- PDF/CSV export buttons (already partially built — verify and surface).
- Trend-over-time block (round 1 vs round 2 comparison using `corporate_screenings.created_at`).
- Service recommendation hints based on aggregate risk (uses existing `corporate_service_catalog`).

---

### Out of scope / clarifications needed
- **Stripe/Flutterwave** for donations: enabling international payments is a backend integration. I'll ship UI stubs unless you confirm to wire Stripe now.
- **admin.innersparkafrica.com** subdomain split: this is DNS/hosting work outside the codebase — current `/corporate-admin` route is already RBAC-gated; I'll keep it on the main domain unless you want me to add a redirect.
- **Therapist photos for blog authors**: I'll reuse existing `src/assets/specialists/*` images. If a specific therapist isn't in `/specialists`, I'll fall back to a generic InnerSpark byline.
- **Past-30-day access audit** for the wellbeing URL: requires log review I can't perform from code — flagging for your team.

---

### Execution order
1. Security lockdown of `/corporate-wellbeing-check` (Priority 0).
2. For Business rebuild (highest commercial impact).
3. Blog rebuild + 5 new posts.
4. For Professionals rebuild.
5. Donate Therapy rebuild.
6. Corporate dashboard polish (exports, trends, recommendations).
