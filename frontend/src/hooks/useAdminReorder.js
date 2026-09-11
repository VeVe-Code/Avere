import { useEffect, useRef, useState } from 'react'
import axios from '../helper/axios.js'

const EDGE_PX = 72
const SCROLL_STEP = 14

export function sameCatalogId(a, b) {
  if (a == null || b == null) return false
  return String(a) === String(b)
}

export function dedupeCatalogItems(items) {
  const seen = new Set()
  return items.filter((item) => {
    const id = String(item._id)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function readReorderSession(storageKey) {
  if (!storageKey) return null
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.id) return null
    return {
      id: String(parsed.id),
      label: parsed.label || '',
      sourcePage: parsed.sourcePage ?? null,
    }
  } catch {
    return null
  }
}

function writeReorderSession(storageKey, { id, label, sourcePage }) {
  if (!storageKey) return
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      id: String(id),
      label: label || '',
      sourcePage: sourcePage ?? null,
    })
  )
}

function clearReorderSession(storageKey) {
  if (storageKey) sessionStorage.removeItem(storageKey)
}

export { clearReorderSession }

export function readMoveSession(storageKey) {
  return readReorderSession(storageKey)
}

export function writeMoveSession(storageKey, payload) {
  writeReorderSession(storageKey, payload)
}

export function readSwitchSession(storageKey) {
  return readReorderSession(storageKey)
}

export function writeSwitchSession(storageKey, payload) {
  writeReorderSession(storageKey, payload)
}

export function defaultSwitchStorageKey(moveStorageKey) {
  if (!moveStorageKey) return null
  return moveStorageKey.replace('admin-move:', 'admin-switch:')
}

export function resolveMoveFromId(movingId, storageKey) {
  const saved = readMoveSession(storageKey)
  if (saved?.id) return saved.id
  return movingId ? String(movingId) : null
}

export function resolveSwitchFromId(switchingId, storageKey) {
  const saved = readSwitchSession(storageKey)
  if (saved?.id) return saved.id
  return switchingId ? String(switchingId) : null
}

export function isSourceOnCurrentPage(items, sourceId) {
  if (!sourceId) return false
  return items.some((item) => sameCatalogId(item._id, sourceId))
}

export function sortByPinnedOrder(items) {
  return [...items].sort((a, b) => {
    if (Boolean(b.pinned) !== Boolean(a.pinned)) {
      return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
    }
    return (a.order ?? 0) - (b.order ?? 0)
  })
}

/** True when page items have missing/duplicate order values (needs one-time normalize). */
export function ordersNeedNormalize(items) {
  if (!items?.length) return false
  const seen = new Set()
  for (const item of items) {
    const o = item?.order
    if (!Number.isFinite(o)) return true
    if (seen.has(o)) return true
    seen.add(o)
  }
  return false
}

const normalizeInflight = new Map()

/** Single-flight normalize per catalog reorder URL (avoids Strict Mode double POST). */
export async function ensureCatalogNormalized(reorderUrl) {
  const url = reorderUrl.replace('/reorder', '/normalize-orders')
  if (!normalizeInflight.has(url)) {
    normalizeInflight.set(
      url,
      axios
        .post(url)
        .then(() => true)
        .catch((err) => {
          console.error(err)
          return false
        })
        .finally(() => {
          normalizeInflight.delete(url)
        })
    )
  }
  return normalizeInflight.get(url)
}

function swapItemsLocally(items, fromId, toId) {
  const next = [...items]
  const fromIndex = next.findIndex((item) => sameCatalogId(item._id, fromId))
  const toIndex = next.findIndex((item) => sameCatalogId(item._id, toId))
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return items
  const fromOrder = next[fromIndex].order
  const toOrder = next[toIndex].order
  ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
  next[fromIndex] = { ...next[fromIndex], order: fromOrder }
  next[toIndex] = { ...next[toIndex], order: toOrder }
  return next
}
function moveItemLocally(items, fromId, toId) {
  const next = [...items]
  const fromIndex = next.findIndex((item) => sameCatalogId(item._id, fromId))
  const toIndex = next.findIndex((item) => sameCatalogId(item._id, toId))
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return items
  const [moved] = next.splice(fromIndex, 1)
  const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex
  next.splice(insertAt, 0, moved)
  return next
}

