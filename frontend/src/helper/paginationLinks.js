/** Normalize inconsistent backend pagination payload shapes. */
export function normalizeLinks(raw) {
  if (!raw) return null
  const pages =
    raw.LoopableLinks ||
    raw.loopablelinks ||
    raw.loopsablelinks ||
    raw.Loopablelinks ||
    []
  if (!Array.isArray(pages) || pages.length === 0) return null
  return {
    nextPage: Boolean(raw.nextPage),
    prevPage: Boolean(raw.PrevPage ?? raw.prevPage),
    pages,
  }
}
