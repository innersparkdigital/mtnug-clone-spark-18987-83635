import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const SITE_URL = 'https://www.innersparkafrica.com'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    const reportId = url.searchParams.get('report_id')
    const serviceId = url.searchParams.get('service_id')
    if (!reportId || !serviceId) {
      return new Response('Missing parameters', { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch report & company
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

    let companyName = 'Unknown company'
    if (report?.company_id) {
      const { data: company } = await supabase
        .from('corporate_companies')
        .select('name, contact_person, contact_email, contact_phone')
        .eq('id', report.company_id)
        .maybeSingle()
      if (company) companyName = company.name

      // Log interest
      await supabase.from('corporate_service_interests').insert({
        report_id: reportId,
        company_id: report.company_id,
        service_id: serviceId,
        service_name_snapshot: service?.name || 'Unknown service',
        ip_address: req.headers.get('x-forwarded-for') || null,
        user_agent: req.headers.get('user-agent') || null,
      })

      // Alert admin via Resend
      if (RESEND_API_KEY && service) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color:#5B6ABF">🔔 Service interest from ${companyName}</h2>
            <p><strong>${companyName}</strong> just clicked on a recommended service in their wellbeing report:</p>
            <div style="background:#eff2ff;border-left:4px solid #5B6ABF;padding:14px 18px;border-radius:6px;margin:14px 0">
              <div style="font-size:18px;font-weight:700;color:#1a1a1a">${service.name}</div>
              ${service.description ? `<div style="margin-top:6px;color:#555">${service.description}</div>` : ''}
            </div>
            <p><strong>Company contact:</strong><br/>
              ${company?.contact_person || '—'}<br/>
              ${company?.contact_email || '—'}<br/>
              ${company?.contact_phone || '—'}
            </p>
            <p style="color:#666;font-size:12px">Clicked at ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })} (Nairobi time)</p>
            <p><a href="https://www.innersparkafrica.com/corporate-admin" style="background:#5B6ABF;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Open Corporate Admin →</a></p>
          </div>
        `
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'InnerSpark Africa <noreply@innersparkafrica.com>',
            to: ['info@innersparkafrica.com'],
            subject: `🔔 ${companyName} interested in: ${service.name}`,
            html,
          }),
        }).catch((e) => console.error('Resend alert failed', e))
      }
    }

    // Redirect HR to a friendly thank-you page
    const redirectTo = `${SITE_URL}/thank-you?source=corporate-service-interest&service=${encodeURIComponent(service?.name || 'service')}`
    return new Response(null, { status: 302, headers: { Location: redirectTo } })
  } catch (e) {
    console.error('track-service-interest error', e)
    return new Response('Error', { status: 500 })
  }
})