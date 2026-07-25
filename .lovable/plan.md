# Plan — 5 Improvements, Sequenced for Zero Glitches

I'll ship in **2 batches** so each piece is tested before the next lands. Credits will cover all 5 items.

---

## Batch 1 — DB + Backend foundations (this turn)

### 1. Blog SEO fields (Image 1)
- Add `meta_description` (TEXT, ≤160 chars) and `meta_keywords` (TEXT, comma-separated) columns to `blog_posts`.
- Add inputs to `BlogsManager.tsx` form (below Excerpt).
- Render them in `<Helmet>` on `CmsBlogPost.tsx` so Google indexes them.
- Existing blogs unaffected — nullable columns.

### 2. All Clients data model (Image 4 benchmark)
- Extend `therapist_clients` (or session_feedback / income_entries — I'll pick the right home after reading) with the missing tracker fields: `client_code`, `client_phone`, `client_email`, `country`, `presenting_concern`, `session_type`, `duration_mins`, `session_rating`, `next_session_date`, `would_rebook`, `amount_ugx`, `therapist_share_ugx`, `innerspark_share_ugx`, `paid_status`.
- One migration, RLS + GRANT included.
- Auto-generate `client_code` (INS-XXXX) via trigger.

### 3. Digital Receipt infrastructure
- New Edge Function `generate-receipt-pdf` — server-side PDF (via `pdf-lib` or HTML→PDF) styled like SafeBoda/Lovable receipt (already have `payment-receipt.tsx` template as reference).
- New Edge Function `send-receipt-email` — sends the PDF as attachment via Resend to client email.
- Storage bucket `receipts` (public read via signed URLs) for WhatsApp shareable links.
- Marking a client entry as **paid** in admin auto-triggers: (a) receipt PDF generation, (b) email to client, (c) insert into `income_entries` (Finance & Accounts).

### 4. Kenya → Global Referrals rename
- Rename admin tab "Kenya Referrals" → "Referrals" and remove Kenya-only filters.
- Update `KenyaReferralsTab.tsx` to `ReferralsTab.tsx`, keep backwards-compatible route.
- Referral tracking already works for any country — just UI + copy changes.

---

## Batch 2 — Admin UI redesign + Overview fix (next turn)

### 5. Admin dashboard redesign (Image 2 → Image 3 aesthetic)
- Diagnose "Unable to load overview" (likely RPC error on `admin_dashboard_stats`) and fix.
- Apply the Calm/dark portal aesthetic from the therapist portal (Image 3) to `/admin`:
  - Gradient greeting card (Good afternoon, admin 👋)
  - Colored stat cards (Active clients, This week, Revenue, Safety flags)
  - "Needs attention" alert strip
  - Tabs restyled as pill nav, wrapped cleanly
- Rebuild **All Clients** tab with the exact columns from your spec + a **Generate Receipt** button per row (Email / Download / WhatsApp share).
- Rebuild **Overview** with revenue-per-session-type breakdown (Video / Chat / Group), therapist commission totals, InnerSpark totals — matching Image 4 layout.

---

## What I need from you
Just say **"proceed"** and I ship Batch 1 immediately. Batch 2 lands right after you confirm Batch 1 works.

## Technical notes
- Receipt PDF: server-side via Deno + `pdf-lib` (works in edge functions, no browser dependency).
- Finance auto-sync: DB trigger on `therapist_clients.paid_status = 'paid'` inserts into `income_entries`.
- All new tables/columns include GRANT + RLS.
- No changes to existing published data.
