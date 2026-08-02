import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../helper/axios'
import { AuthContext } from '../contexts/AuthContext'

function SaveButton({ type, id }) {
  let { user } = useContext(AuthContext)
  let [saved, setSaved] = useState(false)
  let [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || !type || !id) {
      setSaved(false)
      return
    }
    let check = async () => {
      try {
        let res = await axios.get('/api/users/library/check/' + type + '/' + id)
        setSaved(!!res.data.saved)
      } catch (e) {
        setSaved(false)
      }
    }
    check()
  }, [user, type, id])

  let toggleSave = async () => {
    if (!user) return
    try {
      setSaving(true)
      if (saved) {
        await axios.delete('/api/users/library/' + type + '/' + id)
        setSaved(false)
      } else {
        await axios.post('/api/users/library/' + type + '/' + id)
        setSaved(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <Link
        to="/login"
        state={{ from: window.location.pathname }}
        className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-800 hover:bg-slate-50"
      >
        Login to Save
      </Link>
    )
  }

  return (
    <button
      type="button"
      disabled={saving}
      onClick={toggleSave}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        saved
          ? "bg-slate-800 text-white"
          : "border border-slate-300 text-slate-800 hover:bg-slate-50"
      }`}
    >
      {saved ? "Saved" : "Save to Library"}
    </button>
  )
}

export default SaveButton
