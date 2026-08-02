const crypto = require('crypto')
const https = require('https')

function env(name) {
  return String(process.env[name] || '').trim()
}

function googleConfigured() {
  return Boolean(env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET'))
}

function getCallbackUrl() {
  return (
    env('GOOGLE_CALLBACK_URL') ||
    `http://localhost:${env('PORT') || 4000}/api/users/auth/google/callback`
  )
}

function buildAuthorizeUrl(state) {
  let url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', env('GOOGLE_CLIENT_ID'))
  url.searchParams.set('redirect_uri', getCallbackUrl())
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', state)
  url.searchParams.set('access_type', 'online')
  url.searchParams.set('prompt', 'select_account')
  return url.toString()
}

function httpsRequest(urlString, { method = 'GET', headers = {}, body } = {}) {
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
    code,
    client_id: env('GOOGLE_CLIENT_ID'),
    client_secret: env('GOOGLE_CLIENT_SECRET'),
    redirect_uri: getCallbackUrl(),
    grant_type: 'authorization_code',
  })

  let res = await httpsRequest('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    throw new Error(res.data?.error_description || res.data?.error || 'Google token exchange failed')
  }
  return res.data
}

async function fetchUserInfo(accessToken) {
  let res = await httpsRequest('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    throw new Error(res.data?.error_description || res.data?.error || 'Google profile fetch failed')
  }
  return res.data
}

function makeState() {
  return crypto.randomBytes(16).toString('hex')
}

module.exports = {
  googleConfigured,
  getCallbackUrl,
  buildAuthorizeUrl,
  exchangeCode,
  fetchUserInfo,
  makeState,
}
