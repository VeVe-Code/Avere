import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../helper/axios.js'
import AdminReorderBar from '../components/admin/AdminReorderBar.jsx'
import AdminCatalogSortBar from '../components/admin/AdminCatalogSortBar.jsx'
import {
  useAdminReorder,
  dedupeCatalogItems,
  sameCatalogId,
  ordersNeedNormalize,
  ensureCatalogNormalized,
  clearReorderSession,
} from './useAdminReorder.js'

function normalizeSessionKey(reorderUrl) {
  return `catalog-normalized:${reorderUrl}`
}

export function useAdminCatalogPage({
  fetchUrl,
  reorderUrl,
  moveUrl,
  moveStorageKey,
  catalogKey,
  page,
  adminListPath,
  linksKey = 'links',
  dataKey = 'data',
  pageSize = 6,
}) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [links, setLinks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortMode, setSortMode] = useState('manual')
  const [sortBusy, setSortBusy] = useState(false)

  const manualOrder = sortMode === 'manual'

  const fetchItems = useCallback(async (opts = {}) => {
    const silent = Boolean(opts.silent)
    try {
      if (!silent) setLoading(true)
      const res = await axios(`${fetchUrl}?page=${page}&_=${Date.now()}`)
      const nextItems = dedupeCatalogItems(res.data[dataKey] || [])
      setItems(nextItems)
      setLinks(res.data[linksKey] || res.data.Links || null)
      if (res.data.sortMode === 'date' || res.data.sortMode === 'manual') {
        setSortMode(res.data.sortMode)
      }
      if (!silent) window.scrollTo(0, 0)
      return { items: nextItems, sortMode: res.data.sortMode || 'manual' }
    } catch (err) {
      console.error(err)
      return { items: [], sortMode: 'manual' }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [fetchUrl, page, dataKey, linksKey])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const result = await fetchItems()
      if (cancelled) return

      if (result.sortMode !== 'manual') return

      const sessionKey = normalizeSessionKey(reorderUrl)
      const already = sessionStorage.getItem(sessionKey)
      if (!already && ordersNeedNormalize(result.items)) {
        const ok = await ensureCatalogNormalized(reorderUrl)
        if (ok) sessionStorage.setItem(sessionKey, '1')
        if (!cancelled && ok) await fetchItems({ silent: true })
      } else if (!already && result.items.length) {
        sessionStorage.setItem(sessionKey, '1')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [fetchItems, reorderUrl])

  const goToPage = (movedToPage) => {
    if (!adminListPath) return
    if (movedToPage !== page) {
      navigate(`${adminListPath}?page=${movedToPage}`)
    }
  }

  const reorder = useAdminReorder({
    reorderUrl,
    moveUrl: moveUrl || reorderUrl.replace('/reorder', '/move'),
    moveStorageKey,
    items,
    setItems,
    page,
    pageSize,
    reorderEnabled: manualOrder,
    onNavigateToPage: adminListPath ? goToPage : undefined,
    onAfterMove: () => fetchItems({ silent: true }),
  })

  const changeSortMode = async (nextMode) => {
    if (!catalogKey || nextMode === sortMode) return
    try {
      setSortBusy(true)
      if (moveStorageKey) clearReorderSession(moveStorageKey)
      if (moveStorageKey) {
        clearReorderSession(moveStorageKey.replace('admin-move:', 'admin-switch:'))
      }
      await axios.patch(`/api/catalog-settings/${catalogKey}`, { sortMode: nextMode })
      setSortMode(nextMode)
      await fetchItems({ silent: true })
    } catch (err) {
      console.error(err)
      window.alert('Could not update sort mode.')
    } finally {
      setSortBusy(false)
    }
  }

  const onHiddenChange = (_id, hidden) => {
    setItems((prev) => prev.map((item) => (item._id === _id ? { ...item, hidden } : item)))
  }

  const onPinnedChange = (_id, pinned) => {
    setItems((prev) => prev.map((item) => (item._id === _id ? { ...item, pinned } : item)))
  }

  const movingItem = reorder.movingId
    ? items.find((item) => sameCatalogId(item._id, reorder.movingId))
    : null

  const switchingItem = reorder.switchingId
    ? items.find((item) => sameCatalogId(item._id, reorder.switchingId))
    : null

  const moveBarLabel =
    movingItem?.name ||
    movingItem?.title ||
    reorder.movingLabel ||
    ''

  const switchBarLabel =
    switchingItem?.name ||
    switchingItem?.title ||
    reorder.switchingLabel ||
    ''

  const SortBar = () =>
    catalogKey ? (
      <AdminCatalogSortBar
        sortMode={sortMode}
        onChange={changeSortMode}
        busy={sortBusy || reorder.savingOrder}
      />
    ) : null

  const ReorderBar = () => (
    <>
      {manualOrder && reorder.movingId && moveBarLabel ? (
        <AdminReorderBar
          label={moveBarLabel}
          onCancel={reorder.cancelMove}
          busy={reorder.savingOrder}
          mode="move"
        />
      ) : null}
      {manualOrder && reorder.switchingId && switchBarLabel ? (
        <AdminReorderBar
          label={switchBarLabel}
          onCancel={reorder.cancelSwitch}
          busy={reorder.savingOrder}
          mode="switch"
        />
      ) : null}
    </>
  )

  return {
    items,
    setItems,
    links,
    loading,
    sortMode,
    manualOrder,
    reorder,
    onHiddenChange,
    onPinnedChange,
    barLabel: moveBarLabel || switchBarLabel,
    SortBar,
    ReorderBar,
  }
}

export function useAdminSimpleListPage({
  fetchUrl,
  reorderUrl,
  moveUrl,
  moveStorageKey,
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async (opts = {}) => {
    const silent = Boolean(opts.silent)
    try {
      if (!silent) setLoading(true)
      const res = await axios(`${fetchUrl}?_=${Date.now()}`)
      const nextItems = dedupeCatalogItems(res.data.data || [])
      setItems(nextItems)
      return nextItems
    } catch (err) {
      console.error(err)
      return []
    } finally {
      if (!silent) setLoading(false)
    }
  }, [fetchUrl])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const loaded = await fetchItems()
      if (cancelled) return
      const sessionKey = normalizeSessionKey(reorderUrl)
      const already = sessionStorage.getItem(sessionKey)
      if (!already && ordersNeedNormalize(loaded)) {
        const ok = await ensureCatalogNormalized(reorderUrl)
        if (ok) sessionStorage.setItem(sessionKey, '1')
        if (!cancelled && ok) await fetchItems({ silent: true })
      } else if (!already && loaded.length) {
        sessionStorage.setItem(sessionKey, '1')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [fetchItems, reorderUrl])

  const reorder = useAdminReorder({
    reorderUrl,
    moveUrl: moveUrl || reorderUrl.replace('/reorder', '/move'),
    moveStorageKey,
    items,
    setItems,
    page: 1,
    pageSize: 1000,
    allowSamePageMoveTargets: true,
    onAfterMove: () => fetchItems({ silent: true }),
  })

  const onHiddenChange = (_id, hidden) => {
    setItems((prev) => prev.map((item) => (item._id === _id ? { ...item, hidden } : item)))
  }

  const movingItem = reorder.movingId
    ? items.find((item) => sameCatalogId(item._id, reorder.movingId))
    : null

  const switchingItem = reorder.switchingId
    ? items.find((item) => sameCatalogId(item._id, reorder.switchingId))
    : null

  const moveBarLabel =
    movingItem?.name ||
    movingItem?.title ||
    reorder.movingLabel ||
    'Item'

  const switchBarLabel =
    switchingItem?.name ||
    switchingItem?.title ||
    reorder.switchingLabel ||
    'Item'

  const ReorderBar = () => (
    <>
      {reorder.movingId && moveBarLabel ? (
        <AdminReorderBar
          label={moveBarLabel}
          onCancel={reorder.cancelMove}
          busy={reorder.savingOrder}
          mode="move"
        />
      ) : null}
      {reorder.switchingId && switchBarLabel ? (
        <AdminReorderBar
          label={switchBarLabel}
          onCancel={reorder.cancelSwitch}
          busy={reorder.savingOrder}
          mode="switch"
        />
      ) : null}
    </>
  )

  return {
    items,
    setItems,
    loading,
    reorder,
    onHiddenChange,
    barLabel: moveBarLabel || switchBarLabel,
    ReorderBar,
  }
}
