import { useEffect, useRef, useState } from 'react'
import axios from '../../helper/axios.js'
import AdminserviceCard from '../../components/admin/AdminServiceCard.jsx'
import Pagination from '../../components/admin/AdminPagination.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
  dedupeCatalogItems,
  ensureCatalogNormalized,
  ordersNeedNormalize,
  readMoveSession,
  readSwitchSession,
  resolveMoveFromId,
  resolveSwitchFromId,
  sameCatalogId,
  writeMoveSession,
  writeSwitchSession,
  clearReorderSession,
} from '../../hooks/useAdminReorder.js'
import AdminReorderBar from '../../components/admin/AdminReorderBar.jsx'
import AdminCatalogSortBar from '../../components/admin/AdminCatalogSortBar.jsx'

const EDGE_PX = 72
const SCROLL_STEP = 14
const MOVE_STORAGE_KEY = 'admin-move:service'
const SWITCH_STORAGE_KEY = 'admin-switch:service'

function Adminservice() {
  let [services, setServices] = useState([])
  let location = useLocation()
  let [links, setLinks] = useState(null)
  let [loading, setLoading] = useState(true)
  let [savingOrder, setSavingOrder] = useState(false)
  let [activeId, setActiveId] = useState(null)
  let [overId, setOverId] = useState(null)
  let [movingId, setMovingId] = useState(null)
  let [movingLabel, setMovingLabel] = useState('')
  let [switchingId, setSwitchingId] = useState(null)
  let [switchingLabel, setSwitchingLabel] = useState('')
  let [sortMode, setSortMode] = useState('manual')
  let [sortBusy, setSortBusy] = useState(false)
  let manualOrder = sortMode === 'manual'
  let navigate = useNavigate()
  let searchQuery = new URLSearchParams(location.search)
  let page = searchQuery.get('page') || 1
  page = parseInt(page) ? parseInt(page) : 1

  let cardEls = useRef(new Map())
  let dragState = useRef(null)
  let scrollRaf = useRef(null)
  let servicesRef = useRef(services)
  servicesRef.current = services

  let fetchServices = async (opts = {}) => {
    const silent = Boolean(opts.silent)
    try {
      if (!silent) setLoading(true)
      let res = await axios('/api/service?page=' + page + '&_=' + Date.now())
      let data = res.data
      const next = dedupeCatalogItems(data.data || [])
      setServices(next)
      setLinks(data.links)
      if (data.sortMode === 'date' || data.sortMode === 'manual') {
        setSortMode(data.sortMode)
      }
      if (!silent) window.scrollTo(0, 0)
      return { items: next, sortMode: data.sortMode || 'manual' }
    } catch (err) {
      console.error(err)
      return []
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      const result = await fetchServices()
      if (cancelled) return
      if (result.sortMode !== 'manual') return
      const sessionKey = 'catalog-normalized:/api/service/reorder'
      const already = sessionStorage.getItem(sessionKey)
      if (!already && ordersNeedNormalize(result.items)) {
        const ok = await ensureCatalogNormalized('/api/service/reorder')
        if (ok) sessionStorage.setItem(sessionKey, '1')
        if (!cancelled && ok) await fetchServices({ silent: true })
      } else if (!already && result.items.length) {
        sessionStorage.setItem(sessionKey, '1')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page])

  useEffect(() => {
    if (manualOrder) return
    clearMoveState()
    clearSwitchState()
  }, [manualOrder])

  let changeSortMode = async (nextMode) => {
    if (nextMode === sortMode) return
    try {
      setSortBusy(true)
      clearReorderSession(MOVE_STORAGE_KEY)
      clearReorderSession(SWITCH_STORAGE_KEY)
      await axios.patch('/api/catalog-settings/services', { sortMode: nextMode })
      setSortMode(nextMode)
      await fetchServices({ silent: true })
    } catch (err) {
      console.error(err)
      window.alert('Could not update sort mode.')
    } finally {
      setSortBusy(false)
    }
  }

  useEffect(() => {
    const savedMove = readMoveSession(MOVE_STORAGE_KEY)
    if (savedMove) {
      setMovingId(savedMove.id)
      setMovingLabel(savedMove.label)
    }
    const savedSwitch = readSwitchSession(SWITCH_STORAGE_KEY)
    if (savedSwitch) {
      setSwitchingId(savedSwitch.id)
      setSwitchingLabel(savedSwitch.label)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    }
  }, [])

  useEffect(() => {
    if (!movingId) return
    let onKey = (e) => {
      if (e.key === 'Escape' && !savingOrder) clearMoveState()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [movingId, savingOrder])

  useEffect(() => {
    if (!switchingId) return
    let onKey = (e) => {
      if (e.key === 'Escape' && !savingOrder) clearSwitchState()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [switchingId, savingOrder])

  let clearMoveState = () => {
    setMovingId(null)
    setMovingLabel('')
    sessionStorage.removeItem(MOVE_STORAGE_KEY)
  }

  let clearSwitchState = () => {
    setSwitchingId(null)
    setSwitchingLabel('')
    sessionStorage.removeItem(SWITCH_STORAGE_KEY)
  }

  let onDelete = (_id) => {
    if (services.length === 1 && page > 1) {
      navigate('/admin/adminservice?page=' + (page - 1))
    } else {
      setServices((prev) => prev.filter((service) => service._id !== _id))
    }
  }

  let onHiddenChange = (_id, hidden) => {
    setServices((prev) =>
      prev.map((service) => (service._id === _id ? { ...service, hidden } : service))
    )
  }

  let onPinnedChange = (_id, pinned) => {
    setServices((prev) =>
      prev.map((service) => (service._id === _id ? { ...service, pinned } : service))
    )
  }

  let persistOrder = async (orderedList) => {
    let startOrder = (page - 1) * 6
    try {
      setSavingOrder(true)
      await axios.post('/api/service/reorder', {
        orderedIds: orderedList.map((s) => String(s._id)),
        startOrder,
      })
      setServices(
        orderedList.map((s, i) => ({ ...s, order: startOrder + i }))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setSavingOrder(false)
    }
  }

  let stopAutoScroll = () => {
    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current)
      scrollRaf.current = null
    }
  }

  let tickAutoScroll = () => {
    let state = dragState.current
    if (!state?.active) {
      scrollRaf.current = null
      return
    }

    let y = state.clientY
    let vh = window.innerHeight
    let dy = 0
    if (y < EDGE_PX) dy = -SCROLL_STEP
    else if (y > vh - EDGE_PX) dy = SCROLL_STEP

    if (dy !== 0) {
      window.scrollBy(0, dy)
      updateOverFromPoint(state.clientX, state.clientY)
    }

    scrollRaf.current = requestAnimationFrame(tickAutoScroll)
  }

  let ensureAutoScroll = () => {
    if (!scrollRaf.current) {
      scrollRaf.current = requestAnimationFrame(tickAutoScroll)
    }
  }

  let updateOverFromPoint = (clientX, clientY) => {
    let state = dragState.current
    if (!state) return

    let hitId = null
    for (let [id, el] of cardEls.current.entries()) {
      if (sameCatalogId(id, state.fromId) || !el) continue
      let rect = el.getBoundingClientRect()
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        hitId = id
        break
      }
    }

    if (hitId !== state.overId) {
      state.overId = hitId
      setOverId(hitId)
    }
  }

  let reorderByIds = async (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return

    let list = servicesRef.current
    let fromIndex = list.findIndex((s) => sameCatalogId(s._id, fromId))
    let toIndex = list.findIndex((s) => sameCatalogId(s._id, toId))
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return

    let next = [...list]
    let [moved] = next.splice(fromIndex, 1)
    let insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex
    next.splice(insertAt, 0, moved)
    setServices(next)
    await persistOrder(next)
  }

  let endDrag = async () => {
    let state = dragState.current
    stopAutoScroll()
    setActiveId(null)
    setOverId(null)

    if (!state) return
    dragState.current = null

    await reorderByIds(state.fromId, state.overId)
  }

  let startMove = (serviceId, label = '') => {
    if (!manualOrder || savingOrder || switchingId) return
    clearSwitchState()
    let id = String(serviceId)
    setMovingId(id)
    setMovingLabel(label)
    writeMoveSession(MOVE_STORAGE_KEY, { id, label, sourcePage: page })
  }

  let cancelMove = () => {
    if (savingOrder) return
    clearMoveState()
  }

  let startSwitch = (serviceId, label = '') => {
    if (!manualOrder || savingOrder || movingId) return
    clearMoveState()
    let id = String(serviceId)
    setSwitchingId(id)
    setSwitchingLabel(label)
    writeSwitchSession(SWITCH_STORAGE_KEY, { id, label, sourcePage: page })
  }

  let cancelSwitch = () => {
    if (savingOrder) return
    clearSwitchState()
  }

  let moveToTarget = async (toId) => {
    if (savingOrder) return
    let fromId = resolveMoveFromId(movingId, MOVE_STORAGE_KEY)
    let toIdStr = String(toId)
    if (!fromId || sameCatalogId(fromId, toIdStr)) return
    try {
      setSavingOrder(true)
      let res = await axios.post('/api/service/move', { fromId, toId: toIdStr })
      clearMoveState()
      let list = servicesRef.current
      let fromIndex = list.findIndex((s) => sameCatalogId(s._id, fromId))
      let toIndex = list.findIndex((s) => sameCatalogId(s._id, toIdStr))
      if (fromIndex >= 0 && toIndex >= 0) {
        let next = [...list]
        let [moved] = next.splice(fromIndex, 1)
        let insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex
        next.splice(insertAt, 0, moved)
        setServices(next)
      }
      let movedToPage =
        Number.isFinite(res.data?.movedToPage)
          ? res.data.movedToPage
          : Number.isFinite(res.data?.movedToIndex)
            ? Math.floor(res.data.movedToIndex / 6) + 1
            : page
      if (movedToPage !== page) {
        navigate('/admin/adminservice?page=' + movedToPage)
      } else {
        await fetchServices({ silent: true })
      }
    } catch (err) {
      console.error(err)
      window.alert('Could not move item. Please try again.')
    } finally {
      setSavingOrder(false)
    }
  }

  let switchToTarget = async (toId) => {
    if (savingOrder) return
    let fromId = resolveSwitchFromId(switchingId, SWITCH_STORAGE_KEY)
    let toIdStr = String(toId)
    if (!fromId || sameCatalogId(fromId, toIdStr)) return
    try {
      setSavingOrder(true)
      let res = await axios.post('/api/service/switch', { fromId, toId: toIdStr })
      clearSwitchState()
      let list = servicesRef.current
      let fromIndex = list.findIndex((s) => sameCatalogId(s._id, fromId))
      let toIndex = list.findIndex((s) => sameCatalogId(s._id, toIdStr))
      if (fromIndex >= 0 && toIndex >= 0) {
        let next = [...list]
        ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
        setServices(next)
      }
      let stayPage = Number.isFinite(res.data?.fromPage) ? res.data.fromPage : page
      if (stayPage !== page) {
        navigate('/admin/adminservice?page=' + stayPage)
      } else {
        await fetchServices({ silent: true })
      }
    } catch (err) {
      console.error(err)
      window.alert('Could not switch items. Please try again.')
    } finally {
      setSavingOrder(false)
    }
  }

  let onPointerMove = (e) => {
    let state = dragState.current
    if (!state?.active) return
    e.preventDefault()
    state.clientX = e.clientX
    state.clientY = e.clientY
    updateOverFromPoint(e.clientX, e.clientY)
    ensureAutoScroll()
  }

  let onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    endDrag()
  }

  let startDrag = (serviceId, e) => {
    if (!manualOrder || savingOrder || movingId || switchingId) return
    e.preventDefault()
    e.stopPropagation()

    let id = String(serviceId)
    dragState.current = {
      active: true,
      fromId: id,
      overId: null,
      clientX: e.clientX,
      clientY: e.clientY,
    }
    setActiveId(id)
    setOverId(null)

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    ensureAutoScroll()
  }

  let setCardRef = (id, el) => {
    let key = String(id)
    if (el) cardEls.current.set(key, el)
    else cardEls.current.delete(key)
  }

  let movingService = movingId
    ? services.find((s) => sameCatalogId(s._id, movingId))
    : null

  let switchingService = switchingId
    ? services.find((s) => sameCatalogId(s._id, switchingId))
    : null

  let moveBarLabel = movingService?.name || movingLabel
  let switchBarLabel = switchingService?.name || switchingLabel

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-1">
            Catalog
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Services
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {movingId
              ? 'Go to any page, tap “Move here” on the target, or Cancel.'
              : switchingId
                ? 'Go to any page, tap “Switch here” on another item to swap, or Cancel.'
                : manualOrder
                  ? 'Pin services, drag to reorder, Move to insert, or Switch to swap two items.'
                  : 'Sorted by display date. Change List sorting below to use Manual order.'}
            {savingOrder ? ' Saving order…' : ''}
          </p>
        </div>
        <Link
          to="/admin/adminservice/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus size={16} />
          Create Service
        </Link>
      </div>

      <AdminCatalogSortBar
        sortMode={sortMode}
        onChange={changeSortMode}
        busy={sortBusy || savingOrder}
      />

      {manualOrder && (movingId || switchingId) && (moveBarLabel || switchBarLabel) ? (
        <>
          {movingId && moveBarLabel ? (
            <AdminReorderBar
              label={moveBarLabel}
              onCancel={cancelMove}
              busy={savingOrder}
              mode="move"
            />
          ) : null}
          {switchingId && switchBarLabel ? (
            <AdminReorderBar
              label={switchBarLabel}
              onCancel={cancelSwitch}
              busy={savingOrder}
              mode="switch"
            />
          ) : null}
        </>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {!!services.length &&
              services.map((service) => {
                let itemId = String(service._id)
                let isMoveSource = manualOrder && Boolean(movingId && sameCatalogId(service._id, movingId))
                let isMoveTarget = manualOrder && Boolean(
                  movingId && !sameCatalogId(service._id, movingId)
                )
                let isSwitchSource = manualOrder && Boolean(
                  switchingId && sameCatalogId(service._id, switchingId)
                )
                let isSwitchTarget = manualOrder && Boolean(
                  switchingId && !sameCatalogId(service._id, switchingId)
                )
                return (
                <AdminserviceCard
                  key={itemId}
                  service={service}
                  onDelete={onDelete}
                  onHiddenChange={onHiddenChange}
                  onPinnedChange={onPinnedChange}
                  orderBusy={savingOrder}
                  reorderMode={manualOrder && Boolean(movingId || switchingId)}
                  moveMode={manualOrder && Boolean(movingId)}
                  switchMode={manualOrder && Boolean(switchingId)}
                  isMoveSource={isMoveSource}
                  isMoveTarget={isMoveTarget}
                  isSwitchSource={isSwitchSource}
                  isSwitchTarget={isSwitchTarget}
                  isDragging={sameCatalogId(activeId, itemId)}
                  isDragOver={sameCatalogId(overId, itemId) && !sameCatalogId(activeId, itemId)}
                  onDragHandlePointerDown={(e) => startDrag(itemId, e)}
                  onStartMove={() => startMove(itemId, service.name)}
                  onCancelMove={cancelMove}
                  onMoveHere={() => moveToTarget(itemId)}
                  onStartSwitch={() => startSwitch(itemId, service.name)}
                  onCancelSwitch={cancelSwitch}
                  onSwitchHere={() => switchToTarget(itemId)}
                  cardRef={(el) => setCardRef(itemId, el)}
                />
              )})}
          </div>

          {!services.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
              No services yet. Create your first one.
            </div>
          )}
        </>
      )}

      <div className="flex justify-center mt-10">
        {!!links && (
          <Pagination basePath="/admin/adminservice" links={links} page={page} />
        )}
      </div>
    </>
  )
}

export default Adminservice
