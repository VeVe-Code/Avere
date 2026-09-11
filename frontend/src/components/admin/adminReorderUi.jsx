import { ArrowRightLeft, GripVertical, Pin, Repeat2 } from 'lucide-react'



export function getAdminCardClassName({

  isDragging,

  isMoveSource,

  isSwitchSource,

  isDragOver,

  isMoveTarget,

  isSwitchTarget,

  base = 'rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] transition relative select-none',

}) {

  if (isDragging) {

    return `${base} border-blue-500 ring-2 ring-blue-500/40 opacity-90 scale-[1.02] shadow-xl z-20`

  }

  if (isSwitchSource) {

    return `${base} border-violet-500 ring-2 ring-violet-500/40 z-10`

  }

  if (isMoveSource) {

    return `${base} border-amber-500 ring-2 ring-amber-500/40 z-10`

  }

  if (isDragOver) {

    return `${base} border-blue-500 ring-2 ring-blue-500/30`

  }

  if (isSwitchTarget) {

    return `${base} border-dashed border-violet-400 dark:border-violet-600 hover:border-violet-500 hover:ring-2 hover:ring-violet-500/20`

  }

  if (isMoveTarget) {

    return `${base} border-dashed border-blue-400 dark:border-blue-600 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20`

  }

  return `${base} border-slate-200 dark:border-slate-700/90 hover:border-slate-300`

}



export function AdminStatusBadges({ isPinned, isHidden }) {

  return (

    <div className="absolute top-3 right-3 z-10 flex flex-wrap justify-end gap-1.5 max-w-[55%]">

      {isPinned && (

        <span className="rounded-md bg-amber-500/95 px-2 py-1 text-xs font-medium text-white inline-flex items-center gap-1">

          <Pin size={12} />

          Pinned

        </span>

      )}

      {isHidden && (

        <span className="rounded-md bg-slate-900/85 px-2 py-1 text-xs font-medium text-white">

          Hidden

        </span>

      )}

    </div>

  )

}



export function AdminDragHandle({ orderBusy, reorderMode, onDragHandlePointerDown }) {

  if (reorderMode) return null



  return (

    <button

      type="button"

      aria-label="Drag to reorder"

      title="Drag to reorder"

      disabled={orderBusy}

      onPointerDown={onDragHandlePointerDown}

      className="absolute top-3 left-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800 text-slate-500 cursor-grab active:cursor-grabbing touch-none disabled:opacity-40"

    >

      <GripVertical size={16} />

    </button>

  )

}



export function AdminMoveActions({

  moveMode,

  isMoveSource,

  isMoveTarget,

  orderBusy,

  onStartMove,

  onCancelMove,

  onMoveHere,

}) {

  if (isMoveSource) {

    return (

      <button

        type="button"

        disabled={orderBusy}

        onClick={onCancelMove}

        className="mt-4 w-full rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-2.5 text-sm font-medium text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-950 disabled:opacity-50"

      >

        Cancel move

      </button>

    )

  }



  if (isMoveTarget) {

    return (

      <button

        type="button"

        disabled={orderBusy}

        onClick={onMoveHere}

        className="mt-4 w-full rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"

      >

        Move here

      </button>

    )

  }



  if (moveMode) return null



  return (

    <button

      type="button"

      disabled={orderBusy}

      onClick={onStartMove}

      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"

    >

      <ArrowRightLeft size={15} />

      Move

    </button>

  )

}



export function AdminSwitchActions({

  switchMode,

  isSwitchSource,

  isSwitchTarget,

  orderBusy,

  onStartSwitch,

  onCancelSwitch,

  onSwitchHere,

}) {

  if (isSwitchSource) {

    return (

      <button

        type="button"

        disabled={orderBusy}

        onClick={onCancelSwitch}

        className="mt-4 w-full rounded-xl border border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 px-3 py-2.5 text-sm font-medium text-violet-900 dark:text-violet-100 hover:bg-violet-100 dark:hover:bg-violet-950 disabled:opacity-50"

      >

        Cancel switch

      </button>

    )

  }



  if (isSwitchTarget) {

    return (

      <button

        type="button"

        disabled={orderBusy}

        onClick={onSwitchHere}

        className="mt-4 w-full rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"

      >

        Switch here

      </button>

    )

  }



  if (switchMode) return null



  return (

    <button

      type="button"

      disabled={orderBusy}

      onClick={onStartSwitch}

      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"

    >

      <Repeat2 size={15} />

      Switch

    </button>

  )

}



export function AdminCatalogReorderActions(props) {

  const {

    reorderMode,

    moveMode,

    switchMode,

    isMoveSource,

    isMoveTarget,

    isSwitchSource,

    isSwitchTarget,

    orderBusy,

    onStartMove,

    onStartSwitch,

    onCancelMove,

    onCancelSwitch,

    onMoveHere,

    onSwitchHere,

  } = props



  if (isSwitchSource || isSwitchTarget) {

    return (

      <AdminSwitchActions

        switchMode={switchMode}

        isSwitchSource={isSwitchSource}

        isSwitchTarget={isSwitchTarget}

        orderBusy={orderBusy}

        onStartSwitch={onStartSwitch}

        onCancelSwitch={onCancelSwitch}

        onSwitchHere={onSwitchHere}

      />

    )

  }



  if (isMoveSource || isMoveTarget) {

    return (

      <AdminMoveActions

        moveMode={moveMode}

        isMoveSource={isMoveSource}

        isMoveTarget={isMoveTarget}

        orderBusy={orderBusy}

        onStartMove={onStartMove}

        onCancelMove={onCancelMove}

        onMoveHere={onMoveHere}

      />

    )

  }



  if (reorderMode) return null



  return (

    <div className="mt-3 grid grid-cols-2 gap-2">

      <AdminMoveActions

        moveMode={false}

        isMoveSource={false}

        isMoveTarget={false}

        orderBusy={orderBusy}

        onStartMove={onStartMove}

        onCancelMove={onCancelMove}

        onMoveHere={onMoveHere}

      />

      <AdminSwitchActions

        switchMode={false}

        isSwitchSource={false}

        isSwitchTarget={false}

        orderBusy={orderBusy}

        onStartSwitch={onStartSwitch}

        onCancelSwitch={onCancelSwitch}

        onSwitchHere={onSwitchHere}

      />

    </div>

  )

}


