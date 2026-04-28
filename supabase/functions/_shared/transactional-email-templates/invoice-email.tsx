import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Img, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { EmailFooterBanner } from './_brand-footer.tsx'

const SITE_NAME = "InnerSpark Africa"
const PRIMARY_COLOR = "#5B6ABF"
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png'

interface InvoiceEmailProps {
  name?: string
  invoiceNumber?: string
  totalAmount?: string
  dueDate?: string
  paymentInstructions?: string
}

const InvoiceEmail = ({
  name,
  invoiceNumber = 'INS-1001',
  totalAmount = '500,000',
  dueDate,
  paymentInstructions = 'Payment via Mobile Money: +256 792 085 773 (MTN) or Bank Transfer',
}: InvoiceEmailProps) => {
  const displayDate = dueDate || new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Invoice {invoiceNumber} from {SITE_NAME} — UGX {totalAmount}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="180" style={logoImg} />
          </Section>

          <Section style={contentSection}>
            <Heading style={h1}>Invoice {invoiceNumber}</Heading>
            <Text style={text}>
              {name ? `Dear ${name},` : 'Dear Client,'}
            </Text>
            <Text style={text}>
              Please find your invoice from {SITE_NAME}. Below are the details:
            </Text>

            <Section style={detailsCard}>
              <Row>
                <Column style={labelCol}><Text style={fieldLabel}>Invoice Number</Text></Column>
                <Column style={valueCol}><Text style={fieldValue}>{invoiceNumber}</Text></Column>
              </Row>
              <Row>
                <Column style={labelCol}><Text style={fieldLabel}>Total Amount</Text></Column>
                <Column style={valueCol}><Text style={fieldValue}>UGX {totalAmount}</Text></Column>
              </Row>
              <Row>
                <Column style={labelCol}><Text style={fieldLabel}>Due Date</Text></Column>
                <Column style={valueCol}><Text style={fieldValue}>{displayDate}</Text></Column>
              </Row>
            </Section>

            <Text style={text}>
              <strong>Payment Instructions:</strong><br />
              {paymentInstructions}
            </Text>

            <Text style={text}>
              If you have any questions about this invoice, please contact us at <strong>info@innersparkafrica.com</strong> or WhatsApp <strong>+256 792 085 773</strong>.
            </Text>

            <Hr style={hr} />
            <Text style={footer}>
              Warm regards,<br />
              The {SITE_NAME} Team
            </Text>
          </Section>

          <EmailFooterBanner />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InvoiceEmail,
  subject: (data: Record<string, any>) =>
    `Invoice ${data.invoiceNumber || 'INS-1001'} — UGX ${data.totalAmount || '500,000'} | InnerSpark Africa`,
  displayName: 'Invoice email',
  previewData: {
    name: 'Jane Doe',
    invoiceNumber: 'INS-1001',
    totalAmount: '500,000',
    dueDate: 'May 15, 2026',
    paymentInstructions: 'Payment via Mobile Money: +256 792 085 773 (MTN) or Bank Transfer',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', textAlign: 'center' as const }
const logoImg = { margin: '0 auto' }
const contentSection = { padding: '24px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#555555', lineHeight: '1.6', margin: '0 0 16px' }
const detailsCard = { backgroundColor: '#f9f9fb', borderRadius: '8px', padding: '16px', margin: '16px 0' }
const labelCol = { width: '50%' }
const valueCol = { width: '50%', textAlign: 'right' as const }
const fieldLabel = { fontSize: '13px', color: '#888888', margin: '4px 0' }
const fieldValue = { fontSize: '14px', color: '#333333', margin: '4px 0', fontWeight: '600' as const }
const hr = { borderColor: '#e5e5e5', margin: '16px 0' }
const footer = { fontSize: '13px', color: '#999999', lineHeight: '1.5' }
