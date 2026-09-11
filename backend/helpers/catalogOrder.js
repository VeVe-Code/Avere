const mongoose = require('mongoose')

/** Public site: pinned float to top. */
const CATALOG_SORT = { pinned: -1, order: 1, _id: 1 }
/** Admin reorder: absolute positions so page 1 ↔ page 2 move/switch match the grid. */
const ORDER_SORT = { order: 1, _id: 1 }

/** Serialize all order writes per collection so normalize cannot race switch/move. */
const catalogLocks = new Map()

function withCatalogLock(Model, fn) {
  const key = Model.collection.name
  const prev = catalogLocks.get(key) || Promise.resolve()
  const run = prev.then(fn, fn)
  catalogLocks.set(
    key,
    run.then(
      () => undefined,
      () => undefined
    )
  )
  return run
}

function toObjectId(id) {
  return new mongoose.Types.ObjectId(String(id))
}

async function persistOrderIds(Model, orderedIds) {
  if (!orderedIds.length) return
  const ops = orderedIds.map((id, i) => ({
    updateOne: {
      filter: { _id: toObjectId(id) },
      update: { $set: { order: i } },
    },
  }))
  await Model.bulkWrite(ops, { ordered: true })
}

async function getSortedIds(Model, sort) {
  const all = await Model.find({}).sort(sort).select('_id order')
  return all.map((doc) => doc._id.toString())
}

function ordersNeedNormalize(docs) {
  if (!docs.length) return false
  const seen = new Set()
  for (let i = 0; i < docs.length; i++) {
    const o = docs[i].order
    if (!Number.isFinite(o)) return true
    if (seen.has(o)) return true
    seen.add(o)
  }
  return false
}

async function normalizeCatalogOrders(Model, sort) {
  const ids = await getSortedIds(Model, sort)
  await persistOrderIds(Model, ids)
  return ids
}

/** Normalize only when orders are missing/duplicated. */
async function ensureUniqueOrders(Model, sort) {
  const docs = await Model.find({}).sort(sort).select('_id order')
  if (!ordersNeedNormalize(docs)) {
    return docs.map((d) => d._id.toString())
  }
  return normalizeCatalogOrders(Model, sort)
}

function resolveSortAndName(sortOrName, entityName, defaultSort) {
  if (typeof sortOrName === 'string') {
    return { sort: defaultSort, entityName: sortOrName }
  }
  return { sort: sortOrName || defaultSort, entityName }
}

function makeNormalizeHandler(Model, sortOrName = ORDER_SORT, entityName = 'items') {
  const resolved = resolveSortAndName(sortOrName, entityName, ORDER_SORT)
  sortOrName = resolved.sort
  entityName = resolved.entityName

  return async (req, res) => {
    try {
      const ids = await withCatalogLock(Model, () =>
        normalizeCatalogOrders(Model, sortOrName)
      )
      return res.json({ ok: true, count: ids.length })
    } catch (e) {
      console.error(`normalize ${entityName}:`, e)
      return res.status(500).json({ msg: `Failed to normalize ${entityName}` })
    }
  }
}

function makeReorderHandler(Model, sortOrName = ORDER_SORT, entityName = 'items') {
  const resolved = resolveSortAndName(sortOrName, entityName, ORDER_SORT)
  sortOrName = resolved.sort
  entityName = resolved.entityName

  return async (req, res) => {
    try {
      let orderedIds = req.body?.orderedIds
      let startOrder = Number(req.body?.startOrder)
      if (!Array.isArray(orderedIds) || !orderedIds.length) {
        return res.status(400).json({ msg: 'orderedIds required' })
      }
      if (!Number.isFinite(startOrder)) startOrder = 0

      let validIds = orderedIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map(String)
      if (!validIds.length) {
        return res.status(400).json({ msg: 'orderedIds required' })
      }

      await withCatalogLock(Model, async () => {
        let globalIds = await ensureUniqueOrders(Model, sortOrName)
        let pageLen = validIds.length
        let next = [
          ...globalIds.slice(0, startOrder),
          ...validIds,
          ...globalIds.slice(startOrder + pageLen),
        ]
        await persistOrderIds(Model, next)
      })

      return res.json({ ok: true })
    } catch (e) {
      console.error(`reorder ${entityName}:`, e)
      return res.status(500).json({ msg: `Failed to reorder ${entityName}` })
    }
  }
}

