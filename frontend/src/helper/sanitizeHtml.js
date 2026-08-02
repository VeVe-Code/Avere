import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'code',
  'pre',
  'span',
  'mark',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'style', 'data-color']

const SAFE_STYLE_PROPS = new Set(['color', 'background-color'])

let hooksRegistered = false

function registerSanitizeHooks() {
  if (hooksRegistered) return
  hooksRegistered = true

  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName !== 'style') return

    const kept = []
    for (const part of String(data.attrValue || '').split(';')) {
      const colon = part.indexOf(':')
      if (colon === -1) continue
      const prop = part.slice(0, colon).trim().toLowerCase()
      const value = part.slice(colon + 1).trim()
      if (!SAFE_STYLE_PROPS.has(prop) || !value) continue
      if (/url\s*\(|expression\s*\(|javascript:|@import/i.test(value)) continue
      kept.push(`${prop}: ${value}`)
    }

    if (kept.length === 0) {
      data.keepAttr = false
      data.attrValue = ''
      return
    }

    data.attrValue = kept.join('; ')
  })
}

/** True when stored content looks like HTML from the rich editor. */
export function looksLikeHtml(value) {
  if (!value || typeof value !== 'string') return false
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

export function sanitizeHtml(html) {
  if (!html) return ''
  registerSanitizeHooks()
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}

/** Empty TipTap doc / whitespace-only HTML should count as empty for validation. */
export function htmlToPlainText(html) {
  if (!html) return ''
  if (!looksLikeHtml(html)) return html.trim()
  const cleaned = sanitizeHtml(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  return cleaned.replace(/\u00a0/g, ' ').trim()
}
