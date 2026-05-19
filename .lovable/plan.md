
This is a large two-part build. I'll implement it in a single coordinated pass, but flagging scope so you can confirm before I start.

## Part 1 — Kenya Homepage (/kenya)

**New route `/kenya`** — a dedicated Kenya-market homepage with KES pricing and M-Pesa instructions. Reuses existing Header/Footer with a "Kenya" badge added beside the logo when on this route.

Sections built (all per spec):
1. Hero (Spark Blue, two-column, two CTAs → `/book?market=kenya` and `/check/kenya`)
2. Warmth orange stripe (4px #F2994A)
3. Trust strip (4 pills)
4. Problem section (1 in 4 Kenyans stat, Kenya Mental Health Policy source)
5. How It Works (3 numbered steps, M-Pesa *840# instructions in step 2)
6. Services (2×2 grid — Individual, Free Check, Support Groups, Corporate)
7. Therapist preview (pulls 3 therapists tagged `kenya: true`, falls back to top 3)
8. Pricing (KES 2,600 / KES 9,600 / Free, full M-Pesa payment box)
9. Testimonials (pulls 5-star session_feedback with `client_consented_to_display=true`, falls back to 3 placeholder Kenya cards)
10. Final CTA (Deep Night, warmth stripes top/bottom)
11. Footer additions (Serving East Africa, Kenya WhatsApp line, M-Pesa instructions)

**SEO** — page title, meta description, Kenya-targeted keywords (online therapy Kenya, therapist Nairobi, counselling Kenya, M-Pesa therapy, mental health Kenya, depression therapist Kenya, anxiety counsellor Nairobi, online psychologist Mombasa Kisumu, EAP Kenya, Kiswahili therapy), canonical, JSON-LD LocalBusiness + FAQPage.

**Shared page tweaks (minimal):**
- `/check/kenya` — new public WHO-5 page (no employer context, EN/Kiswahili selector, results CTA → `/book?market=kenya`)
- `/book` flow — when `?market=kenya` OR phone starts with +254: show "KES 2,600" / "KES 9,600", M-Pesa as first payment method, pre-filter Kenya therapists
- `/specialists` — new "Kenya" filter chip; therapists with `kenya=true` shown first
- Index.tsx — geo-detection banner (Kenya timezone or sw-KE / ke locale), dismissable to sessionStorage `ke_banner_dismissed`

**DB additions for Part 1:**
- `specialists.kenya boolean default false`
- `session_feedback.client_consented_to_display boolean default false`
- `session_feedback.client_display_name text`

---

## Part 2 — Referral Link System

**New tables:**
- `referral_links` — slug (unique), referrer_name/phone/email, market, link_type, discount_amount_kes, reward_type, reward_value, custom_message, is_active, notes
- `referral_clicks` — referral_link_id, clicked_at, ip_hash, user_agent, converted, booking_id
- `referral_conversions` — referral_link_id, booking_id, session_amount_kes, discount_applied, reward_issued

RLS: admin-only for management; public can INSERT clicks via edge function; public SELECT only on active links by slug via SECURITY DEFINER RPC `get_referral_link_by_slug`.

**New public route `/kenya/ref/:slug`** — logs click via RPC, sets `innerspark_ref` cookie (30-day), redirects to `/kenya`. If inactive, shows "expired link" page.

**Referral banner** on `/kenya` — reads cookie, shows green personalized banner with custom_message or default; dismissable for session only.

**Booking integration** — on booking submission, if cookie present, call `record_referral_conversion` RPC to link booking, apply discount, mark click converted, queue reward.

**Admin "Referral Links" tab** in `AdminDashboard`:
- 4 metric cards (active links, clicks, conversions, conv. rate)
- Filters (market, link type, date range)
- "+ Create referral link" modal (all spec fields, slug auto-gen + uniqueness check)
- Links table (referrer, market, slug+copy, clicks, bookings, conv%, pending rewards, pause toggle, actions)
- Detail view (perf metrics, Recharts timeline, clicks table, conversions table, rewards panel with "Mark as issued")
- Share panel — 4 pre-formatted templates (WhatsApp DM, WhatsApp Group, WhatsApp Status, LinkedIn) with copy buttons
- Bulk CSV create (template download, preview, batch insert)

**Notifications** — edge function `notify-referral-conversion` sends WhatsApp-formatted message via existing email/notification pipeline to referrer + admin on conversion, and to referrer when reward issued.

---

## Scope notes & assumptions

- **Pricing inconsistency in your spec**: hero says "From KES 2,600", Final CTA button says "KES 1,700", Banner default says "KES [1700 - discount]". I'll standardize on **KES 2,600 base** with discount math: `displayed = 2600 - discount_amount_kes` (default discount 200 → KES 2,400 referred). The Final CTA button will read "Book my first session — from KES 2,600". Please correct if you want a different base.
- M-Pesa instructions use the existing Airtel number you provided (0740 616 404 / Innerspark Recovery Ltd) per spec.
- Therapist `kenya` tag will default to `false`; you'll need to flip the flag on specific therapists from admin (I'll add a checkbox in the specialist edit form). Until tagged, the preview falls back to top 3 specialists.
- Booking flow KES override is **display-only** on the form. PesaPal still charges in UGX (75,000) since the M-Pesa flow is manual via *840#. I'll add a clear note: "Pay via M-Pesa using *840# — see instructions" and skip auto-PesaPal for Kenya bookings, switching to "Confirm booking → we'll send M-Pesa instructions on WhatsApp".
- WhatsApp notifications use the existing `send-resend-email` style edge function pattern (no Twilio integration) — referrer gets an email if email provided, otherwise the admin gets the notification to manually WhatsApp them. (Adding outbound WhatsApp would require a new provider; not in scope here.)
- Geo-banner only on `/` (Index.tsx) — not on every page.
- I will NOT touch existing booking/payment processing logic, the WHO-5 scoring, admin dashboard structure, or any other existing page beyond what's listed.

---

## Execution order

1. Migration: add columns to `specialists` + `session_feedback`, create 3 referral tables + RPCs + RLS
2. Build `/kenya` page + Kenya badge in Header + Footer additions
3. Build `/check/kenya` page
4. Build `/kenya/ref/:slug` redirect page + referral banner + cookie helper
5. Tweak `/book` and `/specialists` for Kenya market
6. Add geo-banner to Index
7. Build `FeedbackTab`-style `ReferralLinksTab` + integrate into AdminDashboard
8. Add notification edge function

Reply **"go"** to proceed, or send corrections (especially the **KES 2,600 vs 1,700** price question) and I'll adjust before building.
