# Campaign Landing Page + Screening Anxiety FAQ

Two tightly coupled features that become every employee's first touchpoint: a branded `innersparkafrica.com/check/[slug]` landing page and a collapsible 5-question FAQ that addresses participation-blocking fears (employer privacy, job security, HIV-test confusion, WHO credibility, what-happens-next) in English, Luganda and Kiswahili.

---

## 1. Database changes (one migration)

**Extend `corporate_companies`** (we'll keep "company = campaign" since you currently model 1 active screening cycle per company; no need for a new table yet):

| Column | Type | Notes |
|---|---|---|
| `slug` | text, UNIQUE | auto-generated from name; locked once any employee accesses |
| `slug_locked` | bool default false | flipped on first public hit |
| `logo_url` | text | Supabase Storage public URL |
| `campaign_headline` | text | optional; auto-generated when blank |
| `campaign_subtext` | text | optional |
| `campaign_close_date` | timestamptz | required for countdown |
| `languages_enabled` | text[] default `{'en'}` | subset of en/lg/sw |
| `mode` | text default `'corporate'` | corporate / community / informal |
| `incentive_amount_ugx` | int default 0 | airtime amount; 0 hides banner |

**New table `campaign_faq_events`** (analytics):
- `company_id`, `session_id` (anon), `event_type` ('faq_opened'|'faq_item_opened'|'faq_completed'), `item_index` (1-5, nullable), `language`, `created_at`. RLS: anyone INSERT, admins SELECT.

**New SECURITY DEFINER RPC `get_campaign_by_slug(_slug text)`** returns only the public-safe fields (no contact email/phone, no context_notes) so the page works without auth.

**New SECURITY DEFINER RPC `get_campaign_completion(_company_id uuid)`** returns `{ completed_count, total_employees }`.

**New storage bucket `company-logos`** (public).

---

## 2. Public route `/check/:slug`

New page `src/pages/CampaignLanding.tsx` registered in `App.tsx`. Behaviour:

- Loads campaign via `get_campaign_by_slug` RPC.
- Slug not found → branded 404 panel.
- `campaign_close_date` in past → "This wellbeing check has now closed" panel.
- Otherwise renders Zones 1–9 per spec.

**Zones implemented:**
1. Hero (Spark Blue `#3B4FD4`) with company logo (white pill) × InnerSpark logo, auto-generated or custom headline/subtext.
2. 4px `#F2994A` warmth stripe.
3. Language selector (only when `languages_enabled.length > 1`); writes `is_lang` to sessionStorage.
4. Live countdown timer (D/H/M/S, `setInterval`, translated labels).
5. Participation progress bar — polled every 5 min via `get_campaign_completion`.
6. **`<ScreeningAnxietyFAQ />`** (Feature 2 — see §3).
7. CTA → navigates to existing corporate screening entry with `?slug=…&lang=…`.
8. Myths card (only `mode=community|informal`).
9. Incentive banner (only `incentive_amount_ugx > 0`).

All visible strings live in a local `TRANSLATIONS` object keyed by `en|lg|sw`.

---

## 3. `ScreeningAnxietyFAQ` component

`src/components/wellbeing/ScreeningAnxietyFAQ.tsx`

- Props: `language`, `mode`, optional `companyId` (used for analytics).
- Accordion: one open at a time, `+` rotates 45° to `×`, `max-height` transition (250 ms ease).
- Green `No.` / `Yes.` lead-word styling at the start of each answer.
- Confirmation row at bottom: "I understand — show me the check" (informational only, not a button).
- All 5 Q&A items + section/confirm copy in EN/LG/SW exactly per spec, in fixed order (employer → job → HIV → WHO → next steps).
- Analytics: insert into `campaign_faq_events` on first open per session (`faq_opened`), every item open (`faq_item_opened`), and once 3+ items have been opened (`faq_completed`). Session id = `crypto.randomUUID()` cached in sessionStorage.
- Mobile auto-scroll-into-view on open.

Reusable on the existing screening entry page too (drop in above the consent form).

---

## 4. Admin additions in `CorporateAdmin.tsx`

In the existing **company create/edit form**, add a "Campaign settings" section with:

- Slug field (auto-filled from name; editable until `slug_locked=true`, then read-only with a hint and a copy-button showing full URL).
- Logo upload (JPG/PNG/SVG/WebP, ≤2 MB) → uploads to `company-logos` bucket, stores public URL.
- Headline (max 120, char counter), subtext (max 200), close-date picker.
- Mode radios (Corporate / Community / Informal sector).
- Languages multi-checkbox (en/lg/sw).
- Airtime incentive (UGX number).

In the company detail header:

- "Copy employee link" button (clipboard + toast).
- "Download QR code" button — uses `qrcode` npm package to generate PNG and download.

In the **Analytics tab**, new "Engagement" sub-section: FAQ opened rate, most-viewed question, FAQ completion rate (computed from `campaign_faq_events` joined on completed screenings).

---

## 5. Things deliberately deferred / not in this build

- Existing assessment question flow, consent form copy, results page, and HR dashboard are untouched (per spec).
- Sending airtime is out of scope — banner only displays the promise.
- Translating the existing `CorporateWellbeingCheck` assessment screens into LG/SW is **not** included; only the landing page + FAQ are translated. The selected `lang` is forwarded as `?lang=…` so a future pass can wire the assessment screens.

---

## Decisions I need from you

1. **One campaign per company** — confirm we keep slug/headline/etc. on `corporate_companies` (matches your current model). If you want multi-cycle campaigns later, we'd add a separate `corporate_campaigns` table — bigger refactor, not in this pass.
2. **Existing companies without close-date or slug** — on migration I'll auto-generate slugs from current names and leave close-date NULL (countdown hidden until you set one). OK?
3. **CTA destination** — route to your existing `CorporateWellbeingCheck` entry with `?slug=…&lang=…`, or create a new dedicated `/check/:slug/start` consent page?

Reply with answers (or "go ahead with defaults") and I'll ship the migration + code in the next turn.
