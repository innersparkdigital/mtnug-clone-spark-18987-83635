import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = 'InnerSpark Africa'
const PRIMARY_COLOR = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'

interface Props {
  employee_name?: string
  company_name?: string
  access_code?: string
  secure_url?: string
}

const Email = ({ employee_name, company_name, access_code, secure_url }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your confidential wellbeing check from {company_name || SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="56" height="56" style={logoImg} />
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Heading style={h1}>{employee_name ? `Hi ${employee_name},` : 'Hello,'}</Heading>
        <Text style={text}>
          {company_name || 'Your employer'} has partnered with {SITE_NAME} to support your mental wellbeing.
          You have been invited to take a short, <strong>confidential</strong> wellbeing check
          (about 3–5 minutes).
        </Text>

        <Section style={infoBox}>
          <Text style={infoTitle}>Your private access</Text>
          {access_code && (
            <>
              <Text style={detailLabel}>Access code</Text>
              <Text style={codeValue}>{access_code}</Text>
            </>
          )}
          {secure_url && (
            <>
              <Text style={detailLabel}>Or open directly</Text>
              <Text style={detailValue}><a href={secure_url} style={link}>{secure_url}</a></Text>
            </>
          )}
        </Section>

        {secure_url && (
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button style={cta} href={secure_url}>Start my wellbeing check</Button>
          </Section>
        )}

        <Section style={privacyBox}>
          <Text style={privacyTitle}>🔒 Your privacy is protected</Text>
          <Text style={privacyText}>
            Individual results are <strong>never</strong> shared with your employer.
            Your company only sees aggregated, anonymous insights to plan better support.
          </Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>With care,<br />The {SITE_NAME} Team</Text>
        <EmailFooterBanner />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Your confidential wellbeing check — ${data.company_name || SITE_NAME}`,
  displayName: 'B2B – Employee invitation/confirmation',
  previewData: {
    employee_name: 'Asha',
    company_name: 'Acme Uganda Ltd',
    access_code: 'WELL-A1B2C3',
    secure_url: 'https://www.innersparkafrica.com/corporate-wellbeing-check?token=abc123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 12px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' }
const infoBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 18px' }
const infoTitle = { fontSize: '14px', fontWeight: '700' as const, color: PRIMARY_COLOR, margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailLabel = { fontSize: '12px', color: '#888', margin: '8px 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailValue = { fontSize: '14px', color: '#333', margin: '0 0 4px', wordBreak: 'break-all' as const }
const codeValue = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '2px' }
const link = { color: PRIMARY_COLOR, textDecoration: 'none' }
const cta = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const privacyBox = { backgroundColor: '#ecfdf5', borderLeft: '3px solid #10b981', padding: '12px 16px', borderRadius: '4px', margin: '8px 0 20px' }
const privacyTitle = { fontSize: '13px', fontWeight: '700' as const, color: '#065f46', margin: '0 0 6px' }
const privacyText = { fontSize: '13px', color: '#065f46', margin: '0', lineHeight: '1.5' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0', lineHeight: '1.5' }