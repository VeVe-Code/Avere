const CatalogSettings = require('../model/CatalogSettings')
const { CATALOG_SORT, ORDER_SORT } = require('./catalogOrder')

/** Public: pinned first, then newest display date. Admin: date only (no pin split in grid). */
const DATE_SORT_PUBLIC = { pinned: -1, displayDate: -1, _id: 1 }
const DATE_SORT_ADMIN = { displayDate: -1, _id: 1 }

async function getSortMode(catalogKey) {
  const doc = await CatalogSettings.findOne({ key: catalogKey }).select('sortMode').lean()
  return doc?.sortMode === 'date' ? 'date' : 'manual'
}

async function resolveListSort(catalogKey, { publicOnly = false } = {}) {
  const mode = await getSortMode(catalogKey)
  if (mode === 'date') {
    return publicOnly ? DATE_SORT_PUBLIC : DATE_SORT_ADMIN
  }
  return publicOnly ? CATALOG_SORT : ORDER_SORT
}

function parseDisplayDate(value) {
  if (value === undefined || value === null || value === '') return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d
}

/** For create — default to now when omitted. */
function displayDateForCreate(body) {
  return parseDisplayDate(body?.displayDate) || new Date()
}

/** For update — only set when field was sent. */
function applyDisplayDateUpdate(updateData, body) {
  if (body.displayDate === undefined) return updateData
  const parsed = parseDisplayDate(body.displayDate)
  if (parsed) updateData.displayDate = parsed
  return updateData
}

async function getCatalogSettings(catalogKey) {
  let doc = await CatalogSettings.findOne({ key: catalogKey })
  if (!doc) {
    doc = await CatalogSettings.create({ key: catalogKey, sortMode: 'manual' })
  }
  return doc
}

async function setCatalogSortMode(catalogKey, sortMode) {
  const mode = sortMode === 'date' ? 'date' : 'manual'
  const doc = await CatalogSettings.findOneAndUpdate(
    { key: catalogKey },
    { $set: { sortMode: mode } },
    { upsert: true, new: true }
  )
  return doc
}

module.exports = {
  DATE_SORT_PUBLIC,
  DATE_SORT_ADMIN,
  getSortMode,
  resolveListSort,
  parseDisplayDate,
  displayDateForCreate,
  applyDisplayDateUpdate,
  getCatalogSettings,
  setCatalogSortMode,
}
