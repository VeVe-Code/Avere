function AdminReorderBar({ label, onCancel, busy, mode = 'move' }) {

  if (!label) return null



  const isSwitch = mode === 'switch'

  const wrapperClass = isSwitch

    ? 'sticky top-3 z-30 mb-4 flex items-center justify-between gap-3 rounded-xl border border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/40 px-4 py-3 shadow-sm'

    : 'sticky top-3 z-30 mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 shadow-sm'

  const textClass = isSwitch

    ? 'text-sm text-violet-900 dark:text-violet-100 min-w-0'

    : 'text-sm text-amber-900 dark:text-amber-100 min-w-0'

  const btnClass = isSwitch

    ? 'shrink-0 rounded-lg border border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-violet-900 dark:text-violet-100 hover:bg-violet-100 dark:hover:bg-violet-950 disabled:opacity-50'

    : 'shrink-0 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-950 disabled:opacity-50'



  return (

    <div className={wrapperClass}>

      <p className={textClass}>

        <span className="font-medium">{isSwitch ? 'Switching:' : 'Moving:'}</span>{' '}

        <span className="line-clamp-1">{label}</span>

      </p>

      <button type="button" disabled={busy} onClick={onCancel} className={btnClass}>

        Cancel

      </button>

    </div>

  )

}



export default AdminReorderBar


