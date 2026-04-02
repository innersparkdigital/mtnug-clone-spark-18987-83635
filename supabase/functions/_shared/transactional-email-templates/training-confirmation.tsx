import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "InnerSpark Africa"

interface TrainingConfirmationProps {
  recipientName?: string
  trainingTitle?: string
  trainingDate?: string
  trainingTime?: string
  meetingLink?: string
  meetingPassword?: string
  facilitatorName?: string
  facilitatorTitle?: string
}

const TrainingConfirmationEmail = ({
  recipientName,
  trainingTitle,
  trainingDate,
  trainingTime,
  meetingLink,
  meetingPassword,
  facilitatorName,
  facilitatorTitle,
}: TrainingConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're registered for {trainingTitle || 'our wellness training'}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>Registration Confirmed ✅</Heading>
        </Section>

        <Text style={text}>
          Dear {recipientName || 'Participant'},
        </Text>

        <Text style={text}>
          Thank you for registering for the {SITE_NAME} wellness training. We are excited to have you join us!
        </Text>

        <Section style={detailsBox}>
          <Heading style={h2}>🧠 Session Details</Heading>
          <Text style={detailText}>📋 <strong>Training:</strong> {trainingTitle || 'Wellness Training'}</Text>
          <Text style={detailText}>📅 <strong>Date:</strong> {trainingDate || 'TBA'}</Text>
          <Text style={detailText}>⏰ <strong>Time:</strong> {trainingTime || '10:00AM – 11:00AM'}</Text>
          <Text style={detailText}>📍 <strong>Platform:</strong> Google Meet</Text>
          {facilitatorName && (
            <Text style={detailText}>👩‍⚕️ <strong>Facilitator:</strong> {facilitatorName}{facilitatorTitle ? ` – ${facilitatorTitle}` : ''}</Text>
          )}
        </Section>

        {meetingLink && (
          <Section style={meetingSection}>
            <Button style={joinButton} href={meetingLink}>
              Join Google Meet
            </Button>
            {meetingPassword && (
              <Text style={passwordText}>🔒 Password: {meetingPassword}</Text>
            )}
          </Section>
        )}

        <Hr style={hr} />

        <Text style={text}>
          💙 We look forward to supporting your mental wellbeing. If you have any questions, feel free to reach out on WhatsApp at +256 792 085 773.
        </Text>

        <Text style={footer}>
          Warm regards,<br />
          {SITE_NAME}<br />
          www.innersparkafrica.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TrainingConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Registration Confirmed: ${data.trainingTitle || 'Wellness Training'}`,
  displayName: 'Training registration confirmation',
  previewData: {
    recipientName: 'Jane',
    trainingTitle: 'Wellness Talk for Teachers',
    trainingDate: 'Friday, April 10, 2026',
    trainingTime: '10:00AM – 11:00AM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    facilitatorName: 'Faith Chege',
    facilitatorTitle: 'Counselling Psychologist, InnerSpark Africa',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica', sans-serif" }
const container = { padding: '20px 25px', maxWidth: '580px', margin: '0 auto' }
const headerSection = { backgroundColor: '#7c3aed', borderRadius: '8px 8px 0 0', padding: '20px', marginBottom: '0' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h2 = { fontSize: '18px', fontWeight: 'bold' as const, color: '#1a1a2e', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const detailsBox = { backgroundColor: '#f3f0ff', borderRadius: '8px', padding: '16px 20px', margin: '16px 0' }
const detailText = { fontSize: '14px', color: '#374151', lineHeight: '1.8', margin: '0' }
const meetingSection = { textAlign: 'center' as const, margin: '20px 0' }
const joinButton = {
  backgroundColor: '#7c3aed',
  color: '#ffffff',
  padding: '12px 30px',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  display: 'inline-block',
}
const passwordText = { fontSize: '13px', color: '#6b7280', margin: '10px 0 0', textAlign: 'center' as const }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', lineHeight: '1.5', margin: '20px 0 0' }
