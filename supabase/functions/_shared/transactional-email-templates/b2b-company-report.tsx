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
  top_stress_indicators?: string[]
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
  top_stress_indicators,
  recommendations,
  dashboard_url = 'https://www.innersparkafrica.com/corporate-admin',
}: Props) => {
  const stressors = top_stress_indicators && top_stress_indicators.length > 0 ? top_stress_indicators : [
    'Workload management',
    'Sleep quality',
    'Work-life balance',
  ]
  const recs = recommendations && recommendations.length > 0 ? recommendations : [
    'Run a manager training on supportive conversations and burnout prevention.',
    'Offer confidential 1:1 sessions for employees flagged as needing support.',
    'Encourage daily check-ins via the InnerSpark mobile app.',
  ]
  const period = reporting_period || new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long' })

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Wellbeing report for {company_name} — {period}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="56" height="56" style={logoImg} />
            <Heading style={logo}>{SITE_NAME}</Heading>
          </Section>

          <Heading style={h1}>{contact_name ? `Hello ${contact_name},` : 'Hello,'}</Heading>
          <Text style={text}>
            Here is the aggregated wellbeing snapshot for <strong>{company_name}</strong> ({period}).
            All figures are anonymised — no individual employee can be identified.
          </Text>

          <Heading as="h3" style={h3}>📊 At a glance</Heading>
          <Section style={statsGrid}>
            <Row>
              <Column style={statCol}><Text style={statValue}>{total_completed}/{total_employees}</Text><Text style={statLabel}>Completed</Text></Column>
              <Column style={statCol}><Text style={statValue}>{completion_rate}%</Text><Text style={statLabel}>Completion rate</Text></Column>
            </Row>
            <Row>
              <Column style={statCol}><Text style={statValue}>{avg_who5}%</Text><Text style={statLabel}>Avg WHO-5 wellbeing</Text></Column>
              <Column style={statCol}><Text style={{ ...statValue, color: '#ef4444' }}>{needs_support_count}</Text><Text style={statLabel}>Need support</Text></Column>
            </Row>
          </Section>

          <Heading as="h3" style={h3}>Wellbeing distribution</Heading>
          <Section style={distBox}>
            <Row>
              <Column style={{ width: '34%', textAlign: 'center' as const }}>
                <Text style={{ ...distValue, color: '#22c55e' }}>{high_wellbeing_pct}%</Text>
                <Text style={distLabel}>High ✨</Text>
              </Column>
              <Column style={{ width: '33%', textAlign: 'center' as const }}>
                <Text style={{ ...distValue, color: '#eab308' }}>{moderate_wellbeing_pct}%</Text>
                <Text style={distLabel}>Moderate 🌤️</Text>
              </Column>
              <Column style={{ width: '33%', textAlign: 'center' as const }}>
                <Text style={{ ...distValue, color: '#ef4444' }}>{low_wellbeing_pct}%</Text>
                <Text style={distLabel}>Low 💛</Text>
              </Column>
            </Row>
          </Section>

          <Heading as="h3" style={h3}>🚩 Top stress indicators</Heading>
          <Section style={listBox}>
            {stressors.map((s, i) => <Text key={i} style={listItem}>{i + 1}. {s}</Text>)}
          </Section>

          <Heading as="h3" style={h3}>💡 Recommendations</Heading>
          <Section style={listBox}>
            {recs.map((r, i) => <Text key={i} style={listItem}>• {r}</Text>)}
          </Section>

          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button style={cta} href={dashboard_url}>Open the corporate dashboard</Button>
          </Section>

          <Text style={disclaimer}>
            <strong>Confidentiality:</strong> Individual employee responses are private and never
            shared. Reports are based on group-level aggregates only.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>With care,<br />The {SITE_NAME} Corporate Team</Text>
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
    needs_support_count: 19,
    top_stress_indicators: ['Workload management', 'Sleep quality', 'Work-life balance'],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px', maxWidth: '620px', margin: '0 auto' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 12px' }
const h3 = { fontSize: '16px', fontWeight: '700' as const, color: '#1a1a1a', margin: '20px 0 10px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' }
const statsGrid = { backgroundColor: '#f4f5fb', borderRadius: '10px', padding: '8px 12px', margin: '0 0 12px' }
const statCol = { width: '50%', padding: '10px', textAlign: 'center' as const }
const statValue = { fontSize: '24px', fontWeight: 'bold' as const, color: PRIMARY_COLOR, margin: '0' }
const statLabel = { fontSize: '12px', color: '#666', margin: '4px 0 0', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const distBox = { backgroundColor: '#f9fafc', borderRadius: '10px', padding: '14px', margin: '0 0 12px' }
const distValue = { fontSize: '22px', fontWeight: 'bold' as const, margin: '0' }
const distLabel = { fontSize: '12px', color: '#666', margin: '4px 0 0' }
const listBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '14px 18px', margin: '0 0 16px' }
const listItem = { fontSize: '14px', color: '#333', margin: '0 0 8px', lineHeight: '1.5' }
const cta = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const disclaimer = { fontSize: '12px', color: '#065f46', backgroundColor: '#ecfdf5', borderLeft: '3px solid #10b981', padding: '10px 14px', borderRadius: '4px', lineHeight: '1.5', margin: '16px 0' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0', lineHeight: '1.5' }