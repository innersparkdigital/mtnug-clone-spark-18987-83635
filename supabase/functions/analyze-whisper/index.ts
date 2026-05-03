import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM = `You analyze short anonymous voice-note "whisper" submissions to a mental health service.
You are given only a short user-provided topic hint (no transcription). Be cautious and honest:
if the hint is empty or generic, mark theme as "unspecified" and urgency "low".
Always return ONE tool call with these fields:
- sentiment: positive | neutral | negative
- urgency: low | medium | high | crisis
- crisis: true if any self-harm/suicide/abuse/violence indication, otherwise false
- theme: 1-3 word theme (e.g. "work stress", "relationships", "anxiety", "grief", "loneliness", "unspecified")
- language: detected language code (en, lg, sw, fr, etc) or "unknown"
- summary: max 14 words, plain sentence describing what they likely want help with`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const { data: u } = await userClient.auth.getUser()
    if (!u.user) return json({ error: 'Unauthorized' }, 401)
    const { data: role } = await userClient
      .from('user_roles').select('role').eq('user_id', u.user.id).eq('role', 'admin').maybeSingle()
    if (!role) return json({ error: 'Admin only' }, 403)

    const body = await req.json().catch(() => ({} as any))
    const ids: string[] = Array.isArray(body.ids) ? body.ids.slice(0, 25) : []
    const reanalyze = !!body.reanalyze

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    let q = admin.from('whispers').select('id, topic_hint, language, ai_analyzed_at').limit(50)
    if (ids.length) q = q.in('id', ids) as any
    else if (!reanalyze) q = q.is('ai_analyzed_at', null) as any
    const { data: rows } = await q
    if (!rows?.length) return json({ ok: true, analyzed: 0 })

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) return json({ error: 'AI key missing' }, 500)

    let count = 0
    for (const r of rows) {
      try {
        const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-lite',
            messages: [
              { role: 'system', content: SYSTEM },
              { role: 'user', content: `Topic hint: "${(r.topic_hint || '').slice(0, 400)}"\nUI language tag: ${r.language || 'unknown'}` },
            ],
            tools: [{
              type: 'function',
              function: {
                name: 'classify_whisper',
                description: 'Return classification.',
                parameters: {
                  type: 'object',
                  properties: {
                    sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
                    urgency: { type: 'string', enum: ['low', 'medium', 'high', 'crisis'] },
                    crisis: { type: 'boolean' },
                    theme: { type: 'string' },
                    language: { type: 'string' },
                    summary: { type: 'string' },
                  },
                  required: ['sentiment', 'urgency', 'crisis', 'theme', 'language', 'summary'],
                  additionalProperties: false,
                },
              },
            }],
            tool_choice: { type: 'function', function: { name: 'classify_whisper' } },
          }),
        })
        if (aiResp.status === 429) return json({ error: 'Rate limited, try again shortly.' }, 429)
        if (aiResp.status === 402) return json({ error: 'AI credits exhausted.' }, 402)
        if (!aiResp.ok) { console.error('ai err', await aiResp.text()); continue }
        const ai = await aiResp.json()
        const args = ai?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments
        if (!args) continue
        const parsed = JSON.parse(args)
        await admin.from('whispers').update({
          ai_sentiment: parsed.sentiment,
          ai_urgency: parsed.urgency,
          ai_crisis: !!parsed.crisis,
          ai_theme: (parsed.theme || '').toLowerCase().slice(0, 60),
          ai_language_detected: (parsed.language || '').toLowerCase().slice(0, 12),
          ai_summary: (parsed.summary || '').slice(0, 240),
          ai_analyzed_at: new Date().toISOString(),
        }).eq('id', r.id)
        count++
      } catch (e) { console.error('analyze row err', e) }
    }
    return json({ ok: true, analyzed: count })
  } catch (e) {
    console.error('analyze-whisper error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}