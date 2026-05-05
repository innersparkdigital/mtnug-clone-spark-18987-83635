import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token') || (await safeJson(req))?.token
    if (!token || token.length < 8) {
      return json({ error: 'Token required' }, 400)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data, error } = await admin.rpc('get_whisper_by_token', { _token: token })
    if (error) {
      console.error('rpc error', error)
      return json({ error: 'Lookup failed' }, 500)
    }
    if (!data) return json({ error: 'Not found' }, 404)

    const whisper = data as Record<string, any>
    let replyAudioUrl: string | null = null
    if (whisper.reply_audio_path) {
      const { data: signed } = await admin.storage
        .from('whispers')
        .createSignedUrl(whisper.reply_audio_path, 60 * 60) // 1 hour
      replyAudioUrl = signed?.signedUrl || null
    }

    return json({
      status: whisper.status,
      reply_text: whisper.reply_text,
      reply_audio_url: replyAudioUrl,
      reply_sent_at: whisper.reply_sent_at,
      created_at: whisper.created_at,
      duration_seconds: whisper.duration_seconds,
    })
  } catch (e) {
    console.error(e)
    return json({ error: 'Unexpected error' }, 500)
  }
})

async function safeJson(req: Request) {
  try { return await req.json() } catch { return null }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}