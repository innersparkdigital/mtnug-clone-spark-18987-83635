import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "InnerSpark Africa"
const PRIMARY_COLOR = "#5B6ABF"

interface Props {
  name?: string
}

const AccountDeletionRequestEmail = ({ name }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your account deletion request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Heading style={h1}>
          {name ? `Hi ${name},` : 'Hello,'}
        </Heading>

        <Text style={text}>
          We've received your account deletion request. Our team will verify and process it
          within <strong>7 days</strong>.
        </Text>

        <Section style={infoBox}>
          <Text style={infoTitle}>What happens next</Text>
          <Text style={infoItem}>• Your account will be permanently deleted</Text>
          <Text style={infoItem}>• Personal data will be removed from our systems</Text>
          <Text style={infoItem}>• Active sessions will be terminated</Text>
          <Text style={infoItem}>• Some data may be retained where required by law</Text>
        </Section>

        <Text style={text}>
          If you didn't make this request or have questions, please contact us immediately at{' '}
          <a href="mailto:support@innersparkafrica.com" style={link}>
            support@innersparkafrica.com
          </a>.
        </Text>

        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AccountDeletionRequestEmail,
  subject: 'We\'ve received your account deletion request',
  displayName: 'Account deletion request',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { padding: '20px 0', borderBottom: `3px solid ${PRIMARY_COLOR}`, marginBottom: '24px' }
const logo = { fontSize: '24px', fontWeight: 'bold', color: PRIMARY_COLOR, margin: 0 }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const infoBox = { backgroundColor: '#f5f6fb', borderLeft: `4px solid ${PRIMARY_COLOR}`, padding: '16px 20px', margin: '20px 0', borderRadius: '4px' }
const infoTitle = { fontSize: '14px', fontWeight: 'bold', color: PRIMARY_COLOR, margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoItem = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '4px 0' }
const link = { color: PRIMARY_COLOR, textDecoration: 'underline' }
const footer = { fontSize: '13px', color: '#999999', margin: '30px 0 0' }
