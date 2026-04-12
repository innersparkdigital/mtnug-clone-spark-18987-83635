import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const FROM_EMAIL = 'InnerSpark Africa <info@innersparkafrica.com>'
const BRAND_COLOR = '#5B6ABF'
const SITE = 'InnerSpark Africa'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png'
const FOOTER_BANNER_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/footer-banner.png'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!LOVABLE_API_KEY || !RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing configuration' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // Find newsletters that are scheduled and due
    const { data: dueNewsletters, error: fetchErr } = await supabase
      .from('newsletters')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())

    if (fetchErr) {
      console.error('Error fetching scheduled newsletters:', fetchErr)
      return new Response(JSON.stringify({ error: fetchErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!dueNewsletters || dueNewsletters.length === 0) {
      return new Response(JSON.stringify({ message: 'No scheduled newsletters due' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results = []

    for (const newsletter of dueNewsletters) {
      let recipients: string[] = []
      const filter = newsletter.recipient_filter as any

      if (filter?.type === 'custom' && Array.isArray(filter.emails)) {
        recipients = filter.emails
      } else {
        const { data: subs } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .eq('is_active', true)
        recipients = (subs || []).map((s: any) => s.email)
      }

      if (recipients.length === 0) {
        await supabase
          .from('newsletters')
          .update({ status: 'failed' })
          .eq('id', newsletter.id)
        results.push({ id: newsletter.id, status: 'failed', reason: 'no recipients' })
        continue
      }

      const html = buildNewsletterHtml(newsletter)
      let sentCount = 0
      let failedCount = 0

      for (const email of recipients) {
        const messageId = `newsletter-${newsletter.id}-${email}`

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'newsletter',
          recipient_email: email,
          status: 'pending',
          metadata: { newsletter_id: newsletter.id, subject: newsletter.subject },
        })

        try {
          const response = await fetch(`${GATEWAY_URL}/emails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'X-Connection-Api-Key': RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [email],
              subject: newsletter.subject,
              html,
            }),
          })

          if (response.ok) {
            sentCount++
            await supabase.from('email_send_log').insert({
              message_id: messageId,
              template_name: 'newsletter',
              recipient_email: email,
              status: 'sent',
              metadata: { newsletter_id: newsletter.id, subject: newsletter.subject },
            })
          } else {
            const errText = await response.text()
            failedCount++
            await supabase.from('email_send_log').insert({
              message_id: messageId,
              template_name: 'newsletter',
              recipient_email: email,
              status: 'failed',
              error_message: errText.slice(0, 500),
              metadata: { newsletter_id: newsletter.id, subject: newsletter.subject },
            })
          }

          await new Promise(r => setTimeout(r, 100))
        } catch (err) {
          failedCount++
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: 'newsletter',
            recipient_email: email,
            status: 'failed',
            error_message: err instanceof Error ? err.message : 'Unknown error',
            metadata: { newsletter_id: newsletter.id, subject: newsletter.subject },
          })
        }
      }

      await supabase
        .from('newsletters')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          recipient_count: sentCount,
        })
        .eq('id', newsletter.id)

      console.log(`Scheduled newsletter "${newsletter.subject}" sent to ${sentCount}/${recipients.length}`)
      results.push({ id: newsletter.id, status: 'sent', sentCount, failedCount })
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error processing scheduled newsletters:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildNewsletterHtml(newsletter: any): string {
  const imageUrl = newsletter.image_url

  const formatText = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  const paragraphs = (newsletter.content || '')
    .split('\n')
    .filter((p: string) => p.trim())
    .map((p: string) =>
      `<p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 16px;">${formatText(p.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&lt;strong&gt;/g, '<strong>').replace(/&lt;\/strong&gt;/g, '</strong>'))}</p>`
    )
    .join('')

  const heroImage = imageUrl
    ? `<img src="${imageUrl}" alt="Newsletter" style="width:100%;max-width:600px;height:auto;display:block;border-radius:8px;margin:0 0 24px;" />`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:${BRAND_COLOR};padding:28px 25px;text-align:center;">
      <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:10px 24px;">
        <img src="${LOGO_URL}" alt="${SITE}" style="max-width:200px;height:auto;display:block;" />
      </div>
    </div>
    <div style="padding:30px 25px 20px;">
      <h2 style="font-size:22px;font-weight:bold;color:#1a1a1a;margin:0 0 20px;">${newsletter.subject}</h2>
      ${heroImage}
      ${paragraphs}
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">
      <p style="font-size:13px;color:#999;margin:0 0 20px;line-height:1.5;">
        Warm regards,<br>The ${SITE} Team<br>
        <a href="https://www.innersparkafrica.com" style="color:${BRAND_COLOR};">www.innersparkafrica.com</a>
      </p>
      <p style="font-size:11px;color:#bbb;text-align:center;">
        You received this email because you subscribed to ${SITE} updates.
      </p>
    </div>
    <div style="margin:0;">
      <a href="https://www.innersparkafrica.com" target="_blank">
        <img src="${FOOTER_BANNER_URL}" alt="Get the InnerSpark Mobile App" style="width:100%;max-width:600px;height:auto;display:block;" />
      </a>
    </div>
  </div>
</body></html>`
}
