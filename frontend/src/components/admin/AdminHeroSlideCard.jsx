import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

function AdminHeroSlideCard({ slide, ondeleted, onHiddenChange }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isHidden = Boolean(slide.hidden)

  let deleteSlide = async () => {
    try {
      setDeleting(true)
      let res = await axios.delete('/api/heroslides/' + slide._id)
      if (res.status === 200) {
        setConfirmOpen(false)
        ondeleted(slide._id)
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
      const res = await axios.patch('/api/heroslides/' + slide._id + '/hidden')
      if (res.status === 200 && onHiddenChange) {
        onHiddenChange(slide._id, Boolean(res.data.hidden))
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
        className={`mx-auto h-48 w-full object-cover rounded-lg ${isHidden ? 'opacity-60' : ''}`}
        src={assetUrl(slide.photo)}
        alt=""
      />
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        Order: {slide.order ?? 0}
        {' · '}
        Duration: {slide.durationSeconds ?? 7}s
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={`/admin/adminheroslides/edit/${slide._id}`}>
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
        title="Delete this slide?"
        message="This photo will be permanently removed from the home slider."
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={deleteSlide}
      />
    </div>
  )
}

export default AdminHeroSlideCard
