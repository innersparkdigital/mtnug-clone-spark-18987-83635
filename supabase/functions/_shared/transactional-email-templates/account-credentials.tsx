import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = "InnerSpark Africa"
const PRIMARY_COLOR = "#5B6ABF"
const LOGO_URL = "https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png"
const SITE_URL = "https://www.innersparkafrica.com"
const CONTACT_EMAIL = "info@innersparkafrica.com"
const TAGLINE = "Accessible Mental Health for Africa"

interface AccountCredentialsProps {
  full_name?: string
  account_type?: 'doctor' | 'admin'
  login_url?: string
  login_id?: string
  login_id_label?: string
  password?: string
}

const AccountCredentialsEmail = ({
  full_name,
  account_type = 'doctor',
  login_url = 'https://www.innersparkafrica.com/for-professionals/refer',
  login_id = '',
  login_id_label = 'Phone',
  password = '',
}: AccountCredentialsProps) => {
  const greeting = account_type === 'doctor' ? `Dr. ${full_name || ''}`.trim() : (full_name || 'there')
  const portalName = account_type === 'doctor' ? 'Doctor Referral Portal' : 'Admin Portal'
  const isDoctor = account_type === 'doctor'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{isDoctor ? `Welcome to ${SITE_NAME} – Referral Partnership Onboarding` : `Your ${SITE_NAME} ${portalName} login details`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src={LOGO_URL}
              alt={SITE_NAME}
              width="64"
              height="64"
              style={logoImg}
            />
            <Heading style={logo}>{SITE_NAME}</Heading>
          </Section>

          <Heading style={h1}>{isDoctor ? `Hello ${greeting},` : `Welcome, ${greeting}`}</Heading>

          {isDoctor ? (
            <>
              <Text style={text}>Welcome to {SITE_NAME}.</Text>
              <Text style={text}>
                We are pleased to onboard you as a <strong>Referral Partner</strong>, and we look forward
                to working with you to improve access to mental health support for patients who require
                counselling services.
              </Text>
              <Text style={text}>
                Through this partnership, you will refer patients, and our team will ensure they receive
                timely, confidential, and professional care through our digital platform.
              </Text>

              <Heading as="h2" style={h2}>Our Services & Pricing</Heading>
              <Text style={text}>
                All services are delivered virtually through the InnerSpark App (available on Play Store and Apple Store):
              </Text>
              <Section style={listBox}>
                <Text style={listItem}>• <strong>Video Therapy Sessions:</strong> UGX 75,000 per hour</Text>
                <Text style={listItem}>• <strong>Chat-Based Consultation:</strong> UGX 30,000 per hour</Text>
                <Text style={listItem}>• <strong>Support Groups:</strong> UGX 25,000 per week</Text>
              </Section>

              <Heading as="h2" style={h2}>Referral Commission Structure</Heading>
              <Text style={text}>
                Your earnings are based on a <strong>monthly tiered commission model</strong> (flat rate):
              </Text>
              <Section style={listBox}>
                <Text style={listItem}><strong>🔹 Tier 1: 1–5 referrals</strong><br />30% of margin = <strong>UGX 3,375 per patient</strong></Text>
                <Text style={listItem}><strong>🔹 Tier 2: 6–15 referrals</strong><br />40% of margin = <strong>UGX 4,500 per patient</strong></Text>
                <Text style={listItem}><strong>🔹 Tier 3: 15+ referrals</strong><br />50% of margin = <strong>UGX 5,625 per patient</strong></Text>
              </Section>

              <Heading as="h2" style={h2}>How It Works</Heading>
              <Text style={text}>
                • Your tier is based on total successful referrals per month<br />
                • Once you reach a tier, all referrals in that month are paid at that rate
              </Text>
              <Text style={textMuted}>
                <em>Example: 12 referrals → Tier 2 → 12 × 4,500 = <strong>UGX 54,000</strong></em>
              </Text>

              <Heading as="h2" style={h2}>What Counts as a Successful Referral</Heading>
              <Text style={text}>A referral qualifies when:</Text>
              <Section style={listBox}>
                <Text style={listItem}>✅ Patient is submitted through the platform</Text>
                <Text style={listItem}>✅ Patient books a session</Text>
                <Text style={listItem}>✅ Patient attends the session</Text>
                <Text style={listItem}>✅ Patient completes payment</Text>
              </Section>

              <Heading as="h2" style={h2}>Payment Cycle</Heading>
              <Text style={text}>
                • Calculated monthly<br />
                • Paid at the end of the month, or within the first 5 working days of the next month
              </Text>

              <Heading as="h2" style={h2}>Your Login Details</Heading>
              <Section style={detailsBox}>
                <Text style={detailLabel}>Login URL</Text>
                <Text style={detailValue}><a href={login_url} style={link}>{login_url}</a></Text>
                <Text style={detailLabel}>{login_id_label}</Text>
                <Text style={detailValue}><strong>{login_id}</strong></Text>
                <Text style={detailLabel}>Temporary Password</Text>
                <Text style={detailValue}><strong>{password}</strong></Text>
              </Section>

              <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
                <Button style={button} href={login_url}>Access Your Dashboard</Button>
              </Section>

              <Text style={textMuted}>
                <strong>Important:</strong> Please log in and update your password after your first login.
                For your security, do not share these credentials with anyone.
              </Text>

              <Text style={text}>We are excited to have you as part of this partnership.</Text>
            </>
          ) : (
            <>
              <Text style={text}>
                An account has been created for you on the {SITE_NAME} {portalName}. Use the credentials
                below to sign in for the first time. We recommend changing your password after your first login.
              </Text>

              <Section style={detailsBox}>
                <Text style={detailLabel}>Login URL</Text>
                <Text style={detailValue}><a href={login_url} style={link}>{login_url}</a></Text>
                <Text style={detailLabel}>{login_id_label}</Text>
                <Text style={detailValue}><strong>{login_id}</strong></Text>
                <Text style={detailLabel}>Temporary Password</Text>
                <Text style={detailValue}><strong>{password}</strong></Text>
              </Section>

              <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
                <Button style={button} href={login_url}>Sign in to your account</Button>
              </Section>

              <Text style={text}>
                For your security, please do not share these credentials with anyone. If you did not expect this
                email, contact us immediately at <strong>info@innersparkafrica.com</strong>.
              </Text>
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Regards,<br />
            The {SITE_NAME} Team
          </Text>

          <EmailFooterBanner />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AccountCredentialsEmail,
  subject: (data: Record<string, any>) =>
    data.account_type === 'admin'
      ? `Your ${SITE_NAME} Admin Portal credentials`
      : `Welcome to ${SITE_NAME} – Referral Partnership Onboarding`,
  displayName: 'Account credentials (admin/doctor)',
  previewData: {
    full_name: 'Jane Doe',
    account_type: 'doctor',
    login_url: 'https://www.innersparkafrica.com/for-professionals/refer',
    login_id: '+256 700 000 000',
    login_id_label: 'Phone',
    password: 'Temp1234!',
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
const textMuted = { fontSize: '13px', color: '#777777', lineHeight: '1.5', margin: '0 0 16px' }
const listBox = { backgroundColor: '#f9fafc', borderRadius: '8px', padding: '14px 18px', margin: '0 0 16px' }
const listItem = { fontSize: '14px', color: '#444444', margin: '0 0 8px', lineHeight: '1.5' }
const detailsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }
const detailLabel = { fontSize: '12px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailValue = { fontSize: '14px', color: '#333333', margin: '0 0 12px', lineHeight: '1.5', wordBreak: 'break-all' as const }
const link = { color: PRIMARY_COLOR, textDecoration: 'none' }
const button = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', lineHeight: '1.5' }
const footerBanner = { backgroundColor: PRIMARY_COLOR, borderRadius: '8px', padding: '20px 24px', margin: '24px -25px 0', textAlign: 'center' as const }
const footerTagline = { fontSize: '16px', fontWeight: '700' as const, color: '#ffffff', margin: '0 0 8px' }
const footerLinkText = { fontSize: '13px', color: '#ffffff', margin: '0 0 6px', lineHeight: '1.5' }
const footerLink = { color: '#ffffff', textDecoration: 'underline' }
const footerCopy = { fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: '0' }
