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

interface Props {
  client_name?: string
  therapist_name?: string
  personal_note?: string
  tool_names?: string[]
  portal_url?: string
}

const ClientAssignmentInvite = ({
  client_name = 'there',
  therapist_name = 'Your therapist',
  personal_note = '',
  tool_names = [],
  portal_url = '#',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your personalised wellbeing space is ready 💙</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="64" height="64" style={logoImg} />
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Heading style={h1}>Hi {client_name},</Heading>
        <Text style={text}>
          {therapist_name} has set up a private space just for you between sessions. It's a safe, quiet
          place to reflect, practice new skills, and track how you're feeling — at your own pace.
        </Text>

        {personal_note ? (
          <Section style={noteBox}>
            <Text style={noteLabel}>A note from {therapist_name}</Text>
            <Text style={noteText}>{personal_note}</Text>
          </Section>
        ) : null}

        {tool_names.length > 0 ? (
          <>
            <Heading as="h2" style={h2}>What's waiting for you</Heading>
            <ul style={list}>
              {tool_names.map((n) => <li key={n} style={li}>{n}</li>)}
            </ul>
          </>
        ) : null}

        <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
          <Button style={button} href={portal_url}>Open your space →</Button>
        </Section>

        <Text style={text}>
          The link above is private to you. On your first visit you'll set a passcode so only you can see your entries.
        </Text>

        <Hr style={hr} />
        <Text style={crisis}>
          <strong>Need support right now?</strong><br />
          📞 Uganda Crisis Line: 0800 212 121 (free, confidential, 24/7)
        </Text>

        <Text style={footer}>
          You are not alone. 💙<br />
          {SITE_NAME}
        </Text>

        <EmailFooterBanner />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ClientAssignmentInvite,
  subject: 'Your personal wellbeing space is ready 💙',
  displayName: 'Client assignment invite',
  previewData: {
    client_name: 'Sarah',
    therapist_name: 'Janet Nakato',
    personal_note: 'I picked these tools based on what we talked about last week. Take your time — no rush.',
    tool_names: ['Session reflection', 'Thought record', 'Self-care tracker'],
    portal_url: 'https://www.innersparkafrica.com/my-progress/abc-123',
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
const noteBox = { backgroundColor: '#f4f5fb', borderLeft: `4px solid ${PRIMARY_COLOR}`, borderRadius: '6px', padding: '14px 18px', margin: '0 0 20px' }
const noteLabel = { fontSize: '12px', color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 6px' }
const noteText = { fontSize: '15px', color: '#333', margin: '0', lineHeight: '1.6', fontStyle: 'italic' as const }
const list = { paddingLeft: '20px', margin: '0 0 20px' }
const li = { fontSize: '15px', color: '#333', lineHeight: '1.8' }
const button = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const crisis = { fontSize: '13px', color: '#666', backgroundColor: '#fef7f0', padding: '12px 16px', borderRadius: '6px', margin: '0 0 20px', lineHeight: '1.6' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', lineHeight: '1.5' }