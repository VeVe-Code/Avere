import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

function AdminPartnerCard({ partner, ondeleted, onHiddenChange }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isHidden = Boolean(partner.hidden)

  let deletePartner = async () => {
    try {
      setDeleting(true)
      let res = await axios.delete('/api/partners/' + partner._id)
      if (res.status === 200) {
        setConfirmOpen(false)
        ondeleted(partner._id)
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
      const res = await axios.patch('/api/partners/' + partner._id + '/hidden')
      if (res.status === 200 && onHiddenChange) {
        onHiddenChange(partner._id, Boolean(res.data.hidden))
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
      <div
        className={`mx-auto flex h-28 w-full items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 ${
          isHidden ? 'opacity-60' : ''
        }`}
      >
        {partner.photo ? (
          <img
            className="max-h-24 max-w-full object-contain p-3"
            src={assetUrl(partner.photo)}
            alt={partner.name || 'Partner'}
          />
        ) : (
          <span className="text-sm text-slate-400">No image</span>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
        {partner.name || 'Untitled partner'}
      </p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Order: {partner.order ?? 0}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={`/admin/adminpartners/edit/${partner._id}`}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Edit
          </button>
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
        title="Delete this partner?"
        message="This logo will be permanently removed from the partners marquee."
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={deletePartner}
      />
    </div>
  )
}

export default AdminPartnerCard
