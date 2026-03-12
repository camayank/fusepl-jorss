import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResend(): Resend | null {
  if (resendClient) return resendClient
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  resendClient = new Resend(key)
  return resendClient
}

interface ValuationEmailData {
  to: string
  companyName: string
  compositeValue: string
  compositeRange: string
  confidenceScore: number
  methodCount: number
  reportUrl?: string
}

function formatINR(value: number): string {
  if (value === 0) return 'Rs 0'
  const crore = 10_000_000
  if (value >= crore) return `Rs ${(value / crore).toFixed(1)} Cr`
  return `Rs ${(value / 100_000).toFixed(0)} L`
}

export async function sendValuationEmail(data: ValuationEmailData): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.warn('[email] Resend not configured — skipping email')
    return false
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'valuation@firstunicornstartup.com'

  try {
    await resend.emails.send({
      from: `First Unicorn Startup <${fromEmail}>`,
      to: data.to,
      subject: `Your Startup Valuation Report — ${data.companyName}`,
      html: generateValuationEmailHTML(data),
    })
    return true
  } catch (err) {
    console.error('[email] Failed to send:', err)
    return false
  }
}

function generateValuationEmailHTML(data: ValuationEmailData): string {
  const confidenceLabel =
    data.confidenceScore >= 70 ? 'High' :
    data.confidenceScore >= 40 ? 'Medium' : 'Low'

  const confidenceColor =
    data.confidenceScore >= 70 ? '#34d399' :
    data.confidenceScore >= 40 ? '#2db88c' : '#ef4444'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0d0d0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:24px;">&#x1f984;</span>
              <span style="font-size:18px;font-weight:700;color:#2db88c;margin-left:8px;">First Unicorn Startup</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#161618;border:1px solid #2a2a2e;border-radius:16px;padding:40px 32px;">
              <!-- Greeting -->
              <p style="color:#9a9aa0;font-size:14px;margin:0 0 8px;">Your valuation report is ready</p>
              <h1 style="color:#f0f0f2;font-size:24px;font-weight:700;margin:0 0 28px;">${data.companyName}</h1>

              <!-- Valuation Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1e;border:1px solid #2db88c30;border-radius:12px;padding:24px;margin-bottom:24px;">
                <tr>
                  <td style="text-align:center;">
                    <p style="color:#9a9aa0;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Estimated Valuation</p>
                    <p style="color:#f0f0f2;font-size:32px;font-weight:700;margin:0 0 4px;">${data.compositeValue}</p>
                    <p style="color:#6a6a72;font-size:13px;margin:0;">Range: ${data.compositeRange}</p>
                  </td>
                </tr>
              </table>

              <!-- Stats Row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="33%" style="text-align:center;padding:12px 0;border-right:1px solid #2a2a2e;">
                    <p style="color:${confidenceColor};font-size:22px;font-weight:700;margin:0;">${data.confidenceScore}</p>
                    <p style="color:#6a6a72;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:4px 0 0;">Confidence (${confidenceLabel})</p>
                  </td>
                  <td width="33%" style="text-align:center;padding:12px 0;border-right:1px solid #2a2a2e;">
                    <p style="color:#f0f0f2;font-size:22px;font-weight:700;margin:0;">${data.methodCount}</p>
                    <p style="color:#6a6a72;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:4px 0 0;">Methods</p>
                  </td>
                  <td width="33%" style="text-align:center;padding:12px 0;">
                    <p style="color:#f0f0f2;font-size:22px;font-weight:700;margin:0;">10K</p>
                    <p style="color:#6a6a72;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:4px 0 0;">Simulations</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              ${data.reportUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;">
                    <a href="${data.reportUrl}" style="display:inline-block;background:#2db88c;color:#0d0d0f;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                      View Full Report
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Disclaimer -->
              <p style="color:#4a4a52;font-size:11px;margin:24px 0 0;text-align:center;line-height:1.5;">
                This is an indicative valuation estimate, not a certified valuation report.
                For regulatory-grade valuations, visit firstunicornstartup.com
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="color:#4a4a52;font-size:11px;margin:0;">
                Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer
              </p>
              <p style="color:#3a3a42;font-size:10px;margin:8px 0 0;">
                firstunicornstartup.com &bull; IVS 105 Aligned &bull; Damodaran India Data
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// --- Lead notification to business owner ---
interface LeadNotificationData {
  email: string
  companyName: string
  sector: string
  stage: string
  annualRevenue: number
  compositeValue: string
  compositeRange: string
  confidenceScore: number
  purpose: string
}

export async function sendLeadNotification(data: LeadNotificationData): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.warn('[email] Resend not configured — skipping lead notification')
    return false
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'valuation@firstunicornstartup.com'
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL || 'info@firstunicornstartup.com'

  try {
    await resend.emails.send({
      from: `First Unicorn Startup <${fromEmail}>`,
      to: notifyEmail,
      subject: `New Lead: ${data.companyName} (${data.compositeValue})`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f5f5f5;font-family:-apple-system,sans-serif;">
  <table style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e0e0e0;">
    <tr><td>
      <h2 style="margin:0 0 20px;color:#1a1a1a;">New Valuation Lead</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;">${data.email}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Company</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;border-top:1px solid #f0f0f0;">${data.companyName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Sector</td><td style="padding:8px 0;color:#1a1a1a;border-top:1px solid #f0f0f0;">${data.sector}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Stage</td><td style="padding:8px 0;color:#1a1a1a;border-top:1px solid #f0f0f0;">${data.stage}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Annual Revenue</td><td style="padding:8px 0;color:#1a1a1a;border-top:1px solid #f0f0f0;">${formatINR(data.annualRevenue)}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Valuation</td><td style="padding:8px 0;font-weight:700;color:#0d9668;border-top:1px solid #f0f0f0;">${data.compositeValue}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Range</td><td style="padding:8px 0;color:#1a1a1a;border-top:1px solid #f0f0f0;">${data.compositeRange}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Confidence</td><td style="padding:8px 0;color:#1a1a1a;border-top:1px solid #f0f0f0;">${data.confidenceScore}/100</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;border-top:1px solid #f0f0f0;">Purpose</td><td style="padding:8px 0;color:#1a1a1a;border-top:1px solid #f0f0f0;">${data.purpose}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
    return true
  } catch (err) {
    console.error('[email] Failed to send lead notification:', err)
    return false
  }
}

export { formatINR as formatINREmail }
