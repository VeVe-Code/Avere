/**
 * Shared admin form validation helpers.
 * Server errors (express-validator) look like: { title: { msg: '...' } }
 */

export function isBlank(value) {
  if (value == null) return true
  return String(value).trim().length === 0
}

/** Treat empty rich-text / HTML as blank */
export function isBlankHtml(value) {
  if (value == null) return true
  const text = String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length === 0
}

export function fieldError(msg) {
  return { msg }
}

export function hasFieldErrors(errors = {}) {
  return Object.values(errors).some((v) => v?.msg)
}

/**
 * Validate common CMS content forms.
 * @param {object} fields
 * @param {{ requireCategory?: boolean, nameKey?: 'title'|'name', requirePhotoOnCreate?: boolean, isEdit?: boolean, hasPhoto?: boolean }} options
 */
export function validateContentForm(fields, options = {}) {
  const {
    requireCategory = false,
    nameKey = 'title',
    requirePhotoOnCreate = false,
    isEdit = false,
    hasPhoto = false,
  } = options

  const errors = {}
  const titleVal = nameKey === 'name' ? fields.name : fields.title
  const titleLabel = nameKey === 'name' ? 'Service name' : 'Title'

  if (isBlank(titleVal)) {
    errors[nameKey] = fieldError(`${titleLabel} is required`)
  }

  if (isBlank(fields.description)) {
    errors.description = fieldError('List preview is required')
  }

  if (isBlankHtml(fields.about)) {
    errors.about = fieldError('Full detail (About) is required')
  }

  if (requireCategory && isBlank(fields.category)) {
    errors.category = fieldError('Please select a category')
  }

  if (requirePhotoOnCreate && !isEdit && !hasPhoto) {
    errors.photo = fieldError('Please choose a cover image')
  }

  return errors
}

/** Normalize express-validator / API error payloads into { field: { msg } } */
export function normalizeServerErrors(payload) {
  if (!payload) return {}
  if (payload.errors && typeof payload.errors === 'object') {
    return payload.errors
  }
  return {}
}
