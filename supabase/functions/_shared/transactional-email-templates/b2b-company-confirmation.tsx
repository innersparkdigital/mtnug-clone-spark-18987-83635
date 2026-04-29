import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = 'InnerSpark Africa'
const PRIMARY_COLOR = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'

interface Props {
  contact_name?: string
  company_name?: string
  employee_count?: number | string
  preferred_date?: string
  preferred_format?: string
  notes?: string
}

const Email = ({ contact_name, company_name, employee_count, preferred_date, preferred_format, notes }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your screening request — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="56" height="56" style={logoImg} />
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Heading style={h1}>{contact_name ? `Thank you, ${contact_name}!` : 'Thank you!'}</Heading>
        <Text style={text}>
          We've received your mental health screening request for <strong>{company_name || 'your team'}</strong>.
          Thank you for prioritising your employees' wellbeing — it's the kind of leadership that
          changes workplaces.
        </Text>
        <Text style={text}>
          Our team will reach out within <strong>1 business day</strong> to confirm details and
          schedule the screening.
        </Text>

        <Section style={detailsBox}>
          <Text style={detailsTitle}>Summary of your request</Text>
          {company_name && (<><Text style={detailLabel}>Company</Text><Text style={detailValue}>{company_name}</Text></>)}
          {employee_count !== undefined && employee_count !== '' && (<><Text style={detailLabel}>Approximate employees</Text><Text style={detailValue}>{employee_count}</Text></>)}
          {preferred_date && (<><Text style={detailLabel}>Preferred date</Text><Text style={detailValue}>{preferred_date}</Text></>)}
          {preferred_format && (<><Text style={detailLabel}>Preferred format</Text><Text style={detailValue}>{preferred_format}</Text></>)}
          {notes && (<><Text style={detailLabel}>Notes</Text><Text style={detailValue}>{notes}</Text></>)}
        </Section>

        <Text style={text}>
          If your matter is urgent, reach us on WhatsApp at <strong>+256 792 085 773</strong> or
          email <strong>info@innersparkafrica.com</strong>.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>Warm regards,<br />The {SITE_NAME} Corporate Team</Text>
        <EmailFooterBanner />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'We received your screening request — InnerSpark Africa',
  displayName: 'B2B – Company booking confirmation',
  previewData: {
    contact_name: 'Mary',
    company_name: 'Acme Uganda Ltd',
    employee_count: 120,
    preferred_date: '2026-05-12',
    preferred_format: 'onsite',
    notes: 'Focus on stress and burnout for our customer support team.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 12px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' }
const detailsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 18px' }
const detailsTitle = { fontSize: '14px', fontWeight: '700' as const, color: PRIMARY_COLOR, margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailLabel = { fontSize: '12px', color: '#888', margin: '8px 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailValue = { fontSize: '14px', color: '#333', margin: '0 0 4px' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0', lineHeight: '1.5' }