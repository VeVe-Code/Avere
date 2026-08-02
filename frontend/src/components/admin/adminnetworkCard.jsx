import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

function adminnetworkCard({ n, ondeleted, onHiddenChange }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isHidden = Boolean(n.hidden)

  let deletenetwork = async () => {
    try {
      setDeleting(true)
      let res = await axios.delete('/api/network/' + n._id)
      if (res.status === 200) {
        setConfirmOpen(false)
        ondeleted(n._id)
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
      const res = await axios.patch('/api/network/' + n._id + '/hidden')
      if (res.status === 200 && onHiddenChange) {
        onHiddenChange(n._id, Boolean(res.data.hidden))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm relative">
      {isHidden && (
        <span className="absolute top-3 left-3 z-10 rounded-md bg-slate-900/85 px-2 py-1 text-xs font-medium text-white">
          Hidden
        </span>
      )}
      <img
        className={`mx-auto h-64 object-contain ${isHidden ? 'opacity-60' : ''}`}
        src={assetUrl(n.photo)}
        alt=""
      />
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{n.title}</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{n.description}</p>
      <Link
        to={`/admin/adminnetwork/${n._id}`}
        className="inline-block text-blue-500 hover:underline font-medium text-sm sm:text-base"
      >
        Details →
      </Link>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={'/admin/adminnetwork/edit/' + n._id}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
        </Link>
        <button
          type="button"
          onClick={toggleHidden}
          disabled={busy}
          className="border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          {isHidden ? 'Show' : 'Hide'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this network item?"
        message={`“${n.title}” will be permanently removed.`}
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={deletenetwork}
      />
    </div>
  )
}

export default adminnetworkCard
