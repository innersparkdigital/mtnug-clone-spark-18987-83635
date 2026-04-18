import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Img, Button, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "InnerSpark Africa"
const PRIMARY_COLOR = "#5B6ABF"
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png'
const FOOTER_BANNER_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/footer-banner.png'

interface PaymentReceiptProps {
  name?: string
  amount?: string
  currency?: string
  description?: string
  paymentMethod?: string
  merchantReference?: string
  paymentDate?: string
  receiptNumber?: string
}

const PaymentReceiptEmail = ({
  name,
  amount = '75,000',
  currency = 'UGX',
  description = 'Therapy Session',
  paymentMethod = 'Mobile Money',
  merchantReference = '',
  paymentDate,
  receiptNumber,
}: PaymentReceiptProps) => {
  const displayDate = paymentDate || new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })
  const displayReceipt = receiptNumber || merchantReference || 'N/A'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Payment Receipt from {SITE_NAME} — {currency} {amount}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={headerSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="180" style={logoImg} />
          </Section>

          {/* Receipt Card */}
          <Section style={receiptCard}>
            <Text style={receiptLabel}>Receipt from {SITE_NAME}</Text>
            <Heading style={amountHeading}>{currency} {amount}</Heading>
            <Text style={paidDate}>Paid {displayDate}</Text>

            <Hr style={receiptHr} />

            <Row>
              <Column style={labelCol}>
                <Text style={fieldLabel}>Receipt number</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={fieldValue}>{displayReceipt}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={labelCol}>
                <Text style={fieldLabel}>Payment method</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={fieldValue}>{paymentMethod}</Text>
              </Column>
            </Row>

            {merchantReference && (
              <Row>
                <Column style={labelCol}>
                  <Text style={fieldLabel}>Reference</Text>
                </Column>
                <Column style={valueCol}>
                  <Text style={fieldValue}>{merchantReference}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Items */}
          <Section style={itemsCard}>
            <Heading style={itemsHeading}>Receipt #{displayReceipt}</Heading>
            <Text style={itemDate}>{displayDate}</Text>

            <Hr style={receiptHr} />

            <Row>
              <Column style={labelCol}>
                <Text style={itemName}>{description}</Text>
                <Text style={itemQty}>Qty 1</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={itemPrice}>{currency} {amount}</Text>
              </Column>
            </Row>

            <Hr style={receiptHr} />

            <Row>
              <Column style={labelCol}>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={totalValue}>{currency} {amount}</Text>
              </Column>
            </Row>
          </Section>

          {/* Thank you message */}
          <Text style={thankYou}>
            {name ? `Thank you, ${name}!` : 'Thank you!'} Your payment has been received. Our team will contact you on WhatsApp to confirm your session details.
          </Text>

          <Text style={text}>
            If you have any questions, reach us on WhatsApp at <strong>+256 792 085 773</strong> or email <strong>info@innersparkafrica.com</strong>.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Warm regards,<br />
            The {SITE_NAME} Team
          </Text>

          {/* Footer Banner */}
          <Section style={bannerSection}>
            <Img src={FOOTER_BANNER_URL} alt={`${SITE_NAME} — Your Mental Health Matters`} width="100%" style={bannerImg} />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: PaymentReceiptEmail,
  subject: (data: Record<string, any>) =>
    `Payment Receipt — ${data.currency || 'UGX'} ${data.amount || '75,000'} | InnerSpark Africa`,
  displayName: 'Payment receipt',
  previewData: {
    name: 'Jane Doe',
    amount: '75,000',
    currency: 'UGX',
    description: 'Therapy Session',
    paymentMethod: 'Mobile Money',
    merchantReference: 'INS-1712345678-abc123',
    paymentDate: 'April 14, 2026',
    receiptNumber: 'INS-1712345678-abc123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px' }
const headerSection = { backgroundColor: PRIMARY_COLOR, padding: '24px 25px', textAlign: 'center' as const }
const logoImg = { margin: '0 auto' }
const receiptCard = { backgroundColor: '#f9f9fb', borderRadius: '8px', padding: '24px', margin: '24px 25px 16px' }
const receiptLabel = { fontSize: '13px', color: '#888888', margin: '0 0 4px' }
const amountHeading = { fontSize: '32px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 4px' }
const paidDate = { fontSize: '14px', color: '#666666', margin: '0 0 16px' }
const receiptHr = { borderColor: '#e5e5e5', margin: '12px 0' }
const labelCol = { width: '50%' }
const valueCol = { width: '50%', textAlign: 'right' as const }
const fieldLabel = { fontSize: '13px', color: '#888888', margin: '4px 0' }
const fieldValue = { fontSize: '14px', color: '#333333', margin: '4px 0', fontWeight: '600' as const }
const itemsCard = { backgroundColor: '#f9f9fb', borderRadius: '8px', padding: '24px', margin: '0 25px 24px' }
const itemsHeading = { fontSize: '18px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 4px' }
const itemDate = { fontSize: '13px', color: '#888888', margin: '0 0 12px' }
const itemName = { fontSize: '15px', color: '#333333', margin: '4px 0', fontWeight: '500' as const }
const itemQty = { fontSize: '12px', color: '#999999', margin: '0' }
const itemPrice = { fontSize: '15px', color: '#333333', margin: '4px 0', fontWeight: '600' as const }
const totalLabel = { fontSize: '15px', color: '#1a1a1a', margin: '4px 0', fontWeight: 'bold' as const }
const totalValue = { fontSize: '15px', color: '#1a1a1a', margin: '4px 0', fontWeight: 'bold' as const }
const thankYou = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 25px 16px', fontWeight: '500' as const }
const text = { fontSize: '14px', color: '#555555', lineHeight: '1.6', margin: '0 25px 20px' }
const hr = { borderColor: '#e5e5e5', margin: '16px 25px' }
const footer = { fontSize: '13px', color: '#999999', margin: '0 25px 16px', lineHeight: '1.5' }
const bannerSection = { margin: '0', padding: '0' }
const bannerImg = { display: 'block' as const, width: '100%' }
