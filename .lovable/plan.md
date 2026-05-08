This is a major rebuild covering 17 pages, brand identity, navigation, global rules, and content. Before writing any code I want to confirm scope and sequencing so we don't break the live production site that's already serving customers.

## What I understand you want

A full visual + structural rebuild of innersparkafrica.com to a "world-class" standard (BetterHelp / Lyra / Spring Health quality), but authentically African — keeping the existing backend (Lovable Cloud, PesaPal, Resend, RBAC, assessments, corporate admin, learning hub, Whisper, etc.) intact.

## Key brand + global changes (apply everywhere first)

- **Color system update** in `index.css` + `tailwind.config.ts`:
  - Primary `#3B4FD4`, accent `#EEF0FD`, success `#2E7D5E`, text `#1A1A2E`, muted `#555`, surface `#F5F6FF` (all converted to HSL tokens).
- **Typography**: load Plus Jakarta Sans (display) + Inter (body) from Google Fonts; restrict to defined sizes/weights (display, H1 22/500, H2 18/500, body 15/400/1.7, caption 12, label 11 uppercase).
- **Global header rebuild**: 3 mega-menus (Individuals / Business / Professionals), language selector, persistent "Book a Session" CTA, crisis-help strip ("Need urgent help? WhatsApp +256 792 085 773").
- **Global footer rebuild**: 4 columns as specified, with Google Play + App Store badges (iOS still routes to AppComingSoon per existing memory), socials, address.
- **Global rules enforcement**: unique title/meta/canonical per page, dual-currency display helper (`UGX X / ~$Y`), citation labels on stats, hide "0 enrolled" counts, headline changed to "Africa's Most Accessible Mental Wellness Platform" (drop "Uganda's #1").
- **Admin route guards**: confirm `/corporate-admin`, `/mind-check/analytics`, `/learning/admin-dashboard` all require admin role (RBAC already exists — audit + lock down any gaps).

## 17-page rebuild — needs your input

You said "17 pages in total" with per-page instructions ("what to keep / replace / add"), but the brief you pasted stops at the brand identity / typography section. **The page-by-page details didn't come through.**

Before I touch any page I need either:
1. The full per-page section pasted in a follow-up message, **or**
2. Permission to start with the global foundation (tokens, typography, header, footer, CTA, crisis bar, dual-currency helper) and tackle pages in a second pass once you send the page details.

## Recommended sequencing (to avoid breaking the live site)

```text
Phase 1 — Foundation (safe, non-destructive)
  1. Brand tokens (colors, fonts) in index.css + tailwind.config.ts
  2. Global Header rebuild (mega-menus + crisis bar + lang + CTA)
  3. Global Footer rebuild (4 columns)
  4. Dual-currency utility + "Africa's Most Accessible..." headline swap
  5. Admin route guard audit

Phase 2 — Page rebuilds (needs your per-page brief)
  Home → For Business → For Professionals → Services →
  Find a Therapist → Mind-Check → Support Groups → Learning Hub →
  Whisper → Donate Therapy → Blog → Events → About → Contact →
  Corporate Admin → Mind-Check Analytics → Learning Admin

Phase 3 — Polish
  SEO audit, citation labels, "0 enrolled" cleanup, image audit
```

## What stays untouched

- Lovable Cloud backend, all edge functions, RLS, RBAC
- PesaPal payment flow, pricing logic (75k UGX therapy, 25k groups), currency divisor 3400
- Resend email infrastructure + branded auth templates we just shipped
- Corporate admin manual recommendation system + service-request flow
- WHO-5, assessment-first flow, therapist matching algorithm
- Existing memories (Nairobi timezone, image hierarchy, scroll standards, etc.)

## Two questions before I start

1. **Send the per-page brief** (the part after "UI Label / Badge…") so I have the keep/replace/add details for all 17 pages — or confirm I should start with **Phase 1 foundation only** and you'll send page details after.
2. **"Plus Jakarta Sans" or Inter for display?** You wrote "Plus Jakarta Sans or Inter" — I'll default to **Plus Jakarta Sans** for display + **Inter** for body unless you say otherwise.

Approve this plan (and answer the two questions) and I'll start with Phase 1 immediately.