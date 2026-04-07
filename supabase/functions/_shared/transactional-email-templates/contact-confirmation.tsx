import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "InnerSpark Africa"
const PRIMARY_COLOR = "#5B6ABF"

interface ContactConfirmationProps {
  name?: string
  subject?: string
  message?: string
}

const ContactConfirmationEmail = ({ name, subject, message }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Heading style={h1}>
          {name ? `Thank you, ${name}!` : 'Thank you for reaching out!'}
        </Heading>

        <Text style={text}>
          We have received your message and our team will get back to you within 24–48 hours.
        </Text>

        {subject && (
          <Section style={detailsBox}>
            <Text style={detailLabel}>Subject</Text>
            <Text style={detailValue}>{subject}</Text>
            {message && (
              <>
                <Text style={detailLabel}>Your message</Text>
                <Text style={detailValue}>{message}</Text>
              </>
            )}
          </Section>
        )}

        <Text style={text}>
          If your matter is urgent, you can also reach us directly on WhatsApp at{' '}
          <strong>+256 792 085 773</strong>.
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

export const template = {
  component: ContactConfirmationEmail,
  subject: 'We received your message — InnerSpark Africa',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Jane', subject: 'Therapy inquiry', message: 'I would like to learn more about your services.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px' }
const logo = { fontSize: '20px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.6', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 24px' }
const detailLabel = { fontSize: '12px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailValue = { fontSize: '14px', color: '#333333', margin: '0 0 12px', lineHeight: '1.5' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', lineHeight: '1.5' }