export function useAdminReorder({
  reorderUrl,
  moveUrl,
  switchUrl,
  moveStorageKey,
  switchStorageKey: switchStorageKeyProp,
  items,
  setItems,
  page = 1,
  pageSize = 6,
  onAfterMove,
  onAfterSwitch,
  onNavigateToPage,
  allowSamePageMoveTargets = true,
  reorderEnabled = true,
}) {
  const switchStorageKey =
    switchStorageKeyProp || defaultSwitchStorageKey(moveStorageKey)
  const resolvedSwitchUrl =
    switchUrl || (moveUrl ? moveUrl.replace('/move', '/switch') : null)

  const [savingOrder, setSavingOrder] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [movingId, setMovingId] = useState(null)
  const [movingLabel, setMovingLabel] = useState('')
  const [switchingId, setSwitchingId] = useState(null)
  const [switchingLabel, setSwitchingLabel] = useState('')

  const cardEls = useRef(new Map())
  const dragState = useRef(null)
  const scrollRaf = useRef(null)
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    const savedMove = readMoveSession(moveStorageKey)
    if (savedMove) {
      setMovingId(savedMove.id)
      setMovingLabel(savedMove.label)
    }
    const savedSwitch = readSwitchSession(switchStorageKey)
    if (savedSwitch) {
      setSwitchingId(savedSwitch.id)
      setSwitchingLabel(savedSwitch.label)
    }
  }, [moveStorageKey, switchStorageKey])

  useEffect(() => {
    return () => {
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    }
  }, [])

  useEffect(() => {
    if (!movingId) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !savingOrder) clearMoveState()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [movingId, savingOrder])

  useEffect(() => {
    if (!switchingId) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !savingOrder) clearSwitchState()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [switchingId, savingOrder])

  const clearMoveState = () => {
    setMovingId(null)
    setMovingLabel('')
    clearReorderSession(moveStorageKey)
  }

  const clearSwitchState = () => {
    setSwitchingId(null)
    setSwitchingLabel('')
    clearReorderSession(switchStorageKey)
  }

  useEffect(() => {
    if (reorderEnabled) return
    clearMoveState()
    clearSwitchState()
  }, [reorderEnabled])

  const persistOrder = async (orderedList) => {
    if (!reorderEnabled) return
    const startOrder = (page - 1) * pageSize
    try {
      setSavingOrder(true)
      await axios.post(reorderUrl, {
        orderedIds: orderedList.map((item) => String(item._id)),
        startOrder,
      })
      setItems(
        orderedList.map((item, i) => ({ ...item, order: startOrder + i }))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setSavingOrder(false)
    }
  }

  const stopAutoScroll = () => {
    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current)
      scrollRaf.current = null
    }
  }

  const updateOverFromPoint = (clientX, clientY) => {
    const state = dragState.current
    if (!state) return

    let hitId = null
    for (const [id, el] of cardEls.current.entries()) {
      if (sameCatalogId(id, state.fromId) || !el) continue
      const rect = el.getBoundingClientRect()
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

  const tickAutoScroll = () => {
    const state = dragState.current
    if (!state?.active) {
      scrollRaf.current = null
      return
    }

    const y = state.clientY
    const vh = window.innerHeight
    let dy = 0
    if (y < EDGE_PX) dy = -SCROLL_STEP
    else if (y > vh - EDGE_PX) dy = SCROLL_STEP

    if (dy !== 0) {
      window.scrollBy(0, dy)
      updateOverFromPoint(state.clientX, state.clientY)
    }

    scrollRaf.current = requestAnimationFrame(tickAutoScroll)
  }

  const ensureAutoScroll = () => {
    if (!scrollRaf.current) {
      scrollRaf.current = requestAnimationFrame(tickAutoScroll)
    }
  }

  const reorderByIds = async (fromId, toId) => {
    if (!fromId || !toId || sameCatalogId(fromId, toId)) return

    const list = itemsRef.current
    const fromIndex = list.findIndex((item) => sameCatalogId(item._id, fromId))
    const toIndex = list.findIndex((item) => sameCatalogId(item._id, toId))
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return

    const next = [...list]
    const [moved] = next.splice(fromIndex, 1)
    const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex
    next.splice(insertAt, 0, moved)
    setItems(next)
    await persistOrder(next)
  }

  const endDrag = async () => {
    const state = dragState.current
    stopAutoScroll()
    setActiveId(null)
    setOverId(null)

    if (!state) return
    dragState.current = null
    await reorderByIds(state.fromId, state.overId)
  }

  const onPointerMove = (e) => {
    const state = dragState.current
    if (!state?.active) return
    e.preventDefault()
    state.clientX = e.clientX
    state.clientY = e.clientY
    updateOverFromPoint(e.clientX, e.clientY)
    ensureAutoScroll()
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    endDrag()
  }

  const startDrag = (itemId, e) => {
    if (!reorderEnabled || savingOrder || movingId || switchingId) return
    e.preventDefault()
    e.stopPropagation()

    const id = String(itemId)
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

  const startMove = (itemId, label = '') => {
    if (!reorderEnabled || savingOrder || switchingId) return
    clearSwitchState()
    const id = String(itemId)
    setMovingId(id)
    setMovingLabel(label)
    writeMoveSession(moveStorageKey, { id, label, sourcePage: page })
  }

  const cancelMove = () => {
    if (savingOrder) return
    clearMoveState()
  }

  const startSwitch = (itemId, label = '') => {
    if (!reorderEnabled || savingOrder || movingId) return
    clearMoveState()
    const id = String(itemId)
    setSwitchingId(id)
    setSwitchingLabel(label)
    writeSwitchSession(switchStorageKey, { id, label, sourcePage: page })
  }

  const cancelSwitch = () => {
    if (savingOrder) return
    clearSwitchState()
  }

  const moveToTarget = async (toId) => {
    if (savingOrder || !moveUrl) return
    const fromId = resolveMoveFromId(movingId, moveStorageKey)
    const toIdStr = String(toId)
    if (!fromId || sameCatalogId(fromId, toIdStr)) return

    try {
      setSavingOrder(true)
      const res = await axios.post(moveUrl, { fromId, toId: toIdStr })
      clearMoveState()

      const samePage =
        itemsRef.current.some((item) => sameCatalogId(item._id, fromId)) &&
        itemsRef.current.some((item) => sameCatalogId(item._id, toIdStr))
      if (samePage) {
        setItems(moveItemLocally(itemsRef.current, fromId, toIdStr))
      }

      const movedToPage =
        Number.isFinite(res.data?.movedToPage)
          ? res.data.movedToPage
          : Number.isFinite(res.data?.movedToIndex)
            ? Math.floor(res.data.movedToIndex / pageSize) + 1
            : page

      if (onNavigateToPage && movedToPage !== page) {
        onNavigateToPage(movedToPage)
      } else if (onAfterMove) {
        await onAfterMove()
      }
    } catch (err) {
      console.error(err)
      window.alert('Could not move item. Please try again.')
    } finally {
      setSavingOrder(false)
    }
  }

  const switchToTarget = async (toId) => {
    if (savingOrder || !resolvedSwitchUrl) return
    const fromId = resolveSwitchFromId(switchingId, switchStorageKey)
    const toIdStr = String(toId)
    if (!fromId || sameCatalogId(fromId, toIdStr)) return

    try {
      setSavingOrder(true)
      const res = await axios.post(resolvedSwitchUrl, { fromId, toId: toIdStr })
      clearSwitchState()

      const samePage =
        itemsRef.current.some((item) => sameCatalogId(item._id, fromId)) &&
        itemsRef.current.some((item) => sameCatalogId(item._id, toIdStr))
      if (samePage) {
        setItems(swapItemsLocally(itemsRef.current, fromId, toIdStr))
      }

      // fromId lands on toId's old slot → fromPage is where the clicked target was.
      const stayPage = Number.isFinite(res.data?.fromPage) ? res.data.fromPage : page
      const afterSwitch = onAfterSwitch || onAfterMove

      if (onNavigateToPage && stayPage !== page) {
        onNavigateToPage(stayPage)
      } else if (afterSwitch) {
        await afterSwitch()
      }
    } catch (err) {
      console.error(err)
      window.alert('Could not switch items. Please try again.')
    } finally {
      setSavingOrder(false)
    }
  }

  const setCardRef = (id, el) => {
    const key = String(id)
    if (el) cardEls.current.set(key, el)
    else cardEls.current.delete(key)
  }

  const sourceOnCurrentPage = isSourceOnCurrentPage(items, movingId)
  const switchSourceOnCurrentPage = isSourceOnCurrentPage(items, switchingId)

  const getCardReorderProps = (item) => {
    if (!reorderEnabled) {
      return {
        orderBusy: false,
        reorderMode: false,
        moveMode: false,
        switchMode: false,
        isMoveSource: false,
        isMoveTarget: false,
        isSwitchSource: false,
        isSwitchTarget: false,
        isDragging: false,
        isDragOver: false,
        onDragHandlePointerDown: () => {},
        onStartMove: () => {},
        onCancelMove: () => {},
        onMoveHere: () => {},
        onStartSwitch: () => {},
        onCancelSwitch: () => {},
        onSwitchHere: () => {},
        cardRef: () => {},
      }
    }

    const label = item.name || item.title || item.label || ''
    const itemId = String(item._id)
    const isMoveSource = Boolean(movingId && sameCatalogId(item._id, movingId))
    const isMoveTarget = Boolean(
      movingId &&
        !sameCatalogId(item._id, movingId) &&
        (allowSamePageMoveTargets || !sourceOnCurrentPage)
    )
    const isSwitchSource = Boolean(switchingId && sameCatalogId(item._id, switchingId))
    const isSwitchTarget = Boolean(
      switchingId && !sameCatalogId(item._id, switchingId)
    )

    return {
      orderBusy: savingOrder,
      reorderMode: Boolean(movingId || switchingId),
      moveMode: Boolean(movingId),
      switchMode: Boolean(switchingId),
      isMoveSource,
      isMoveTarget,
      isSwitchSource,
      isSwitchTarget,
      isDragging: sameCatalogId(activeId, itemId),
      isDragOver: sameCatalogId(overId, itemId) && !sameCatalogId(activeId, itemId),
      onDragHandlePointerDown: (e) => startDrag(itemId, e),
      onStartMove: () => startMove(itemId, label),
      onCancelMove: cancelMove,
      onMoveHere: () => moveToTarget(itemId),
      onStartSwitch: () => startSwitch(itemId, label),
      onCancelSwitch: cancelSwitch,
      onSwitchHere: () => switchToTarget(itemId),
      cardRef: (el) => setCardRef(itemId, el),
    }
  }

  return {
    savingOrder,
    movingId,
    movingLabel,
    switchingId,
    switchingLabel,
    sourceOnCurrentPage,
    switchSourceOnCurrentPage,
    cancelMove,
    cancelSwitch,
    setCardRef,
    getCardReorderProps,
  }
}
