import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const FROM_EMAIL = 'InnerSpark Whisper <info@innersparkafrica.com>'
const ADMIN_EMAIL = 'info@innersparkafrica.com'
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png'
const FOOTER_BANNER_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/footer-banner.png'
const SITE_URL = 'https://www.innersparkafrica.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const form = await req.formData()
    const email = String(form.get('email') || '').trim().toLowerCase()
    const audio = form.get('audio') as File | null
    const duration = Number(form.get('duration') || 0)
    const language = String(form.get('language') || 'en')
    const topicHint = String(form.get('topic_hint') || '').slice(0, 200)

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError('A valid email is required', 400)
    }
    if (!audio || !(audio instanceof File)) {
      return jsonError('Audio recording is required', 400)
    }
    if (audio.size > 15 * 1024 * 1024) {
      return jsonError('Recording is too large (max 15MB / ~3 minutes)', 400)
    }
    if (duration > 0 && duration > 240) {
      return jsonError('Recording too long (max 3 minutes)', 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Determine file extension
    const mime = audio.type || 'audio/webm'
    const ext = mime.includes('mp4') ? 'mp4'
      : mime.includes('mpeg') ? 'mp3'
      : mime.includes('ogg') ? 'ogg'
      : mime.includes('wav') ? 'wav'
      : 'webm'

    const folder = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
    const fileName = `${folder}/user-${crypto.randomUUID()}.${ext}`

    const bytes = new Uint8Array(await audio.arrayBuffer())
    const { error: upErr } = await supabase.storage
      .from('whispers')
      .upload(fileName, bytes, { contentType: mime, upsert: false })
    if (upErr) {
      console.error('Storage upload failed', upErr)
      return jsonError('Could not save recording. Please try again.', 500)
    }

    const { data: row, error: insErr } = await supabase
      .from('whispers')
      .insert({
        email,
        audio_path: fileName,
        duration_seconds: duration > 0 ? Math.round(duration) : null,
        language,
        topic_hint: topicHint || null,
        user_agent: req.headers.get('user-agent') || null,
      })
      .select('id, public_token')
      .single()

    if (insErr || !row) {
      console.error('Insert whisper failed', insErr)
      return jsonError('Could not register your whisper. Please try again.', 500)
    }

    // Newsletter auto-enroll (silent)
    try {
      await supabase.from('newsletter_subscribers').upsert(
        { email, is_active: true },
        { onConflict: 'email', ignoreDuplicates: true }
      )
    } catch (e) { console.warn('newsletter upsert failed', e) }

    const replyUrl = `https://www.innersparkafrica.com/whisper/${row.public_token}`

    // Fire-and-forget emails
    sendEmail({
      to: email,
      subject: 'Your Whisper has been received 🤍',
      html: userEmailHtml(replyUrl, row.public_token),
    }).catch((e) => console.error('user email failed', e))

    sendEmail({
      to: ADMIN_EMAIL,
      subject: `🎙️ New Whisper from ${email}`,
      html: adminEmailHtml(email, duration, topicHint, row.public_token),
    }).catch((e) => console.error('admin email failed', e))

    return new Response(
      JSON.stringify({ success: true, public_token: row.public_token, reply_url: replyUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    console.error('submit-whisper error', e)
    return jsonError('Unexpected error', 500)
  }
})

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) return
  await fetch(`${GATEWAY_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': RESEND_API_KEY,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  })
}

function userEmailHtml(replyUrl: string, token: string) {
  const fnBase = `${Deno.env.get('SUPABASE_URL')}/functions/v1/whisper-cta`
  const bookUrl = `${fnBase}?t=${encodeURIComponent(token)}&a=cta_book`
  const talkUrl = `${fnBase}?t=${encodeURIComponent(token)}&a=cta_talk`
  return `
    <div style="background:#f3f4f6;padding:24px 0;font-family:system-ui,Segoe UI,Arial,sans-serif;color:#1f2937">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
        <div style="background:#0a4a8a;padding:20px;text-align:center">
          <div style="display:inline-block;background:#ffffff;padding:10px 16px;border-radius:12px">
            <img src="${LOGO_URL}" alt="InnerSpark Africa" style="height:40px;display:block" />
          </div>
          <h1 style="margin:16px 0 0;font-size:22px;color:#ffffff;font-weight:600">We hear you. 🤍</h1>
        </div>
        <div style="padding:28px">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">
            Your Whisper has been safely received. A licensed therapist from InnerSpark Africa will listen
            carefully and reply with a personal voice note within <strong>24 hours</strong>.
          </p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">
            You'll be notified by email the moment your reply is ready. You can also check anytime:
          </p>
          <p style="text-align:center;margin:24px 0">
            <a href="${replyUrl}" style="background:#0a4a8a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;display:inline-block">
              View my Whisper
            </a>
          </p>
          <div style="margin:28px 0 8px;padding:20px;background:#f3f6fb;border-radius:12px;text-align:center">
            <p style="margin:0 0 12px;font-size:15px;color:#1f2937;font-weight:600">
              Don't want to wait? Talk to a therapist now.
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.5">
              Book a private session or chat one-on-one with a licensed therapist today.
            </p>
            <a href="${bookUrl}" style="background:#0a4a8a;color:#fff;text-decoration:none;padding:12px 26px;border-radius:999px;font-weight:600;display:inline-block;margin:0 4px 8px">
              Book a Therapist
            </a>
            <a href="${talkUrl}" style="background:#ffffff;color:#0a4a8a;text-decoration:none;padding:11px 24px;border-radius:999px;font-weight:600;display:inline-block;border:1.5px solid #0a4a8a;margin:0 4px 8px">
              Talk to a Therapist
            </a>
          </div>
          <p style="font-size:13px;color:#6b7280;margin:20px 0 0">
            Your Whisper is anonymous to the public — no name, no profile. Only our small team of licensed
            therapists can listen, and only for the purpose of replying to you.
          </p>
          <p style="font-size:13px;color:#6b7280;margin:14px 0 0">
            If you are in immediate crisis, please call your local emergency line or reach us on WhatsApp:
            <a href="https://wa.me/256792085773" style="color:#0a4a8a">+256 792 085 773</a>.
          </p>
        </div>
        <a href="${SITE_URL}" style="display:block">
          <img src="${FOOTER_BANNER_URL}" alt="InnerSpark Africa" style="width:100%;display:block" />
        </a>
        <div style="padding:16px 28px;text-align:center;background:#fafafa">
          <p style="font-size:12px;color:#9ca3af;margin:0">
            Sent with care by InnerSpark Africa.
          </p>
        </div>
      </div>
    </div>
  `
}

function adminEmailHtml(email: string, duration: number, topic: string, token: string) {
  return `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#0a4a8a">🎙️ New Whisper received</h2>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Duration:</strong> ${duration ? duration + 's' : 'unknown'}</p>
      <p><strong>Topic hint:</strong> ${topic || '—'}</p>
      <p><strong>Token:</strong> ${token}</p>
      <p style="margin-top:20px">
        <a href="https://www.innersparkafrica.com/learning/admin-dashboard?tab=whispers"
           style="background:#0a4a8a;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px">
          Open Whisper inbox
        </a>
      </p>
    </div>
  `
}