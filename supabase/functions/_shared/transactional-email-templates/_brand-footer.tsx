import * as React from 'npm:react@18.3.1'
import { Img, Section, Link } from 'npm:@react-email/components@0.0.22'

// Brand footer banner used on every InnerSpark transactional email.
// The banner image is the canonical branded footer (logo, tagline, contacts).
const BANNER_URL =
  'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/email-footer-banner.png'
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.innersparkafrica.app'

export const EmailFooterBanner = () => (
  <Section style={wrap}>
    <Link href={PLAY_STORE_URL} style={{ textDecoration: 'none' }}>
      <Img
        src={BANNER_URL}
        alt="InnerSpark Africa – Get the mobile app on Google Play or the App Store"
        width="600"
        style={img}
      />
    </Link>
  </Section>
)

const wrap = {
  margin: '32px -25px 0',
  textAlign: 'center' as const,
}
const img = {
  display: 'block',
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  borderRadius: '8px',
  margin: '0 auto',
}