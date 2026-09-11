/** YYYY-MM-DD for <input type="date" /> */
export function formatDateForInput(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** ISO date string for API (midnight UTC of chosen local calendar day). */
export function displayDateToApi(dateInput) {
  if (!dateInput) return null
  const d = new Date(`${dateInput}T12:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export function todayDateInput() {
  return formatDateForInput(new Date())
}

/** Prefer admin displayDate, fall back to createdAt. */
export function catalogDateValue(item) {
  if (!item) return null
  return item.displayDate || item.createdAt || null
}

export function formatCatalogDate(item, localeOptions) {
  const value = catalogDateValue(item)
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, localeOptions)
}
