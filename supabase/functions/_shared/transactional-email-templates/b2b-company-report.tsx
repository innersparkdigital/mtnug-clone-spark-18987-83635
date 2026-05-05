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
  // Manual / human report layer (additive, optional)
  consultant_observations?: string
  recommended_services?: Array<{
    id: string
    name: string
    description?: string
    physical_price?: number | null
    virtual_price?: number | null
    per_employee_price?: number | null
    unit_label?: string
    track_url?: string
    reason?: string
  }>
  alternative_services?: Array<{
    id: string
    name: string
    description?: string
    physical_price?: number | null
    virtual_price?: number | null
    per_employee_price?: number | null
    unit_label?: string
    track_url?: string
    reason?: string
  }>
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
  consultant_observations,
  recommended_services,
  alternative_services,
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

          <Section style={{ textAlign: 'center' as const, margin: '20px 0' }}>
            <Button style={ctaSecondary} href={dashboard_url}>Open the corporate dashboard</Button>
          </Section>

          {(consultant_observations || (recommended_services && recommended_services.length > 0)) && (
            <Section style={manualBox}>
              <Text style={packageEyebrow}>FROM YOUR INNERSPARK CONSULTANT</Text>
              <Heading as="h2" style={packageH2}>Consultant's Observations & Recommended Services</Heading>
              <Text style={packageSub}>A human review of your team's results from our wellness team.</Text>

              {consultant_observations && (
                <>
                  <Text style={packageSection}>📝 Observations</Text>
                  <Text style={observationsText}>{consultant_observations}</Text>
                </>
              )}

              {recommended_services && recommended_services.length > 0 && (
                <>
                  <Text style={packageSection}>🎯 Services we recommend for your team</Text>
                  {recommended_services.map((s) => (
                    <Section key={s.id} style={serviceCard}>
                      <Text style={serviceName}>{s.name}</Text>
                      {s.description && <Text style={serviceDesc}>{s.description}</Text>}
                      {s.reason && (
                        <Text style={reasonBox}><strong>Why we recommend this:</strong> {s.reason}</Text>
                      )}
                      <Text style={servicePricing}>{formatPricing(s)}</Text>
                      {s.track_url && (
                        <Section style={{ textAlign: 'left' as const, margin: '10px 0 0' }}>
                          <Button style={cta} href={s.track_url}>Request this service →</Button>
                        </Section>
                      )}
                    </Section>
                  ))}
                </>
              )}

              {alternative_services && alternative_services.length > 0 && (
                <>
                  <Text style={packageSection}>➕ Other services available</Text>
                  {alternative_services.map((s) => (
                    <Text key={s.id} style={altItem}>
                      • <strong>{s.name}</strong> — {formatPricing(s)}
                      {s.track_url && <> &nbsp;<a href={s.track_url} style={{ color: PRIMARY_COLOR, textDecoration: 'underline' }}>I'm interested →</a></>}
                    </Text>
                  ))}
                </>
              )}
            </Section>
          )}

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

const manualBox = { backgroundColor: '#fff7ed', border: `2px dashed #f59e0b`, borderRadius: '12px', padding: '20px', margin: '20px 0' }
const observationsText = { fontSize: '14px', color: '#1a1a1a', lineHeight: '1.65', margin: '0 0 14px', whiteSpace: 'pre-wrap' as const, backgroundColor: '#ffffff', borderRadius: '8px', padding: '12px 14px', border: '1px solid #fde68a' }
const serviceCard = { backgroundColor: '#ffffff', border: `1px solid ${PRIMARY_COLOR}`, borderRadius: '10px', padding: '14px 16px', margin: '0 0 10px' }
const serviceName = { fontSize: '15px', fontWeight: '700' as const, color: '#1a1a1a', margin: '0 0 4px' }
const serviceDesc = { fontSize: '13px', color: '#555', margin: '0 0 6px', lineHeight: '1.5' }
const servicePricing = { fontSize: '13px', fontWeight: '600' as const, color: PRIMARY_COLOR, margin: '0' }
const altItem = { fontSize: '13px', color: '#333', margin: '0 0 6px', lineHeight: '1.55' }
const reasonBox = { fontSize: '13px', color: '#1a1a1a', backgroundColor: '#fef9c3', borderRadius: '6px', padding: '8px 10px', margin: '6px 0 8px', lineHeight: '1.5' }

function formatPricing(s: { physical_price?: number | null; virtual_price?: number | null; per_employee_price?: number | null; unit_label?: string }) {
  const fmt = (n: number) => `UGX ${n.toLocaleString('en-UG')}`
  const parts: string[] = []
  if (s.physical_price) parts.push(`Physical: ${fmt(s.physical_price)}`)
  if (s.virtual_price) parts.push(`Virtual: ${fmt(s.virtual_price)}`)
  if (s.per_employee_price) parts.push(`${fmt(s.per_employee_price)} / ${s.unit_label || 'unit'}`)
  return parts.length > 0 ? parts.join('  •  ') : 'Pricing on request'
}
