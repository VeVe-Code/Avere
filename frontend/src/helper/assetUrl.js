export default function assetUrl(photo) {
  if (!photo) return ''

  let backend = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')
  let base = (import.meta.env.VITE_BACKEND_ASSET_URL || '').replace(/\/$/, '')

  // host-ready default: always serve under /images
  if (!base) {
    base = backend ? backend + '/images' : ''
  }

  let p = String(photo)
  // DB may store "/file.png" or "/images/file.png"
  p = p.replace(/^\/images\//i, '/')
  if (!p.startsWith('/')) p = '/' + p

  // encode each segment (old filenames with spaces)
  p = '/' + p
    .slice(1)
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  return base + p
}
