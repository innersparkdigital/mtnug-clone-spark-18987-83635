/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = 'InnerSpark Africa'
const PRIMARY_COLOR = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'

interface TherapistWelcomeProps {
  full_name?: string
  email?: string
  password?: string
  login_url?: string
}

const TherapistWelcomeEmail = ({
  full_name = 'Therapist',
  email = '',
  password = '',
  login_url = 'https://www.innersparkafrica.com/therapist',
}: TherapistWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} Therapist Account is Ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="64" height="64" style={logoImg} />
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Heading style={h1}>Dear {full_name},</Heading>

        <Text style={text}>
          Welcome to the {SITE_NAME} clinical team. Your therapist account has been created and your dashboard is ready.
        </Text>

        <Heading as="h2" style={h2}>Your login details</Heading>
        <Section style={detailsBox}>
          <Text style={detailLabel}>Portal</Text>
          <Text style={detailValue}><a href={login_url} style={link}>{login_url}</a></Text>
          <Text style={detailLabel}>Email</Text>
          <Text style={detailValue}><strong>{email}</strong></Text>
          <Text style={detailLabel}>Temporary password</Text>
          <Text style={detailValue}><strong>{password}</strong></Text>
        </Section>

        <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
          <Button style={button} href={login_url}>Log in to your dashboard</Button>
        </Section>

        <Text style={text}>
          When you log in for the first time, you will be asked to create your own password before accessing anything else.
          Please do this immediately and do not share your login details with anyone.
        </Text>

        <Text style={text}>
          Once inside your dashboard you can update your professional profile, set your availability, create client assignments,
          and track your clients' progress between sessions.
        </Text>

        <Text style={text}>
          If you have any trouble logging in, reply to this email or contact us on <strong>+256 792 085 773</strong>.
        </Text>

        <Text style={text}>
          Thank you for being part of InnerSpark. The work you do changes lives. 💙
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          Warm regards,<br />
          Talemwa Raymond<br />
          Founder and CEO, {SITE_NAME}<br />
          info@innersparkafrica.com
        </Text>

        <EmailFooterBanner />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TherapistWelcomeEmail,
  subject: `Your ${SITE_NAME} Therapist Account is Ready`,
  displayName: 'Therapist welcome (portal onboarding)',
  previewData: {
    full_name: 'Janet Nakato',
    email: 'janet@innersparkafrica.com',
    password: 'Temp1234!',
    login_url: 'https://www.innersparkafrica.com/therapist',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 16px' }
const h2 = { fontSize: '17px', fontWeight: '700' as const, color: '#1a1a1a', margin: '24px 0 10px' }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.6', margin: '0 0 16px' }
const detailsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }
const detailLabel = { fontSize: '12px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailValue = { fontSize: '14px', color: '#333333', margin: '0 0 12px', lineHeight: '1.5', wordBreak: 'break-all' as const }
const link = { color: PRIMARY_COLOR, textDecoration: 'none' }
const button = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', lineHeight: '1.5' }