import { corsHeaders } from '@supabase/supabase-js/cors'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const FROM_EMAIL = 'InnerSpark Africa <info@innersparkafrica.com>'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { type, to, data } = await req.json()

    if (!type || !to) {
      return new Response(JSON.stringify({ error: 'type and to are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const email = buildEmail(type, data)
    if (!email) {
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: email.subject,
        html: email.html,
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      console.error('Resend API error:', JSON.stringify(result))
      return new Response(JSON.stringify({ error: `Email send failed [${response.status}]`, details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Email sent via Resend:', { type, to })
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error in send-resend-email:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

interface EmailContent {
  subject: string
  html: string
}

function buildEmail(type: string, data: Record<string, any>): EmailContent | null {
  switch (type) {
    case 'contact-confirmation':
      return contactConfirmation(data)
    case 'training-confirmation':
      return trainingConfirmation(data)
    case 'newsletter-welcome':
      return newsletterWelcome(data)
    case 'career-application':
      return careerApplication(data)
    case 'app-waitlist':
      return appWaitlist(data)
    case 'callback-confirmation':
      return callbackConfirmation(data)
    case 'business-inquiry':
      return businessInquiry(data)
    case 'professional-application':
      return professionalApplication(data)
    case 'booking-confirmation':
      return bookingConfirmation(data)
    default:
      return null
  }
}

const BRAND_COLOR = '#5B6ABF'
const SITE = 'InnerSpark Africa'

function wrap(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:0 25px 40px;">
    <div style="background:${BRAND_COLOR};padding:24px 25px;margin:0 -25px 30px;border-radius:0 0 8px 8px;text-align:center;">
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${SITE}</h1>
    </div>
    <h2 style="font-size:22px;font-weight:bold;color:#1a1a1a;margin:0 0 16px;">${title}</h2>
    ${body}
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">
    <p style="font-size:13px;color:#999;margin:0;line-height:1.5;">
      Warm regards,<br>The ${SITE} Team<br>
      <a href="https://www.innersparkafrica.com" style="color:${BRAND_COLOR};">www.innersparkafrica.com</a>
    </p>
  </div>
</body></html>`
}

const p = (text: string) => `<p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 20px;">${text}</p>`
const detail = (label: string, value: string) => `<p style="font-size:12px;color:#888;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.5px;">${label}</p><p style="font-size:14px;color:#333;margin:0 0 12px;line-height:1.5;">${value}</p>`
const box = (content: string) => `<div style="background:#f4f5fb;border-radius:8px;padding:16px 20px;margin:0 0 24px;">${content}</div>`
const btn = (text: string, url: string) => `<div style="text-align:center;margin:24px 0;"><a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">${text}</a></div>`

function contactConfirmation(d: Record<string, any>): EmailContent {
  const name = d.name || 'there'
  return {
    subject: 'We received your message — InnerSpark Africa',
    html: wrap(
      `Thank you, ${name}!`,
      p('We have received your message and our team will get back to you within 24–48 hours.') +
      (d.subject ? box(detail('Subject', d.subject) + (d.message ? detail('Your message', d.message) : '')) : '') +
      p('If your matter is urgent, you can also reach us directly on WhatsApp at <strong>+256 792 085 773</strong>.')
    ),
  }
}

function trainingConfirmation(d: Record<string, any>): EmailContent {
  return {
    subject: `Registration Confirmed: ${d.trainingTitle || 'Wellness Training'}`,
    html: wrap(
      `You're registered, ${d.recipientName || 'there'}!`,
      p(`Thank you for registering for <strong>${d.trainingTitle}</strong>. We look forward to having you join us.`) +
      box(
        detail('📅 Date', d.trainingDate || 'TBC') +
        detail('⏰ Time', d.trainingTime || 'TBC') +
        detail('👩‍⚕️ Facilitator', `${d.facilitatorName || ''} — ${d.facilitatorTitle || ''}`) +
        (d.meetingPassword ? detail('🔒 Password', d.meetingPassword) : '')
      ) +
      (d.meetingLink ? btn('Join Google Meet', d.meetingLink) : '') +
      p('If you have any questions, feel free to reply to this email or reach us on WhatsApp at <strong>+256 792 085 773</strong>.')
    ),
  }
}

function newsletterWelcome(d: Record<string, any>): EmailContent {
  return {
    subject: 'Welcome to InnerSpark Africa Newsletter!',
    html: wrap(
      'Welcome to our wellness community!',
      p('Thank you for subscribing to the InnerSpark Africa newsletter.') +
      p('You\'ll receive expert tips, resources, and the latest articles on mental wellness delivered to your inbox.') +
      btn('Visit Our Website', 'https://www.innersparkafrica.com') +
      p('We respect your privacy. You can unsubscribe anytime.')
    ),
  }
}

function careerApplication(d: Record<string, any>): EmailContent {
  return {
    subject: 'Application Received — InnerSpark Africa',
    html: wrap(
      `Thank you for applying, ${d.name || 'there'}!`,
      p(`We've received your application for the <strong>${d.position || 'open'}</strong> position.`) +
      box(detail('Position', d.position || 'N/A') + detail('Experience', `${d.experience_years || 'N/A'} years`)) +
      p('Our team will review your application and get back to you within 5–7 business days.') +
      p('If you have any questions in the meantime, feel free to reach out.')
    ),
  }
}

function appWaitlist(d: Record<string, any>): EmailContent {
  return {
    subject: "You're on the list! — InnerSpark Africa App",
    html: wrap(
      "You're on the waitlist!",
      p(`Thank you${d.name ? `, ${d.name}` : ''}! We've added you to our app launch notification list.`) +
      p("We're working hard to bring you a seamless mental wellness experience on your phone. You'll be among the first to know when we launch!") +
      btn('Learn More', 'https://www.innersparkafrica.com')
    ),
  }
}

function callbackConfirmation(d: Record<string, any>): EmailContent {
  return {
    subject: 'Callback Request Received — InnerSpark Africa',
    html: wrap(
      `We'll call you back, ${d.name || 'there'}!`,
      p('Thank you for requesting a callback. One of our wellness team members will reach out to you shortly.') +
      box(detail('Your wellbeing score', `${d.percentage || 'N/A'}%`)) +
      p('If you need immediate support, please call us directly at <strong>+256 792 085 773</strong>.')
    ),
  }
}

function businessInquiry(d: Record<string, any>): EmailContent {
  return {
    subject: 'Business Inquiry Received — InnerSpark Africa',
    html: wrap(
      `Thank you, ${d.name || 'there'}!`,
      p(`We've received your business inquiry from <strong>${d.company || 'your organization'}</strong>.`) +
      p('Our corporate wellness team will review your request and reach out within 24–48 hours to discuss how we can support your team\'s mental wellbeing.') +
      btn('Learn More About Our Business Services', 'https://www.innersparkafrica.com/for-business')
    ),
  }
}

function professionalApplication(d: Record<string, any>): EmailContent {
  return {
    subject: 'Professional Application Received — InnerSpark Africa',
    html: wrap(
      `Thank you, ${d.name || 'there'}!`,
      p(`We've received your application to join the InnerSpark professional network as a <strong>${d.specialty || 'specialist'}</strong>.`) +
      p('Our team will review your credentials and contact you within 5–7 business days.') +
      btn('Visit Our Website', 'https://www.innersparkafrica.com/for-professionals')
    ),
  }
}

function bookingConfirmation(d: Record<string, any>): EmailContent {
  const isConsultation = d.formType === 'consultation'
  return {
    subject: isConsultation ? 'Free Consultation Request — InnerSpark Africa' : 'Booking Request Received — InnerSpark Africa',
    html: wrap(
      isConsultation ? 'Your consultation request is received!' : 'Your booking request is received!',
      p(`Thank you, <strong>${d.name || 'there'}</strong>! We've received your ${isConsultation ? 'free consultation' : 'booking'} request.`) +
      box(
        detail('Preferred Day', d.preferredDay || 'N/A') +
        detail('Preferred Time', d.preferredTime || 'N/A') +
        detail('Payment Method', d.paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Visa/Card')
      ) +
      p('Our team will reach out via WhatsApp to confirm your session details.') +
      p('If you need immediate support, call us at <strong>+256 792 085 773</strong>.')
    ),
  }
}
