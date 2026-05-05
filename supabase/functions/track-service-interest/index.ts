import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const SITE_URL = 'https://www.innersparkafrica.com'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const url = new URL(req.url)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // POST: HR submitted the interest form
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const { report_id, service_id, contact_name, contact_email, contact_phone, message, preferred_mode } = body || {}
      if (!report_id || !service_id || !contact_email) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      const { data: report } = await supabase.from('corporate_reports').select('id, company_id').eq('id', report_id).maybeSingle()
      const { data: service } = await supabase.from('corporate_service_catalog').select('id, name, description, physical_price, virtual_price, per_employee_price, unit_label').eq('id', service_id).maybeSingle()
      let companyName = 'Unknown company'
      if (report?.company_id) {
        const { data: company } = await supabase.from('corporate_companies').select('name').eq('id', report.company_id).maybeSingle()
        if (company) companyName = company.name
      }
      await supabase.from('corporate_service_interests').insert({
        report_id, company_id: report?.company_id, service_id,
        service_name_snapshot: service?.name || 'Unknown service',
        contact_name, contact_email, contact_phone, message, preferred_mode,
        submitted: true,
        ip_address: req.headers.get('x-forwarded-for') || null,
        user_agent: req.headers.get('user-agent') || null,
      })
      if (RESEND_API_KEY && service) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 620px;">
            <h2 style="color:#5B6ABF">🔔 Service request from ${companyName}</h2>
            <p><strong>${companyName}</strong> submitted a request for a recommended service:</p>
            <div style="background:#eff2ff;border-left:4px solid #5B6ABF;padding:14px 18px;border-radius:6px;margin:14px 0">
              <div style="font-size:18px;font-weight:700;color:#1a1a1a">${service.name}</div>
              ${preferred_mode ? `<div style="margin-top:6px;color:#555"><strong>Preferred mode:</strong> ${preferred_mode}</div>` : ''}
            </div>
            <p><strong>Contact</strong><br/>
              ${contact_name || '—'}<br/>
              ${contact_email || '—'}<br/>
              ${contact_phone || '—'}
            </p>
            ${message ? `<p><strong>Message:</strong><br/>${String(message).replace(/</g,'&lt;')}</p>` : ''}
            <p style="color:#666;font-size:12px">Submitted ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })} (Nairobi)</p>
            <p><a href="https://www.innersparkafrica.com/corporate-admin" style="background:#5B6ABF;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Open Corporate Admin →</a></p>
          </div>`
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'InnerSpark Africa <noreply@innersparkafrica.com>',
            to: ['info@innersparkafrica.com'],
            reply_to: contact_email,
            subject: `🔔 ${companyName} requested: ${service.name}`,
            html,
          }),
        }).catch((e) => console.error('Resend alert failed', e))
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // GET: log click then redirect HR to the in-app request form
    const reportId = url.searchParams.get('report_id')
    const serviceId = url.searchParams.get('service_id')
    if (!reportId || !serviceId) {
      return new Response('Missing parameters', { status: 400 })
    }
    const { data: report } = await supabase
      .from('corporate_reports')
      .select('id, company_id, sent_to_email')
      .eq('id', reportId)
      .maybeSingle()

    const { data: service } = await supabase
      .from('corporate_service_catalog')
      .select('id, name, description')
      .eq('id', serviceId)
      .maybeSingle()

    if (report?.company_id) {
      await supabase.from('corporate_service_interests').insert({
        report_id: reportId,
        company_id: report.company_id,
        service_id: serviceId,
        service_name_snapshot: service?.name || 'Unknown service',
        ip_address: req.headers.get('x-forwarded-for') || null,
        user_agent: req.headers.get('user-agent') || null,
      })
    }

    // Redirect HR to the in-app form so they can submit a real request
    const redirectTo = `${SITE_URL}/corporate/service-request?report_id=${reportId}&service_id=${serviceId}`
    return new Response(null, { status: 302, headers: { Location: redirectTo } })
  } catch (e) {
    console.error('track-service-interest error', e)
    return new Response('Error', { status: 500 })
  }
})