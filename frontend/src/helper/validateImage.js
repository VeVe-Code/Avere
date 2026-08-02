export let MAX_IMAGE_SIZE = 5 * 1024 * 1024

export let ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

export function validateImageFile(file) {
  if (!file) return 'Please choose an image'
  let typeOk =
    ALLOWED_IMAGE_TYPES.includes(file.type) ||
    (file.type && file.type.startsWith('image/'))
  if (!typeOk) {
    return 'Only image files are allowed (jpg, png, webp, gif)'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be under 5MB'
  }
  return null
}
