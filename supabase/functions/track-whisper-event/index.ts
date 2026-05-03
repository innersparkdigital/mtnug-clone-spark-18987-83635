import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ALLOWED = new Set(['reply_opened', 'audio_played', 'cta_book', 'cta_talk'])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({} as any))
    const token = String(body.token || '').trim()
    const event_type = String(body.event_type || '').trim()
    if (!token || !ALLOWED.has(event_type)) {
      return json({ error: 'invalid' }, 400)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: w } = await admin
      .from('whispers')
      .select('id')
      .eq('public_token', token)
      .maybeSingle()
    if (!w) return json({ error: 'not found' }, 404)

    // Dedupe: don't insert duplicate reply_opened/audio_played within 60s
    if (event_type === 'reply_opened' || event_type === 'audio_played') {
      const since = new Date(Date.now() - 60_000).toISOString()
      const { data: recent } = await admin
        .from('whisper_events')
        .select('id')
        .eq('whisper_id', w.id)
        .eq('event_type', event_type)
        .gte('created_at', since)
        .maybeSingle()
      if (recent) return json({ ok: true, deduped: true })
    }

    const country = req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || null
    await admin.from('whisper_events').insert({
      whisper_id: w.id,
      event_type,
      user_agent: req.headers.get('user-agent'),
      referrer: req.headers.get('referer'),
      country,
    })

    return json({ ok: true })
  } catch (e) {
    console.error('track-whisper-event error', e)
    return json({ error: 'unexpected' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}