import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "InnerSpark Africa"
const PRIMARY_COLOR = "#5B6ABF"

interface AccountCredentialsProps {
  full_name?: string
  account_type?: 'doctor' | 'admin'
  login_url?: string
  login_id?: string // phone (doctor) or email (admin)
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
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your {SITE_NAME} {portalName} login details</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={logo}>{SITE_NAME}</Heading>
          </Section>

          <Heading style={h1}>Welcome, {greeting}</Heading>
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

          <Hr style={hr} />
          <Text style={footer}>
            Warm regards,<br />
            The {SITE_NAME} Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AccountCredentialsEmail,
  subject: (data: Record<string, any>) =>
    `Your ${SITE_NAME} ${data.account_type === 'admin' ? 'Admin' : 'Doctor'} Portal credentials`,
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
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px' }
const logo = { fontSize: '20px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.6', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }
const detailLabel = { fontSize: '12px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailValue = { fontSize: '14px', color: '#333333', margin: '0 0 12px', lineHeight: '1.5', wordBreak: 'break-all' as const }
const link = { color: PRIMARY_COLOR, textDecoration: 'none' }
const button = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', lineHeight: '1.5' }