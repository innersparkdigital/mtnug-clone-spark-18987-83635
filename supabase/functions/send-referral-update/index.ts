// Sends a branded referral-progression email to the referrer:
// contacted -> booked -> paid -> reward_ready -> reward_claimed
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const FROM_EMAIL = 'InnerSpark Africa <info@innersparkafrica.com>'
const LOGO = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png'
const BANNER = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/email-footer-banner.png'

const copyFor = (
  stage: string,
  who: string,
  reward: string,
): { subject: string; heading: string; body: string } => {
  switch (stage) {
    case 'contacted':
      return {
        subject: `${who} you referred has reached out to InnerSpark`,
        heading: 'Someone you referred just contacted us 💙',
        body: `${who} used your referral link and has just reached out to our team. We'll keep you posted as they book and complete their first session — that's when your reward unlocks.`,
      }
    case 'booked':
      return {
        subject: `${who} you referred has booked a session`,
        heading: 'Your referral has booked a session 🎉',
        body: `${who} has booked their first therapy session with InnerSpark. Once their payment comes through, your ${reward} referral reward becomes claimable.`,
      }
    case 'paid':
      return {
        subject: `${who} you referred has paid — reward unlocked`,
        heading: 'Your reward is unlocked ✅',
        body: `${who} has paid for their session. Your reward of ${reward} is now confirmed and will be applied to your next session.`,
      }
    case 'reward_ready':
      return {
        subject: `Claim your ${reward} InnerSpark referral reward`,
        heading: 'Your referral reward is ready to claim 🎁',
        body: `Thank you for sharing InnerSpark. Your reward of ${reward} is ready — reply to this email or WhatsApp us on +256 792 085 773 and we'll apply it to your next session.`,
      }
    default:
      return {
        subject: 'Your InnerSpark referral reward has been applied',
        heading: 'Reward applied — thank you 💙',
        body: `Your referral reward of ${reward} has been applied. Keep sharing your link: every person you refer who books and pays earns you another reward.`,
      }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) return json({ error: 'Email service not configured' }, 500)

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { conversion_id, stage } = await req.json()
    if (!conversion_id || !stage) return json({ error: 'conversion_id and stage are required' }, 400)

    const { data: conv, error: cErr } = await supabase
      .from('referral_conversions')
      .select('*')
      .eq('id', conversion_id)
      .maybeSingle()
    if (cErr || !conv) return json({ error: 'Conversion not found' }, 404)

    const { data: link } = await supabase
      .from('referral_links')
      .select('*')
      .eq('id', conv.referral_link_id)
      .maybeSingle()
    if (!link?.referrer_email) return json({ error: 'Referrer has no email on file' }, 400)

    const currency = link.currency || 'UGX'
    const rewardAmount = Number(conv.reward_amount || 0)
    const reward = rewardAmount
      ? `${currency} ${rewardAmount.toLocaleString()}`
      : `${link.reward_percent || 5}% off your next session`
    const who = conv.client_name || 'Someone'
    const { subject, heading, body } = copyFor(stage, who, reward)

    const html = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f7f7fb;padding:24px;color:#222">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
          <div style="background:#5B6ABF;padding:24px;text-align:center">
            <img src="${LOGO}" alt="InnerSpark Africa" width="180" />
          </div>
          <div style="padding:24px">
            <h1 style="font-size:20px;margin:0 0 12px;color:#1a1a1a">${heading}</h1>
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#444">Hi ${link.referrer_name || 'there'},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444">${body}</p>
            <div style="background:#f4f5fb;border-radius:8px;padding:16px;font-size:14px;color:#333">
              <div><strong>Referral code:</strong> ${link.slug}</div>
              <div><strong>Reward:</strong> ${reward}</div>
              <div><strong>Status:</strong> ${String(stage).replace('_', ' ')}</div>
            </div>
            <p style="margin:20px 0 0;font-size:13px;color:#666">Questions? WhatsApp +256 792 085 773 or reply to this email.</p>
            <p style="margin:12px 0 0;font-size:13px;color:#444">Warm regards,<br/>The InnerSpark Africa Team</p>
          </div>
          <img src="${BANNER}" alt="InnerSpark Africa" width="600" style="display:block;width:100%" />
        </div>
      </div>`

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [link.referrer_email], subject, html }),
    })
    const rj = await res.json()
    if (!res.ok) {
      console.error('Resend error', res.status, rj)
      return json({ error: 'Email failed', status: res.status, details: rj }, res.status)
    }

    const notified: string[] = Array.isArray(conv.stages_notified) ? conv.stages_notified : []
    if (!notified.includes(stage)) {
      await supabase
        .from('referral_conversions')
        .update({ stages_notified: [...notified, stage] })
        .eq('id', conversion_id)
    }

    return json({ success: true, email_id: rj.id })
  } catch (err) {
    console.error('send-referral-update error', err)
    return json({ error: (err as Error).message }, 500)
  }
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}