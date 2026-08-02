const crypto = require('crypto')
const https = require('https')

function env(name) {
  return String(process.env[name] || '').trim()
}

function lineConfigured() {
  return Boolean(env('LINE_CHANNEL_ID') && env('LINE_CHANNEL_SECRET'))
}

function getCallbackUrl() {
  return (
    env('LINE_CALLBACK_URL') ||
    `http://localhost:${env('PORT') || 4000}/api/users/auth/line/callback`
  )
}

function buildAuthorizeUrl(state) {
  let url = new URL('https://access.line.me/oauth2/v2.1/authorize')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', env('LINE_CHANNEL_ID'))
  url.searchParams.set('redirect_uri', getCallbackUrl())
  url.searchParams.set('state', state)
  url.searchParams.set('scope', 'profile openid email')
  url.searchParams.set('nonce', crypto.randomBytes(8).toString('hex'))
  return url.toString()
}

/**
 * HTTPS request that tolerates local antivirus/proxy self-signed certs.
 */
function lineRequest(urlString, { method = 'GET', headers = {}, body } = {}) {
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
    req.on('error', reject)
    if (payload != null) req.write(payload)
    req.end()
  })
}

async function exchangeCode(code) {
  let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: getCallbackUrl(),
    client_id: env('LINE_CHANNEL_ID'),
    client_secret: env('LINE_CHANNEL_SECRET'),
  })

  let res = await lineRequest('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    throw new Error(res.data?.error_description || res.data?.error || 'LINE token exchange failed')
  }
  return res.data
}

async function fetchProfile(accessToken) {
  let res = await lineRequest('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    throw new Error(res.data?.message || 'LINE profile fetch failed')
  }
  return res.data
}

async function verifyIdToken(idToken) {
  if (!idToken) return null
  let body = new URLSearchParams({
    id_token: idToken,
    client_id: env('LINE_CHANNEL_ID'),
  })
  let res = await lineRequest('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) return null
  return res.data
}

function makeState() {
  return crypto.randomBytes(16).toString('hex')
}

module.exports = {
  lineConfigured,
  getCallbackUrl,
  buildAuthorizeUrl,
  exchangeCode,
  fetchProfile,
  verifyIdToken,
  makeState,
}
