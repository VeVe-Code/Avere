const nodemailer = require('nodemailer')

function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: String(process.env.SMTP_USER || '').trim(),
      // App passwords are often copied with spaces — strip them
      pass: String(process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
    // Local/antivirus/proxy often injects self-signed certs in the chain
    tls: {
      rejectUnauthorized: false,
    },
  })
}

/**
 * Send email. If SMTP is not configured, logs to server console (local/dev).
 */
async function sendMail({ to, subject, text, html }) {
  if (!smtpConfigured()) {
    console.log('\n========== EMAIL (SMTP not configured) ==========')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log(text)
    console.log('=================================================\n')
    return { preview: true }
  }

  let from = process.env.SMTP_FROM || process.env.SMTP_USER
  let transporter = createTransport()
  await transporter.sendMail({ from, to, subject, text, html })
  return { preview: false }
}

async function sendVerificationOtp(email, otp) {
  let subject = 'Your Avere verification code'
  let text = `Your verification code is ${otp}. It expires in 10 minutes.\n\nIf you did not create an Avere account, you can ignore this email.`
  let html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 12px">Verify your email</h2>
      <p style="color:#444;line-height:1.5">Use this code to finish creating your Avere account:</p>
      <p style="font-size:28px;letter-spacing:6px;font-weight:700;margin:20px 0">${otp}</p>
      <p style="color:#666;font-size:14px">This code expires in 10 minutes.</p>
    </div>
  `
  return sendMail({ to: email, subject, text, html })
}

module.exports = {
  smtpConfigured,
  sendMail,
  sendVerificationOtp,
}
