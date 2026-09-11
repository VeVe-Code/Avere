export default function AdminCatalogSortBar({
  sortMode = 'manual',
  onChange,
  busy = false,
}) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            List sorting
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {sortMode === 'manual'
              ? 'Drag, Move, and Switch are enabled. Order is saved in the database.'
              : 'Sorted by display date (newest first). Your manual order is kept — switch back to Manual to restore it.'}
          </p>
        </div>
        <label className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 sr-only sm:not-sr-only">
            Sort by
          </span>
          <select
            value={sortMode}
            disabled={busy}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 min-w-[180px] disabled:opacity-50"
          >
            <option value="manual">Manual order</option>
            <option value="date">Display date</option>
          </select>
        </label>
      </div>
    </div>
  )
}
