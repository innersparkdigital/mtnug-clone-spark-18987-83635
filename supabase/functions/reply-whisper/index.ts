import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const FROM_EMAIL = 'InnerSpark Whisper <info@innersparkafrica.com>'
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png'
const FOOTER_BANNER_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/footer-banner.png'
const SITE_URL = 'https://www.innersparkafrica.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return jsonError('Unauthorized', 401)

    // Verify caller is admin via their JWT
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user) return jsonError('Unauthorized', 401)

    const { data: roleRow } = await userClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle()
    if (!roleRow) return jsonError('Admin role required', 403)

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const form = await req.formData()
    const whisperId = String(form.get('whisper_id') || '')
    const replyText = String(form.get('reply_text') || '').slice(0, 4000)
    const audio = form.get('audio') as File | null

    if (!whisperId) return jsonError('whisper_id required', 400)
    if (!audio && !replyText.trim()) return jsonError('Provide a voice reply or text', 400)

    const { data: whisper, error: wErr } = await admin
      .from('whispers')
      .select('id, email, public_token, reply_audio_path')
      .eq('id', whisperId)
      .maybeSingle()
    if (wErr || !whisper) return jsonError('Whisper not found', 404)

    let replyAudioPath = whisper.reply_audio_path
    if (audio && audio instanceof File) {
      if (audio.size > 20 * 1024 * 1024) return jsonError('Reply audio too large', 400)
      const mime = audio.type || 'audio/webm'
      const ext = mime.includes('mp4') ? 'mp4'
        : mime.includes('mpeg') ? 'mp3'
        : mime.includes('ogg') ? 'ogg'
        : mime.includes('wav') ? 'wav'
        : 'webm'
      const fileName = `replies/${whisperId}-${crypto.randomUUID()}.${ext}`
      const bytes = new Uint8Array(await audio.arrayBuffer())
      const { error: upErr } = await admin.storage
        .from('whispers')
        .upload(fileName, bytes, { contentType: mime, upsert: false })
      if (upErr) {
        console.error('Reply upload failed', upErr)
        return jsonError('Could not save reply audio', 500)
      }
      replyAudioPath = fileName
    }

    const { error: updErr } = await admin
      .from('whispers')
      .update({
        status: 'replied',
        reply_text: replyText.trim() || null,
        reply_audio_path: replyAudioPath,
        reply_sent_at: new Date().toISOString(),
        replied_by: userData.user.id,
      })
      .eq('id', whisperId)

    if (updErr) {
      console.error('Update whisper failed', updErr)
      return jsonError('Could not save reply', 500)
    }

    // Build a signed URL to the audio so the recipient can listen straight from the email
    let audioUrl: string | null = null
    if (replyAudioPath) {
      const { data: signed } = await admin.storage
        .from('whispers')
        .createSignedUrl(replyAudioPath, 60 * 60 * 24 * 7) // 7 days
      audioUrl = signed?.signedUrl || null
    }

    // Notify user
    const replyUrl = `https://www.innersparkafrica.com/whisper/${whisper.public_token}`
    sendEmail({
      to: whisper.email,
      subject: 'Your Whisper reply is ready 🤍',
      html: replyEmailHtml({ replyUrl, audioUrl, replyText: replyText.trim() || null }),
    }).catch((e) => console.error('reply email failed', e))

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('reply-whisper error', e)
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

function replyEmailHtml({ replyUrl, audioUrl, replyText }: { replyUrl: string; audioUrl: string | null; replyText: string | null }) {
  const audioBlock = audioUrl ? `
        <p style="text-align:center;margin:24px 0">
          <a href="${audioUrl}" style="background:#0a4a8a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;display:inline-block">
            ▶ Play / download voice reply
          </a>
        </p>
        <p style="font-size:12px;color:#6b7280;text-align:center;margin:-8px 0 16px">
          Tap the button above to listen on your phone. Link valid for 7 days.
        </p>
      ` : ''

  const textBlock = replyText ? `
        <div style="background:#f3f6fb;border-left:4px solid #0a4a8a;padding:16px 18px;border-radius:8px;margin:20px 0;font-size:15px;line-height:1.6;color:#1f2937;white-space:pre-wrap">
          ${escapeHtml(replyText)}
        </div>
      ` : ''

  return `
    <div style="background:#f3f4f6;padding:24px 0;font-family:system-ui,Segoe UI,Arial,sans-serif;color:#1f2937">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
        <div style="background:#0a4a8a;padding:20px;text-align:center">
          <div style="display:inline-block;background:#ffffff;padding:10px 16px;border-radius:12px">
            <img src="${LOGO_URL}" alt="InnerSpark Africa" style="height:40px;display:block" />
          </div>
          <h1 style="margin:16px 0 0;font-size:22px;color:#ffffff;font-weight:600">A therapist has replied to your Whisper 🤍</h1>
        </div>
        <div style="padding:28px 28px 8px">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">
            Your reply is ready. Find a quiet moment, put on headphones, and listen when you're ready.
          </p>
          ${audioBlock}
          ${textBlock}
          <div style="margin:28px 0 8px;padding:20px;background:#f3f6fb;border-radius:12px;text-align:center">
            <p style="margin:0 0 12px;font-size:15px;color:#1f2937;font-weight:600">
              Want to continue the conversation?
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.5">
              Book a private session or talk one-on-one with a licensed therapist.
            </p>
            <a href="${SITE_URL}/specialists" style="background:#0a4a8a;color:#fff;text-decoration:none;padding:12px 26px;border-radius:999px;font-weight:600;display:inline-block;margin:0 4px 8px">
              Book a Therapist
            </a>
            <a href="${SITE_URL}/contact" style="background:#ffffff;color:#0a4a8a;text-decoration:none;padding:11px 24px;border-radius:999px;font-weight:600;display:inline-block;border:1.5px solid #0a4a8a;margin:0 4px 8px">
              Talk to a Therapist
            </a>
          </div>
          <p style="font-size:13px;color:#6b7280;margin:20px 0 0;text-align:center">
            Prefer the web? <a href="${replyUrl}" style="color:#0a4a8a">Open your private Whisper page</a>.
          </p>
        </div>
        <a href="${SITE_URL}" style="display:block">
          <img src="${FOOTER_BANNER_URL}" alt="InnerSpark Africa" style="width:100%;display:block" />
        </a>
        <div style="padding:16px 28px;text-align:center;background:#fafafa">
          <p style="font-size:12px;color:#9ca3af;margin:0">
            This message was sent by InnerSpark Africa. Your identity remains anonymous to your therapist.
          </p>
        </div>
      </div>
    </div>
  `
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}