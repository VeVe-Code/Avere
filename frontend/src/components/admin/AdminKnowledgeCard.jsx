import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

function AdminKnowledgeCard({ k, onDeleted, onHiddenChange }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isHidden = Boolean(k.hidden)

  const deleteKnowledge = async () => {
    try {
      setDeleting(true)
      const res = await axios.delete('/api/knowledge/' + k._id)
      if (res.status === 200) {
        setConfirmOpen(false)
        onDeleted(k._id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const toggleHidden = async () => {
    if (busy) return
    setBusy(true)
    try {
      const res = await axios.patch('/api/knowledge/' + k._id + '/hidden')
      if (res.status === 200 && onHiddenChange) {
        onHiddenChange(k._id, Boolean(res.data.hidden))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col relative">
      {isHidden && (
        <span className="absolute top-3 left-3 z-10 rounded-md bg-slate-900/85 px-2 py-1 text-xs font-medium text-white">
          Hidden
        </span>
      )}

      <img
        className={`w-full h-48 object-cover ${isHidden ? 'opacity-60' : ''}`}
        src={assetUrl(k.photo)}
        alt={k.title}
      />

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold break-words text-slate-900 dark:text-white">
          {k.title}
        </h2>

        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm break-words line-clamp-2">
          {k.description}
        </p>

        <Link
          to={`/admin/adminknowledge/${k._id}`}
          className="mt-2 text-blue-500 hover:underline text-sm"
        >
          Details →
        </Link>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <Link to={`/admin/adminknowledge/edit/${k._id}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Edit
            </button>
          </Link>

          <button
            type="button"
            onClick={toggleHidden}
            disabled={busy}
            className="border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 disabled:opacity-50"
          >
            {isHidden ? 'Show' : 'Hide'}
          </button>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        message={`“${k.title}” will be permanently removed.`}
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={deleteKnowledge}
      />
    </div>
  )
}

export default AdminKnowledgeCard
