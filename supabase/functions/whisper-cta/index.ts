import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const ALLOWED = new Set(['cta_book', 'cta_talk'])
const SITE = 'https://www.innersparkafrica.com'

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    const token = (url.searchParams.get('t') || '').trim()
    const action = (url.searchParams.get('a') || '').trim()
    const dest = action === 'cta_book' ? `${SITE}/specialists` : `${SITE}/contact`

    if (token && ALLOWED.has(action)) {
      const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      )
      const { data: w } = await admin
        .from('whispers')
        .select('id')
        .eq('public_token', token)
        .maybeSingle()
      if (w) {
        await admin.from('whisper_events').insert({
          whisper_id: w.id,
          event_type: action,
          user_agent: req.headers.get('user-agent'),
          referrer: req.headers.get('referer'),
          country: req.headers.get('cf-ipcountry') || null,
          metadata: { source: 'email' },
        })
      }
    }

    return Response.redirect(dest, 302)
  } catch (e) {
    console.error('whisper-cta error', e)
    return Response.redirect(SITE, 302)
  }
})