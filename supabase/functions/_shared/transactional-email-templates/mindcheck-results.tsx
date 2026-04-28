import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = 'InnerSpark Africa'
const PRIMARY_COLOR = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'
const BOOK_URL = 'https://www.innersparkafrica.com/find-therapist'

interface Props {
  name?: string
  test_title?: string
  score?: number | string
  max_score?: number | string
  severity_level?: string
  recommendations?: string[]
  next_step_url?: string
}

const SEVERITY_META: Record<string, { color: string; emoji: string; message: string }> = {
  Minimal: { color: '#22c55e', emoji: '✨', message: 'Your responses suggest minimal symptoms at this time. Keep nurturing the habits that support you.' },
  Mild: { color: '#84cc16', emoji: '🌿', message: 'Your responses suggest mild symptoms. Early support and self-care can prevent things from escalating.' },
  Moderate: { color: '#eab308', emoji: '🌤️', message: 'Your responses suggest moderate symptoms. Speaking with a professional could be helpful.' },
  'Moderately Severe': { color: '#f97316', emoji: '⚠️', message: 'Your responses suggest moderately severe symptoms. We strongly recommend speaking with a therapist soon.' },
  Severe: { color: '#ef4444', emoji: '🚨', message: 'Your responses suggest severe symptoms. Please consider reaching out to a professional today — we are here to help.' },
}

const MindCheckResultsEmail = ({
  name,
  test_title = 'Mind-Check Assessment',
  score = 0,
  max_score = 0,
  severity_level = 'Moderate',
  recommendations,
  next_step_url = BOOK_URL,
}: Props) => {
  const meta = SEVERITY_META[severity_level] || SEVERITY_META.Moderate
  const recs = recommendations && recommendations.length > 0 ? recommendations : [
    'Talk to a licensed therapist privately, online or in person.',
    'Consider joining a peer support group for shared experiences.',
    'Practice daily self-care: sleep, movement, and a moment to breathe.',
  ]
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your {test_title} results from {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="56" height="56" style={logoImg} />
            <Heading style={logo}>{SITE_NAME}</Heading>
          </Section>

          <Heading style={h1}>{name ? `Hi ${name},` : 'Hi there,'}</Heading>
          <Text style={text}>
            Thank you for taking the {test_title}. Below is a private summary of your results.
          </Text>

          <Section style={{ ...resultCard, borderColor: meta.color }}>
            <Text style={resultEmoji}>{meta.emoji}</Text>
            <Text style={resultLabel}>Your Result</Text>
            <Heading as="h2" style={{ ...resultLevel, color: meta.color }}>{severity_level}</Heading>
            <Text style={resultScore}>Score: <strong>{score} / {max_score}</strong></Text>
            <Text style={resultMessage}>{meta.message}</Text>
          </Section>

          <Heading as="h3" style={h3}>Recommended Next Steps</Heading>
          <Section style={recsBox}>
            {recs.map((r, i) => (
              <Text key={i} style={recItem}>• {r}</Text>
            ))}
          </Section>

          <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
            <Button style={cta} href={next_step_url}>Book a Therapy Session</Button>
          </Section>

          <Text style={disclaimer}>
            <strong>Important:</strong> This screening tool is for informational purposes only and is
            not a clinical diagnosis. If you are in crisis or thinking about harming yourself, please
            call our support line or seek immediate help. WhatsApp: <strong>+256 792 085 773</strong>.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            With care,<br />
            The {SITE_NAME} Team
          </Text>

          <EmailFooterBanner />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: MindCheckResultsEmail,
  subject: (data: Record<string, any>) =>
    `Your ${data.test_title || 'Mind-Check'} results — ${data.severity_level || ''}`.trim(),
  displayName: 'Mind-Check assessment results',
  previewData: {
    name: 'Jane',
    test_title: 'Anxiety (GAD-7) Assessment',
    score: 12,
    max_score: 21,
    severity_level: 'Moderate',
    recommendations: [
      'Speak with a therapist about your worry patterns.',
      'Try a 10-minute daily breathing or grounding exercise.',
      'Limit caffeine and screen time before bed to improve sleep.',
    ],
    next_step_url: BOOK_URL,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 12px' }
const h3 = { fontSize: '16px', fontWeight: '700' as const, color: '#1a1a1a', margin: '24px 0 10px' }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.6', margin: '0 0 16px' }
const resultCard = { backgroundColor: '#f9fafc', borderRadius: '12px', padding: '24px 20px', margin: '12px 0 20px', borderWidth: '2px', borderStyle: 'solid' as const, textAlign: 'center' as const }
const resultEmoji = { fontSize: '32px', margin: '0 0 8px' }
const resultLabel = { fontSize: '12px', color: '#888', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const resultLevel = { fontSize: '26px', fontWeight: 'bold' as const, margin: '0 0 8px' }
const resultScore = { fontSize: '14px', color: '#444', margin: '0 0 12px' }
const resultMessage = { fontSize: '14px', color: '#555', lineHeight: '1.6', margin: '0' }
const recsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '14px 18px', margin: '0 0 16px' }
const recItem = { fontSize: '14px', color: '#333', margin: '0 0 8px', lineHeight: '1.5' }
const cta = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const disclaimer = { fontSize: '12px', color: '#888', backgroundColor: '#fff8e6', borderLeft: '3px solid #f59e0b', padding: '10px 14px', borderRadius: '4px', lineHeight: '1.5', margin: '20px 0' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0', lineHeight: '1.5' }