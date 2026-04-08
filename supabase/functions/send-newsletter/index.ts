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

  // Verify caller is authenticated
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Verify admin role
  const anonClient = createClient(
    SUPABASE_URL,
    Deno.env.get('SUPABASE_ANON_KEY') || ''
  )
  const { data: { user }, error: authError } = await anonClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle()

  if (!roleData) {
    return new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { newsletterId } = await req.json()
    if (!newsletterId) {
      return new Response(JSON.stringify({ error: 'newsletterId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch newsletter
    const { data: newsletter, error: nlErr } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', newsletterId)
      .single()

    if (nlErr || !newsletter) {
      return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (newsletter.status === 'sent') {
      return new Response(JSON.stringify({ error: 'Newsletter already sent' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Determine recipients
    let recipients: string[] = []
    const filter = newsletter.recipient_filter as any

    if (filter?.type === 'custom' && Array.isArray(filter.emails)) {
      recipients = filter.emails
    } else {
      // Get all active subscribers
      const { data: subs } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('is_active', true)

      recipients = (subs || []).map((s: any) => s.email)
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'No recipients found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Build the newsletter HTML
    const html = buildNewsletterHtml(newsletter)

    // Send emails in batches of 50
    let sentCount = 0
    const batchSize = 50
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)

      // Resend supports batch sending via bcc, but for tracking we send individually
      for (const email of batch) {
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
          } else {
            console.error(`Failed to send to ${email}:`, await response.text())
          }

          // Small delay to avoid rate limits
          await new Promise(r => setTimeout(r, 100))
        } catch (err) {
          console.error(`Error sending to ${email}:`, err)
        }
      }
    }

    // Update newsletter status
    await supabase
      .from('newsletters')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipient_count: sentCount,
      })
      .eq('id', newsletterId)

    console.log(`Newsletter "${newsletter.subject}" sent to ${sentCount}/${recipients.length} recipients`)

    return new Response(JSON.stringify({ success: true, recipientCount: sentCount }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error in send-newsletter:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildNewsletterHtml(newsletter: any): string {
  const imageUrl = newsletter.image_url

  // Convert **bold** syntax to <strong> tags
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
