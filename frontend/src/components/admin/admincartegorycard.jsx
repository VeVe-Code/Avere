import axios from '../../helper/axios'
import React, { useState } from 'react'
import { Package, Pencil, Trash2 } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'

function AdminCategorycard({ d, onDelete, onEdit, active }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const deleteData = async () => {
    if (busy) return
    try {
      setBusy(true)
      let res = await axios.delete('/api/category/' + d._id)
      if (res.status === 200) {
        setConfirmOpen(false)
        onDelete(d._id)
      }
    } catch (err) {
      console.error(err)
      window.alert(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          'Failed to delete product'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <li
      className={`flex items-center gap-4 px-4 sm:px-5 py-3.5 transition-colors ${
        active
          ? 'bg-blue-50/80 dark:bg-blue-950/30'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
        <Package size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {d.title}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 truncate">
          {d.category || 'No category'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(d)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Pencil size={14} />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete product"
        message={`Delete “${d.title}”? Services using this product label may be affected.`}
        confirmLabel="Delete"
        busy={busy}
        onConfirm={deleteData}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  )
}

export default AdminCategorycard
