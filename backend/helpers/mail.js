const nodemailer = require('nodemailer')
const https = require('https')

function env(name) {
  return String(process.env[name] || '').trim()
}

function brevoConfigured() {
  return Boolean(env('BREVO_API_KEY'))
}

function resendConfigured() {
  return Boolean(env('RESEND_API_KEY'))
}

function smtpConfigured() {
  return Boolean(env('SMTP_USER') && env('SMTP_PASS'))
}

/** True when Brevo, Resend, or SMTP can deliver real email. */
function mailConfigured() {
  return brevoConfigured() || resendConfigured() || smtpConfigured()
}

function parseFrom(fromStr) {
  let raw = String(fromStr || '').trim()
  let match = raw.match(/^(.+?)\s*<([^>]+)>$/)
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() }
  }
  return { name: 'Avere', email: raw }
}

function createTransport() {
  return nodemailer.createTransport({
    host: env('SMTP_HOST') || 'smtp.gmail.com',
    port: Number(env('SMTP_PORT') || 587),
    secure: String(env('SMTP_SECURE') || 'false') === 'true',
    auth: {
      user: env('SMTP_USER'),
      // App passwords are often copied with spaces — strip them
      pass: env('SMTP_PASS').replace(/\s+/g, ''),
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    // Local/antivirus/proxy often injects self-signed certs in the chain
    tls: {
      rejectUnauthorized: false,
    },
  })
}

/**
 * HTTPS POST that tolerates local antivirus/proxy self-signed certs
 * (native fetch often throws "fetch failed" on Windows AV MITM).
 */
function httpsJsonRequest(urlString, { method = 'POST', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    let url = new URL(urlString)
    let payload = body == null ? null : String(body)
    let reqHeaders = { ...headers }
    if (payload != null && !reqHeaders['Content-Length']) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload)
    }

    let req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method,
        headers: reqHeaders,
        rejectUnauthorized: false,
        timeout: 20000,
      },
      (res) => {
        let chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          let text = Buffer.concat(chunks).toString('utf8')
          let data = null
          try {
            data = text ? JSON.parse(text) : null
          } catch {
            data = { raw: text }
          }
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data,
          })
        })
      }
    )
    req.on('timeout', () => {
      req.destroy(new Error('Mail API request timed out'))
    })
    req.on('error', reject)
    if (payload != null) req.write(payload)
    req.end()
  })
}

async function sendWithBrevo({ to, subject, text, html }) {
  let fromRaw =
    env('BREVO_FROM') ||
    env('RESEND_FROM') ||
    env('SMTP_FROM') ||
    'Avere <noreply@bislator.it.com>'
  let sender = parseFrom(fromRaw)
  let result = await httpsJsonRequest('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env('BREVO_API_KEY'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html || undefined,
      textContent: text || undefined,
    }),
  })

  if (!result.ok) {
    let detail =
      result.data?.message ||
      result.data?.error ||
      (Array.isArray(result.data) ? result.data.map((e) => e?.message).filter(Boolean).join('; ') : null) ||
      (typeof result.data?.raw === 'string' ? result.data.raw : null) ||
      `HTTP ${result.status}`
    throw new Error(`Brevo: ${detail}`)
  }
  return { preview: false, id: result.data?.messageId }
}

async function sendWithResend({ to, subject, text, html }) {
  let from = env('RESEND_FROM') || env('SMTP_FROM') || 'Avere <onboarding@resend.dev>'
  let result = await httpsJsonRequest('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
    }),
  })

  if (!result.ok) {
    let detail =
      result.data?.message ||
      result.data?.error ||
      (typeof result.data?.raw === 'string' ? result.data.raw : null) ||
      `HTTP ${result.status}`
    throw new Error(`Resend: ${detail}`)
  }
  return { preview: false, id: result.data?.id }
}

/**
 * Send email.
 * Priority: Brevo (HTTPS) → Resend (HTTPS) → SMTP → console preview.
 * HTTPS APIs work on DigitalOcean when outbound SMTP ports are blocked.
 */
async function sendMail({ to, subject, text, html }) {
  if (brevoConfigured()) {
    return sendWithBrevo({ to, subject, text, html })
  }

  if (resendConfigured()) {
    return sendWithResend({ to, subject, text, html })
  }

  if (!smtpConfigured()) {
    console.log('\n========== EMAIL (mail not configured) ==========')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log(text)
    console.log('Set BREVO_API_KEY (recommended) or RESEND_API_KEY or SMTP_USER/SMTP_PASS')
    console.log('=================================================\n')
    return { preview: true }
  }

  let from = env('SMTP_FROM') || env('SMTP_USER')
  let transporter = createTransport()
  await transporter.sendMail({ from, to, subject, text, html })
  return { preview: false }
}

async function sendVerificationOtp(email, otp) {
  // Softer copy — Gmail 550 5.7.1 often flags "verification code" OTP templates
  // from new/low-reputation domains as unsolicited.
  let subject = 'Confirm your Avere account'
  let text = [
    'Hi,',
    '',
    'Thanks for signing up with Avere.',
    `To finish setting up your account, enter this number on the website: ${otp}`,
    '',
    'It is valid for about 10 minutes.',
    '',
    'If you did not sign up, you can ignore this message.',
    '',
    '— Avere',
    'https://bislator.it.com',
  ].join('\n')
  // Email clients cannot load localhost images — use production site for logo.
  let site = (env('PUBLIC_SITE_URL') || env('FRONTEND_URL') || 'https://bislator.it.com').replace(/\/$/, '')
  if (/localhost|127\.0\.0\.1/i.test(site)) site = 'https://bislator.it.com'
  let logoUrl = `${site}/logo.png`

  let html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:28px 20px;color:#222;line-height:1.6">
      <img src="${logoUrl}" alt="Avere Ricco" width="180" style="display:block;margin:0 0 20px;max-width:180px;height:auto;border:0" />
      <p style="margin:0 0 16px;font-size:16px">Hi,</p>
      <p style="margin:0 0 16px;font-size:16px">Thanks for signing up with Avere.</p>
      <p style="margin:0 0 8px;font-size:16px">To finish setting up your account, enter this number on the website:</p>
      <p style="margin:16px 0;font-size:22px;font-weight:600;font-family:Consolas,monospace">${otp}</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555">Valid for about 10 minutes.</p>
      <p style="margin:0 0 8px;font-size:14px;color:#555">If you did not sign up, you can ignore this message.</p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0" />
      <p style="margin:0;font-size:12px;color:#888">Avere Ricco · bislator.it.com</p>
    </div>
  `
  return sendMail({ to: email, subject, text, html })
}

module.exports = {
  smtpConfigured,
  mailConfigured,
  sendMail,
  sendVerificationOtp,
}
