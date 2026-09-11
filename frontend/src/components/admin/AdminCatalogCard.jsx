import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'
import {
  AdminCatalogReorderActions,
  AdminDragHandle,
  AdminStatusBadges,
  getAdminCardClassName,
} from './adminReorderUi'

function AdminCatalogCard({
  item,
  title,
  description,
  photo,
  detailPath,
  editPath,
  apiBase,
  deleteTitle,
  deleteMessage,
  onDelete,
  onHiddenChange,
  onPinnedChange,
  supportsPin = true,
  orderBusy,
  reorderMode,
  moveMode,
  switchMode,
  isMoveSource,
  isMoveTarget,
  isSwitchSource,
  isSwitchTarget,
  isDragging,
  isDragOver,
  onDragHandlePointerDown,
  onStartMove,
  onCancelMove,
  onMoveHere,
  onStartSwitch,
  onCancelSwitch,
  onSwitchHere,
  cardRef,
  imageClassName = 'mx-auto h-40 sm:h-44 w-full object-contain',
}) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isHidden = Boolean(item.hidden)
  const isPinned = Boolean(item.pinned)
  const dragDisabled = orderBusy || reorderMode

  const actionBtn =
    'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50'

  const deleteItem = async () => {
    try {
      setDeleting(true)
      const res = await axios.delete(`${apiBase}/${item._id}`)
      if (res.status === 200) {
        setConfirmOpen(false)
        onDelete(item._id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const toggleHidden = async () => {
    if (busy || reorderMode) return
    setBusy(true)
    try {
      const res = await axios.patch(`${apiBase}/${item._id}/hidden`)
      if (res.status === 200 && onHiddenChange) {
        onHiddenChange(item._id, Boolean(res.data.hidden))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  const togglePinned = async () => {
    if (busy || reorderMode || !supportsPin) return
    setBusy(true)
    try {
      const res = await axios.patch(`${apiBase}/${item._id}/pinned`)
      if (res.status === 200 && onPinnedChange) {
        onPinnedChange(item._id, Boolean(res.data.pinned))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      ref={cardRef}
      className={getAdminCardClassName({
        isDragging,
        isMoveSource,
        isSwitchSource,
        isDragOver,
        isMoveTarget,
        isSwitchTarget,
      })}
    >
      <AdminStatusBadges isPinned={supportsPin && isPinned} isHidden={isHidden} />

      <AdminDragHandle
        orderBusy={orderBusy}
        reorderMode={reorderMode}
        onDragHandlePointerDown={onDragHandlePointerDown}
      />

      <div
        className={`bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 pt-14 ${
          reorderMode ? '' : 'touch-none cursor-grab active:cursor-grabbing'
        }`}
        onPointerDown={dragDisabled ? undefined : onDragHandlePointerDown}
      >
        <img
          className={`${imageClassName} pointer-events-none ${isHidden ? 'opacity-60' : ''}`}
          src={assetUrl(photo)}
          alt={title || ''}
          draggable={false}
        />
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        ) : null}

        {!reorderMode && detailPath ? (
          <Link
            to={detailPath}
            className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Details →
          </Link>
        ) : null}

        {isMoveSource || isMoveTarget || isSwitchSource || isSwitchTarget ? (
          <AdminCatalogReorderActions
            reorderMode={reorderMode}
            moveMode={moveMode}
            switchMode={switchMode}
            isMoveSource={isMoveSource}
            isMoveTarget={isMoveTarget}
            isSwitchSource={isSwitchSource}
            isSwitchTarget={isSwitchTarget}
            orderBusy={orderBusy}
            onStartMove={onStartMove}
            onStartSwitch={onStartSwitch}
            onCancelMove={onCancelMove}
            onCancelSwitch={onCancelSwitch}
            onMoveHere={onMoveHere}
            onSwitchHere={onSwitchHere}
          />
        ) : (
          <>
            {!reorderMode && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {editPath ? (
                  <Link
                    to={editPath}
                    className="rounded-xl bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                ) : null}
                {supportsPin ? (
                  <button
                    type="button"
                    onClick={togglePinned}
                    disabled={busy}
                    className={actionBtn}
                  >
                    {isPinned ? 'Unpin' : 'Pin'}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={toggleHidden}
                  disabled={busy}
                  className={actionBtn}
                >
                  {isHidden ? 'Show' : 'Hide'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className={actionBtn}
                >
                  Delete
                </button>
              </div>
            )}

            <AdminCatalogReorderActions
              reorderMode={reorderMode}
              moveMode={moveMode}
              switchMode={switchMode}
              isMoveSource={isMoveSource}
              isMoveTarget={isMoveTarget}
              isSwitchSource={isSwitchSource}
              isSwitchTarget={isSwitchTarget}
              orderBusy={orderBusy}
              onStartMove={onStartMove}
              onStartSwitch={onStartSwitch}
              onCancelMove={onCancelMove}
              onCancelSwitch={onCancelSwitch}
              onMoveHere={onMoveHere}
              onSwitchHere={onSwitchHere}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={deleteTitle}
        message={deleteMessage}
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={deleteItem}
      />
    </div>
  )
}

export default AdminCatalogCard
