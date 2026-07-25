// Sends a client receipt: uploads the PDF (base64) to the private `receipts` bucket,
// generates a 7-day signed URL, and emails the client via Resend with the PDF attached.
// Also returns the signed URL so the admin UI can share it on WhatsApp.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const FROM_EMAIL = 'InnerSpark Finance <finance@innersparkafrica.com>'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return json({ error: 'Email service not configured' }, 500)
    }

    const body = await req.json()
    const {
      recipient_email,
      recipient_name = 'Client',
      pdf_base64,          // raw base64 (no data URI prefix)
      receipt_number,
      amount_ugx,
      session_type,
      session_date,
      client_id,           // optional — updates therapist_clients.receipt_url
      send_email = true,
    } = body || {}

    if (!pdf_base64 || !receipt_number) {
      return json({ error: 'pdf_base64 and receipt_number are required' }, 400)
    }
    if (send_email && !recipient_email) {
      return json({ error: 'recipient_email is required when send_email=true' }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Decode base64 → Uint8Array
    const bytes = Uint8Array.from(atob(pdf_base64), (c) => c.charCodeAt(0))
    const path = `${new Date().getFullYear()}/${receipt_number}.pdf`

    const { error: upErr } = await supabase.storage
      .from('receipts')
      .upload(path, bytes, { contentType: 'application/pdf', upsert: true })
    if (upErr) {
      console.error('Upload error', upErr)
      return json({ error: 'Failed to upload receipt', details: upErr.message }, 500)
    }

    const { data: signed, error: sErr } = await supabase.storage
      .from('receipts')
      .createSignedUrl(path, 60 * 60 * 24 * 7) // 7 days
    if (sErr) {
      console.error('Signed URL error', sErr)
      return json({ error: 'Failed to sign receipt', details: sErr.message }, 500)
    }

    const signedUrl = signed.signedUrl

    // Update client record with receipt URL if id provided
    if (client_id) {
      await supabase
        .from('therapist_clients')
        .update({ receipt_number, receipt_url: signedUrl })
        .eq('id', client_id)
    }

    // Email with attachment (Resend supports base64 attachments)
    let emailId: string | null = null
    if (send_email) {
      const fmtAmount = new Intl.NumberFormat('en-UG').format(Number(amount_ugx || 0))
      const html = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f7f7fb;padding:24px;color:#222">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.06)">
            <div style="background:#5B6ABF;color:#fff;padding:20px 24px">
              <div style="font-size:14px;opacity:.85">Receipt from InnerSpark Africa</div>
              <div style="font-size:28px;font-weight:700;margin-top:4px">UGX ${fmtAmount}</div>
              <div style="font-size:13px;opacity:.9;margin-top:2px">Paid ${session_date || new Date().toLocaleDateString()}</div>
            </div>
            <div style="padding:20px 24px">
              <p style="margin:0 0 12px">Hi ${recipient_name},</p>
              <p style="margin:0 0 12px">Thank you for your payment. Your receipt <strong>${receipt_number}</strong> is attached to this email as a PDF.</p>
              <table style="width:100%;font-size:14px;margin:16px 0;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#666">Receipt number</td><td style="padding:6px 0;text-align:right;font-weight:600">${receipt_number}</td></tr>
                ${session_type ? `<tr><td style="padding:6px 0;color:#666">Session</td><td style="padding:6px 0;text-align:right;font-weight:600">${session_type}</td></tr>` : ''}
                <tr><td style="padding:6px 0;color:#666">Amount</td><td style="padding:6px 0;text-align:right;font-weight:600">UGX ${fmtAmount}</td></tr>
              </table>
              <p style="margin:16px 0 0;font-size:13px;color:#666">Questions? Reply to this email or WhatsApp us on +256 792 085 773.</p>
              <p style="margin:12px 0 0;font-size:13px">Warm regards,<br/>The InnerSpark Africa Team</p>
            </div>
          </div>
        </div>`

      const resendRes = await fetch(`${GATEWAY_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [recipient_email],
          subject: `Receipt ${receipt_number} — UGX ${fmtAmount} | InnerSpark Africa`,
          html,
          attachments: [{ filename: `${receipt_number}.pdf`, content: pdf_base64 }],
        }),
      })
      const rj = await resendRes.json()
      if (!resendRes.ok) {
        console.error('Resend error', rj)
        return json({ error: 'Email failed', details: rj, signed_url: signedUrl }, 200)
      }
      emailId = rj.id
    }

    return json({ success: true, signed_url: signedUrl, storage_path: path, email_id: emailId })
  } catch (err) {
    console.error('send-receipt-email error', err)
    return json({ error: (err as Error).message }, 500)
  }
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}