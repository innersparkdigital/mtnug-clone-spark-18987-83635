/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in link for InnerSpark Africa</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt="InnerSpark Africa" width="64" height="64" style={logoImg} />
          <Heading style={brand}>InnerSpark Africa</Heading>
        </Section>
        <Heading style={h1}>Your sign-in link</Heading>
        <Text style={text}>
          Click the button below to sign in to InnerSpark Africa. This link will expire shortly for your security.
        </Text>
        <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
          <Button style={button} href={confirmationUrl}>Sign in</Button>
        </Section>
        <Text style={textMuted}>
          If the button doesn't work, paste this link into your browser:<br />
          <Link href={confirmationUrl} style={link}>{confirmationUrl}</Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.<br />
          — The InnerSpark Africa Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const PRIMARY = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'
const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px' }
const headerSection = { backgroundColor: PRIMARY, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const brand = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.6', margin: '0 0 16px' }
const textMuted = { fontSize: '13px', color: '#777777', lineHeight: '1.5', margin: '0 0 16px', wordBreak: 'break-all' as const }
const link = { color: PRIMARY, textDecoration: 'none' }
const button = { backgroundColor: PRIMARY, color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '12px 24px', textDecoration: 'none' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', lineHeight: '1.5' }
