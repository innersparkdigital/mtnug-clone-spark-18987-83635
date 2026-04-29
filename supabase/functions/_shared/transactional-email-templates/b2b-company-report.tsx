import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Text, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = 'InnerSpark Africa'
const PRIMARY_COLOR = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'

interface Props {
  contact_name?: string
  company_name?: string
  reporting_period?: string
  total_employees?: number
  total_completed?: number
  completion_rate?: number
  avg_who5?: number
  high_wellbeing_pct?: number
  moderate_wellbeing_pct?: number
  low_wellbeing_pct?: number
  needs_support_count?: number
  high_count?: number
  moderate_count?: number
  low_count?: number
  recommendations?: string[]
  dashboard_url?: string
}

const Email = ({
  contact_name,
  company_name = 'your team',
  reporting_period,
  total_employees = 0,
  total_completed = 0,
  completion_rate = 0,
  avg_who5 = 0,
  high_wellbeing_pct = 0,
  moderate_wellbeing_pct = 0,
  low_wellbeing_pct = 0,
  needs_support_count = 0,
  high_count = 0,
  moderate_count = 0,
  low_count = 0,
  recommendations,
  dashboard_url = 'https://www.innersparkafrica.com/corporate-admin',
}: Props) => {
  const period = reporting_period || new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long' })

  // Risk-driven narrative
  const isCritical = low_wellbeing_pct >= 30 || avg_who5 < 50
  const isElevated = !isCritical && (low_wellbeing_pct >= 10 || moderate_wellbeing_pct >= 40 || avg_who5 < 65)
  const riskBanner = isCritical
    ? { label: '🔴 URGENT — High Risk Detected', color: '#b91c1c', bg: '#fef2f2', text: `${low_count} of your ${total_completed} screened employees are in a critical wellbeing zone. Without intervention, expect rising absenteeism, presenteeism and turnover within the next 60–90 days.` }
    : isElevated
      ? { label: '🟡 ATTENTION — Elevated Stress', color: '#92400e', bg: '#fffbeb', text: `A meaningful share of your team is showing reduced wellbeing. Acting now prevents these cases from sliding into crisis.` }
      : { label: '🟢 STABLE — Maintain Momentum', color: '#065f46', bg: '#ecfdf5', text: `Your team is doing well. Keep the momentum with quarterly check-ins and continued access to support.` }

  // Productivity & business impact (research-based estimates)
  // WHO/Deloitte: untreated mental health issues reduce productivity ~25–35% per affected employee.
  const productivityLoss = Math.round((low_count * 0.30 + moderate_count * 0.12) * 100) / 100
  const lostDaysPerYear = Math.round(low_count * 22 + moderate_count * 9) // avg lost productive days

  const recs = recommendations && recommendations.length > 0 ? recommendations : [
    'Activate the InnerSpark Employee Digital Mental Health Package for full coverage.',
    'Run manager training on supportive conversations and burnout prevention.',
    'Offer confidential 1:1 sessions for employees flagged as needing support.',
    'Schedule the next quarterly Mind-Check & WHO-5 in 90 days.',
  ]

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Wellbeing report for {company_name} — {period}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="56" height="56" style={logoImg} />
            <Heading style={logo}>{SITE_NAME}</Heading>
            <Text style={logoTag}>Corporate Mental Health Report</Text>
          </Section>

          <Heading style={h1}>{contact_name ? `Hello ${contact_name},` : 'Hello,'}</Heading>
          <Text style={text}>
            Below is the confidential aggregated wellbeing snapshot for <strong>{company_name}</strong> ({period}).
            All figures are anonymised — no individual employee can be identified.
          </Text>

          {/* RISK BANNER */}
          <Section style={{ ...riskBox, backgroundColor: riskBanner.bg, borderLeft: `4px solid ${riskBanner.color}` }}>
            <Text style={{ ...riskTitle, color: riskBanner.color }}>{riskBanner.label}</Text>
            <Text style={riskText}>{riskBanner.text}</Text>
          </Section>

          <Heading as="h3" style={h3}>📊 At a glance</Heading>
          <Section style={statsGrid}>
            <Row>
              <Column style={statCol}><Text style={statValue}>{total_completed}/{total_employees}</Text><Text style={statLabel}>Completed</Text></Column>
              <Column style={statCol}><Text style={statValue}>{completion_rate}%</Text><Text style={statLabel}>Participation</Text></Column>
            </Row>
            <Row>
              <Column style={statCol}><Text style={statValue}>{avg_who5}%</Text><Text style={statLabel}>Avg WHO-5</Text></Column>
              <Column style={statCol}><Text style={{ ...statValue, color: '#ef4444' }}>{needs_support_count}</Text><Text style={statLabel}>Need support</Text></Column>
            </Row>
          </Section>

          <Heading as="h3" style={h3}>Wellbeing distribution</Heading>
          <Section style={distBox}>
            <Row>
              <Column style={{ width: '34%', textAlign: 'center' as const }}>
                <Text style={{ ...distValue, color: '#22c55e' }}>{high_wellbeing_pct}%</Text>
                <Text style={distLabel}>Healthy ({high_count})</Text>
              </Column>
              <Column style={{ width: '33%', textAlign: 'center' as const }}>
                <Text style={{ ...distValue, color: '#eab308' }}>{moderate_wellbeing_pct}%</Text>
                <Text style={distLabel}>At Risk ({moderate_count})</Text>
              </Column>
              <Column style={{ width: '33%', textAlign: 'center' as const }}>
                <Text style={{ ...distValue, color: '#ef4444' }}>{low_wellbeing_pct}%</Text>
                <Text style={distLabel}>Critical ({low_count})</Text>
              </Column>
            </Row>
          </Section>

          {/* PRODUCTIVITY IMPACT */}
          <Heading as="h3" style={h3}>📉 Productivity & business impact</Heading>
          <Section style={impactBox}>
            <Text style={impactText}>
              Research from WHO and Deloitte shows that untreated mental health challenges reduce
              individual productivity by 25–35% and drive absenteeism, presenteeism, and turnover.
            </Text>
            <Row>
              <Column style={impactCol}>
                <Text style={impactValue}>~{productivityLoss}</Text>
                <Text style={impactLabel}>FTE-equivalent productivity at risk</Text>
              </Column>
              <Column style={impactCol}>
                <Text style={impactValue}>~{lostDaysPerYear}</Text>
                <Text style={impactLabel}>Estimated lost productive days / year</Text>
              </Column>
            </Row>
            <Text style={impactNote}>
              Every UGX 1 invested in employee mental health returns an estimated UGX 4 in
              productivity, retention and reduced sick leave (WHO ROI study).
            </Text>
          </Section>

          {/* RECOMMENDATIONS */}
          <Heading as="h3" style={h3}>💡 Recommendations</Heading>
          <Section style={listBox}>
            {recs.map((r, i) => <Text key={i} style={listItem}>• {r}</Text>)}
          </Section>

          {/* SOLUTION — Digital Mental Health Package */}
          <Section style={packageBox}>
            <Text style={packageEyebrow}>RECOMMENDED SOLUTION</Text>
            <Heading as="h2" style={packageH2}>Employee Digital Mental Health Package</Heading>
            <Text style={packageSub}>An insurance-style yearly subscription per employee — predictable, budget-friendly, fully virtual.</Text>

            <Text style={packageSection}>✅ Coverage includes</Text>
            <Text style={packageItem}>• <strong>Video Teletherapy</strong> — 12 1:1 sessions / year with licensed therapists</Text>
            <Text style={packageItem}>• <strong>Support Group</strong> — 48 weekly structured online group sessions</Text>
            <Text style={packageItem}>• <strong>Chat Consultation</strong> — Quick virtual mental health guidance (≈12/month)</Text>
            <Text style={packageItem}>• <strong>Quarterly Screening</strong> — Mind-Check & WHO-5 assessments</Text>

            <Text style={packageSection}>❌ Excluded</Text>
            <Text style={packageItem}>• Any in-person intervention beyond the virtual scope</Text>
            <Text style={packageItem}>• Medication, hospitalization or specialised therapy outside the platform</Text>

            <Text style={packageSection}>💵 Fee breakdown (per employee / year)</Text>
            <Section style={feeTable}>
              <Row style={feeHeadRow}>
                <Column style={feeColService}><Text style={feeHead}>Service</Text></Column>
                <Column style={feeColUnits}><Text style={feeHead}>Units</Text></Column>
                <Column style={feeColTotal}><Text style={feeHead}>Total (UGX)</Text></Column>
              </Row>
              <Row style={feeRow}>
                <Column style={feeColService}><Text style={feeCell}>Video Teletherapy</Text></Column>
                <Column style={feeColUnits}><Text style={feeCell}>12 / yr</Text></Column>
                <Column style={feeColTotal}><Text style={feeCell}>900,000</Text></Column>
              </Row>
              <Row style={feeRow}>
                <Column style={feeColService}><Text style={feeCell}>Support Group</Text></Column>
                <Column style={feeColUnits}><Text style={feeCell}>48 / yr</Text></Column>
                <Column style={feeColTotal}><Text style={feeCell}>1,200,000</Text></Column>
              </Row>
              <Row style={feeRow}>
                <Column style={feeColService}><Text style={feeCell}>Chat Consultation</Text></Column>
                <Column style={feeColUnits}><Text style={feeCell}>~12 / mo</Text></Column>
                <Column style={feeColTotal}><Text style={feeCell}>360,000</Text></Column>
              </Row>
              <Row style={feeTotalRow}>
                <Column style={feeColService}><Text style={feeTotalCell}>Discounted bundled fee</Text></Column>
                <Column style={feeColUnits}><Text style={feeTotalCell}>—</Text></Column>
                <Column style={feeColTotal}><Text style={feeTotalCell}>UGX 1,000,000</Text></Column>
              </Row>
            </Section>

            <Text style={packageNote}>
              For <strong>{total_employees || 'your'}</strong> employees, full-year coverage = approx
              <strong> UGX {(total_employees * 1_000_000).toLocaleString('en-UG')}</strong>. Employees access
              every service anytime through the InnerSpark App.
            </Text>

            <Section style={{ textAlign: 'center' as const, margin: '20px 0 6px' }}>
              <Button style={cta} href="mailto:info@innersparkafrica.com?subject=Activate%20Employee%20Mental%20Health%20Package">
                Activate the package →
              </Button>
            </Section>
          </Section>

          <Section style={{ textAlign: 'center' as const, margin: '20px 0' }}>
            <Button style={ctaSecondary} href={dashboard_url}>Open the corporate dashboard</Button>
          </Section>

          <Text style={disclaimer}>
            <strong>Confidentiality:</strong> Individual employee responses are private and never
            shared. Reports are based on group-level aggregates only.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>With care,<br />The {SITE_NAME} Corporate Team<br />info@innersparkafrica.com</Text>
          <EmailFooterBanner />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Wellbeing report — ${data.company_name || 'Your team'} (${data.reporting_period || 'this period'})`,
  displayName: 'B2B – Company aggregated report',
  previewData: {
    contact_name: 'Mary',
    company_name: 'Acme Uganda Ltd',
    reporting_period: 'April 2026',
    total_employees: 120,
    total_completed: 92,
    completion_rate: 77,
    avg_who5: 58,
    high_wellbeing_pct: 38,
    moderate_wellbeing_pct: 41,
    low_wellbeing_pct: 21,
    high_count: 35,
    moderate_count: 38,
    low_count: 19,
    needs_support_count: 19,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px', maxWidth: '640px', margin: '0 auto' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 24px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const logoTag = { fontSize: '12px', color: '#dde2f5', margin: '4px 0 0', textAlign: 'center' as const, letterSpacing: '1px', textTransform: 'uppercase' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 12px' }
const h3 = { fontSize: '16px', fontWeight: '700' as const, color: '#1a1a1a', margin: '24px 0 10px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' }

const riskBox = { borderRadius: '8px', padding: '14px 16px', margin: '8px 0 20px' }
const riskTitle = { fontSize: '14px', fontWeight: '700' as const, margin: '0 0 6px', letterSpacing: '0.3px' }
const riskText = { fontSize: '14px', color: '#333', lineHeight: '1.55', margin: '0' }

const statsGrid = { backgroundColor: '#f4f5fb', borderRadius: '10px', padding: '8px 12px', margin: '0 0 12px' }
const statCol = { width: '50%', padding: '10px', textAlign: 'center' as const }
const statValue = { fontSize: '24px', fontWeight: 'bold' as const, color: PRIMARY_COLOR, margin: '0' }
const statLabel = { fontSize: '12px', color: '#666', margin: '4px 0 0', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const distBox = { backgroundColor: '#f9fafc', borderRadius: '10px', padding: '14px', margin: '0 0 12px' }
const distValue = { fontSize: '22px', fontWeight: 'bold' as const, margin: '0' }
const distLabel = { fontSize: '12px', color: '#666', margin: '4px 0 0' }

const impactBox = { backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '16px', margin: '0 0 16px' }
const impactText = { fontSize: '13px', color: '#7c2d12', lineHeight: '1.5', margin: '0 0 12px' }
const impactCol = { width: '50%', padding: '8px', textAlign: 'center' as const }
const impactValue = { fontSize: '22px', fontWeight: 'bold' as const, color: '#c2410c', margin: '0' }
const impactLabel = { fontSize: '12px', color: '#7c2d12', margin: '4px 0 0' }
const impactNote = { fontSize: '12px', color: '#7c2d12', fontStyle: 'italic' as const, margin: '12px 0 0', lineHeight: '1.5' }

const listBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '14px 18px', margin: '0 0 16px' }
const listItem = { fontSize: '14px', color: '#333', margin: '0 0 8px', lineHeight: '1.5' }

const packageBox = { backgroundColor: '#eff2ff', border: `2px solid ${PRIMARY_COLOR}`, borderRadius: '12px', padding: '20px', margin: '20px 0' }
const packageEyebrow = { fontSize: '11px', fontWeight: '700' as const, color: PRIMARY_COLOR, letterSpacing: '1.5px', margin: '0 0 6px' }
const packageH2 = { fontSize: '20px', fontWeight: '800' as const, color: '#1a1a1a', margin: '0 0 6px' }
const packageSub = { fontSize: '13px', color: '#555', margin: '0 0 14px', lineHeight: '1.5' }
const packageSection = { fontSize: '14px', fontWeight: '700' as const, color: '#1a1a1a', margin: '14px 0 6px' }
const packageItem = { fontSize: '13px', color: '#333', margin: '0 0 4px', lineHeight: '1.5' }
const feeTable = { backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px', margin: '8px 0' }
const feeHeadRow = { backgroundColor: PRIMARY_COLOR }
const feeRow = {}
const feeTotalRow = { backgroundColor: '#fef9c3' }
const feeColService = { width: '50%', padding: '6px 8px' }
const feeColUnits = { width: '20%', padding: '6px 8px' }
const feeColTotal = { width: '30%', padding: '6px 8px', textAlign: 'right' as const }
const feeHead = { fontSize: '12px', fontWeight: '700' as const, color: '#ffffff', margin: '0' }
const feeCell = { fontSize: '13px', color: '#333', margin: '0' }
const feeTotalCell = { fontSize: '14px', fontWeight: '700' as const, color: '#1a1a1a', margin: '0' }
const packageNote = { fontSize: '13px', color: '#1a1a1a', backgroundColor: '#fef9c3', borderRadius: '6px', padding: '10px 12px', margin: '12px 0', lineHeight: '1.55' }

const cta = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '700' as const }
const ctaSecondary = { backgroundColor: '#ffffff', color: PRIMARY_COLOR, padding: '12px 24px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none', fontWeight: '600' as const, border: `1.5px solid ${PRIMARY_COLOR}` }
const disclaimer = { fontSize: '12px', color: '#065f46', backgroundColor: '#ecfdf5', borderLeft: '3px solid #10b981', padding: '10px 14px', borderRadius: '4px', lineHeight: '1.5', margin: '16px 0' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0', lineHeight: '1.5' }
