import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = 'InnerSpark Africa'
const PRIMARY_COLOR = '#5B6ABF'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png'
const BOOK_URL = 'https://www.innersparkafrica.com/find-therapist'

interface Props {
  employee_name?: string
  company_name?: string
  who5_percentage?: number
  total_percentage?: number
  wellbeing_category?: 'green' | 'yellow' | 'red' | string
  recommendations?: string[]
}

const CATEGORY: Record<string, { label: string; color: string; emoji: string; message: string }> = {
  green: { label: 'High Wellbeing', color: '#22c55e', emoji: '✨', message: 'Your responses suggest good wellbeing. Keep up the practices that are working for you.' },
  yellow: { label: 'Moderate Wellbeing', color: '#eab308', emoji: '🌤️', message: 'Some areas of your wellbeing could use attention. Small steps can make a meaningful difference.' },
  red: { label: 'Low Wellbeing', color: '#ef4444', emoji: '💛', message: 'Your wellbeing seems low right now. Talking to a professional — confidentially — can really help.' },
}

const Email = ({ employee_name, company_name, who5_percentage = 0, total_percentage = 0, wellbeing_category = 'yellow', recommendations }: Props) => {
  const cat = CATEGORY[wellbeing_category] || CATEGORY.yellow
  const recs = recommendations && recommendations.length > 0 ? recommendations : [
    'Book a confidential 1:1 session with a licensed therapist.',
    'Use the InnerSpark mobile app for daily mood check-ins and meditations.',
    'Speak openly with someone you trust — connection helps wellbeing.',
  ]
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your private wellbeing results from {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="56" height="56" style={logoImg} />
            <Heading style={logo}>{SITE_NAME}</Heading>
          </Section>

          <Heading style={h1}>{employee_name ? `Hi ${employee_name},` : 'Hello,'}</Heading>
          <Text style={text}>
            Thank you for completing the {company_name || 'workplace'} wellbeing check. Below is a
            <strong> private summary</strong> just for you. Your employer only sees aggregated,
            anonymous insights — never your individual answers.
          </Text>

          <Section style={{ ...resultCard, borderColor: cat.color }}>
            <Text style={resultEmoji}>{cat.emoji}</Text>
            <Text style={resultLabel}>Your Wellbeing</Text>
            <Heading as="h2" style={{ ...resultLevel, color: cat.color }}>{cat.label}</Heading>
            <Text style={resultScore}>WHO-5: <strong>{who5_percentage}%</strong> · Overall: <strong>{total_percentage}%</strong></Text>
            <Text style={resultMessage}>{cat.message}</Text>
          </Section>

          <Heading as="h3" style={h3}>Suggested Next Steps</Heading>
          <Section style={recsBox}>
            {recs.map((r, i) => <Text key={i} style={recItem}>• {r}</Text>)}
          </Section>

          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button style={cta} href={BOOK_URL}>Talk to a therapist privately</Button>
          </Section>

          <Text style={disclaimer}>
            <strong>Confidential:</strong> This summary is private. {SITE_NAME} does not share your
            individual results with {company_name || 'your employer'} or any third party.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>With care,<br />The {SITE_NAME} Team</Text>
          <EmailFooterBanner />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: 'Your private wellbeing results — InnerSpark Africa',
  displayName: 'B2B – Employee results',
  previewData: {
    employee_name: 'Asha',
    company_name: 'Acme Uganda Ltd',
    who5_percentage: 56,
    total_percentage: 62,
    wellbeing_category: 'yellow',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0 25px 40px', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', margin: '0 -25px 30px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const logoImg = { display: 'block', margin: '0 auto 8px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '6px' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#ffffff', margin: '0', textAlign: 'center' as const }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 12px' }
const h3 = { fontSize: '16px', fontWeight: '700' as const, color: '#1a1a1a', margin: '24px 0 10px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' }
const resultCard = { backgroundColor: '#f9fafc', borderRadius: '12px', padding: '24px 20px', margin: '12px 0 20px', borderWidth: '2px', borderStyle: 'solid' as const, textAlign: 'center' as const }
const resultEmoji = { fontSize: '32px', margin: '0 0 8px' }
const resultLabel = { fontSize: '12px', color: '#888', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const resultLevel = { fontSize: '24px', fontWeight: 'bold' as const, margin: '0 0 8px' }
const resultScore = { fontSize: '14px', color: '#444', margin: '0 0 12px' }
const resultMessage = { fontSize: '14px', color: '#555', lineHeight: '1.6', margin: '0' }
const recsBox = { backgroundColor: '#f4f5fb', borderRadius: '8px', padding: '14px 18px', margin: '0 0 16px' }
const recItem = { fontSize: '14px', color: '#333', margin: '0 0 8px', lineHeight: '1.5' }
const cta = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', textDecoration: 'none', fontWeight: '600' as const }
const disclaimer = { fontSize: '12px', color: '#065f46', backgroundColor: '#ecfdf5', borderLeft: '3px solid #10b981', padding: '10px 14px', borderRadius: '4px', lineHeight: '1.5', margin: '20px 0' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0', lineHeight: '1.5' }