import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

function AdminServiceCard({ service, onDelete, onHiddenChange }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isHidden = Boolean(service.hidden)

  let deleteService = async () => {
    try {
      setDeleting(true)
      let res = await axios.delete('/api/service/' + service._id)
      if (res.status === 200) {
        setConfirmOpen(false)
        onDelete(service._id)
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
      const res = await axios.patch('/api/service/' + service._id + '/hidden')
      if (res.status === 200 && onHiddenChange) {
        onHiddenChange(service._id, Boolean(res.data.hidden))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] hover:border-slate-300 transition relative">
      {isHidden && (
        <span className="absolute top-3 left-3 z-10 rounded-md bg-slate-900/85 px-2 py-1 text-xs font-medium text-white">
          Hidden
        </span>
      )}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <img
          className={`mx-auto h-44 w-full object-contain ${isHidden ? 'opacity-60' : ''}`}
          src={assetUrl(service.photo)}
          alt={service.name || ''}
        />
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
          {service.name}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {service.description}
        </p>

        <Link
          to={`/admin/adminservice/${service._id}`}
          className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Details →
        </Link>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link to={`/admin/adminservice/edit/${service._id}`} className="flex-1 min-w-[5rem]">
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit
            </button>
          </Link>
          <button
            type="button"
            onClick={toggleHidden}
            disabled={busy}
            className="flex-1 min-w-[5rem] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            {isHidden ? 'Show' : 'Hide'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex-1 min-w-[5rem] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this service?"
        message={`“${service.name}” will be permanently removed.`}
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={deleteService}
      />
    </div>
  )
}

export default AdminServiceCard