function makeTogglePinnedHandler(Model, notFoundMsg = 'Not found') {
  return async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid ID' })
      }
      let doc = await Model.findById(id)
      if (!doc) {
        return res.status(404).json({ msg: notFoundMsg })
      }
      doc.pinned = !doc.pinned
      await doc.save()
      return res.json(doc)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  }
}

function parseOrderField(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback
}

function pageOfIndex(index, pageSize = 6) {
  if (!Number.isFinite(index) || index < 0) return 1
  return Math.floor(index / pageSize) + 1
}

function makeSwitchHandler(Model, sortOrName = ORDER_SORT, entityName = 'items') {
  const resolved = resolveSortAndName(sortOrName, entityName, ORDER_SORT)
  sortOrName = resolved.sort
  entityName = resolved.entityName

  return async (req, res) => {
    try {
      let fromId = req.body?.fromId
      let toId = req.body?.toId
      if (!mongoose.Types.ObjectId.isValid(fromId) || !mongoose.Types.ObjectId.isValid(toId)) {
        return res.status(400).json({ msg: 'fromId and toId required' })
      }
      if (String(fromId) === String(toId)) {
        return res.json({ ok: true })
      }

      const result = await withCatalogLock(Model, async () => {
        let globalIds = await ensureUniqueOrders(Model, sortOrName)
        let fromIndex = globalIds.indexOf(String(fromId))
        let toIndex = globalIds.indexOf(String(toId))
        if (fromIndex < 0 || toIndex < 0) {
          const err = new Error('Item not found')
          err.status = 404
          throw err
        }

        const next = [...globalIds]
        ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
        await persistOrderIds(Model, next)

        const verified = await getSortedIds(Model, sortOrName)
        const fromNewIndex = verified.indexOf(String(fromId))
        const toNewIndex = verified.indexOf(String(toId))

        return {
          ok: true,
          fromIndex,
          toIndex,
          fromNewIndex,
          toNewIndex,
          fromPage: pageOfIndex(fromNewIndex),
          toPage: pageOfIndex(toNewIndex),
          fromId: String(fromId),
          toId: String(toId),
        }
      })

      return res.json(result)
    } catch (e) {
      if (e.status === 404) {
        return res.status(404).json({ msg: 'Item not found' })
      }
      console.error(`switch ${entityName}:`, e)
      return res.status(500).json({ msg: `Failed to switch ${entityName}` })
    }
  }
}

function makeMoveHandler(Model, sortOrName = ORDER_SORT, entityName = 'items') {
  const resolved = resolveSortAndName(sortOrName, entityName, ORDER_SORT)
  sortOrName = resolved.sort
  entityName = resolved.entityName

  return async (req, res) => {
    try {
      let fromId = req.body?.fromId
      let toId = req.body?.toId
      if (!mongoose.Types.ObjectId.isValid(fromId) || !mongoose.Types.ObjectId.isValid(toId)) {
        return res.status(400).json({ msg: 'fromId and toId required' })
      }
      if (String(fromId) === String(toId)) {
        return res.json({ ok: true })
      }

      const result = await withCatalogLock(Model, async () => {
        let globalIds = await ensureUniqueOrders(Model, sortOrName)
        let fromIndex = globalIds.indexOf(String(fromId))
        let toIndex = globalIds.indexOf(String(toId))
        if (fromIndex < 0 || toIndex < 0) {
          const err = new Error('Item not found')
          err.status = 404
          throw err
        }

        const movedId = String(fromId)
        const next = [...globalIds]
        const [moved] = next.splice(fromIndex, 1)
        // Insert at the target's slot (Move here = take this position).
        const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex
        next.splice(insertAt, 0, moved)

        await persistOrderIds(Model, next)
        const verified = await getSortedIds(Model, sortOrName)
        const movedToIndex = verified.indexOf(movedId)

        return {
          ok: true,
          fromIndex,
          toIndex,
          movedToIndex,
          movedToPage: pageOfIndex(movedToIndex),
          movedId,
        }
      })

      return res.json(result)
    } catch (e) {
      if (e.status === 404) {
        return res.status(404).json({ msg: 'Item not found' })
      }
      console.error(`move ${entityName}:`, e)
      return res.status(500).json({ msg: `Failed to move ${entityName}` })
    }
  }
}

module.exports = {
  CATALOG_SORT,
  ORDER_SORT,
  normalizeCatalogOrders,
  makeNormalizeHandler,
  makeReorderHandler,
  makeTogglePinnedHandler,
  makeMoveHandler,
  makeSwitchHandler,
  parseOrderField,
}
