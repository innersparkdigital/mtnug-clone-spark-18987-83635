# Paid psychometric assessments (corporate HR)

## Flow (Testportal / Future Options style)
1. HR buys credit packs (Mobile Money / card)
2. Credits land in company wallet
3. HR picks an assessment + employee name → unique link `/assess/{token}`
4. Employee fills privately
5. HR opens downloadable development report (print/PDF + .txt)

## URLs
- HR hub: `/corporate-assessments`
- HR report: `/corporate-assessments/report/{token}`
- Employee take: `/assess/{token}`
- Corporate dashboard: `/corporate-dashboard` (button → assessments)

## Demo HR login
- Email: `hr@demo.innerspark.local`
- Temp password: set at create time (must change on first login)
- Company: Demo Co Ltd
- Starting credits: 5 (seeded for trial)

## Pricing packs (UGX)
| Pack | Credits | Price |
|---|---:|---:|
| Single seat | 1 | 45,000 |
| Starter (5) | 5 | 200,000 |
| Team (10) | 10 | 360,000 |
| Department (25) | 25 | 800,000 |

## Catalog
- Workplace Personality Profile (1 cr)
- Stress Resilience at Work (1 cr)
- Leadership Style Snapshot (1 cr)
- Team Collaboration Style (1 cr)
- Role Fit and Interest Map (1 cr)
- Workplace Aptitude Lite (2 cr)

## Billing note
Orders create as `awaiting_payment`. Production: WhatsApp +256 792 085 773 with order id after MM/card pay. Demo mode in UI can mark paid immediately for testing.

## Privacy
Reports are workplace **development** tools — not clinical diagnoses. Individual WHO-5 wellbeing screens stay separate and aggregate-only on the main dashboard.
