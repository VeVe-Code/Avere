import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import {
  FormErrorBanner,
  FormField,
  fieldClass,
} from '../../components/admin/AdminFormUI'
import { fieldError, hasFieldErrors, isBlank } from '../../helper/formValidation'

function AdminPosition() {
  const [data, setData] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [detail, setDetail] = useState('')
  const [hidden, setHidden] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [editId, setEditId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState({})
  const [formError, setFormError] = useState('')

  const fetchPositions = async () => {
    try {
      setFetching(true)
      let res = await axios.get('/api/position')
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchPositions()
  }, [])

  const clearField = (key) =>
    setError((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

  const submitHandler = async (e) => {
    e.preventDefault()
    setFormError('')
    const clientErrors = {}
    if (isBlank(title)) clientErrors.title = fieldError('Position title is required')
    if (isBlank(description)) {
      clientErrors.description = fieldError('Description is required')
    }
    if (hasFieldErrors(clientErrors)) {
      setError(clientErrors)
      return
    }
    setError({})

    try {
      setLoading(true)
      const payload = { title, description, detail, hidden }

      if (editId) {
        let res = await axios.put('/api/position/' + editId, payload)
        setData(prev => prev.map(d => (d._id === editId ? res.data : d)))
        setEditId(null)
      } else {
        let res = await axios.post('/api/position', payload)
        setData(prev => [res.data, ...prev])
      }

      setTitle('')
      setDescription('')
      setDetail('')
      setHidden(false)
    } catch (err) {
      console.error(err)
      setFormError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          'Could not save position'
      )
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await axios.delete('/api/position/' + deleteTarget._id)
      setData(prev => prev.filter(d => d._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const onToggleHidden = async (_id) => {
    try {
      const res = await axios.patch('/api/position/' + _id + '/hidden')
      setData(prev => prev.map(d => (d._id === _id ? res.data : d)))
    } catch (err) {
      console.error(err)
    }
  }

  const onEdit = (d) => {
    setTitle(d.title)
    setDescription(d.description)
    setDetail(d.detail || '')
    setHidden(Boolean(d.hidden))
    setEditId(d._id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 md:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Manage Positions</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Create, edit, and manage job positions</p>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-8 border border-transparent dark:border-slate-800">
          <form onSubmit={submitHandler} className="space-y-4" noValidate>
            <FormErrorBanner message={formError} errors={error} />

            <FormField label="Position Title" required error={error.title?.msg}>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  clearField('title')
                }}
                placeholder="Enter position title"
                className={fieldClass}
                aria-invalid={Boolean(error.title)}
              />
            </FormField>

            <FormField label="Description" required error={error.description?.msg}>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  clearField('description')
                }}
                placeholder="Enter position description"
                rows="4"
                className={fieldClass}
                aria-invalid={Boolean(error.description)}
              />
            </FormField>

            <FormField label="Detail">
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Enter additional details (supports markdown formatting)"
                rows="4"
                className={fieldClass}
              />
            </FormField>

            <label className="flex items-center gap-3 cursor-pointer select-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 py-3">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-800 dark:text-slate-200">
                Hide from public site
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : editId ? 'Update Position' : 'Add Position'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null)
                  setTitle('')
                  setDescription('')
                  setDetail('')
                  setHidden(false)
                  setError({})
                  setFormError('')
                }}
                className="w-full bg-slate-400 dark:bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-500 dark:hover:bg-slate-600 transition"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {fetching ? (
          <div className="flex justify-center py-20">
            <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((position) => (
            <div
              key={position._id}
              className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 hover:shadow-lg transition border border-transparent dark:border-slate-800 relative"
            >
              {position.hidden && (
                <span className="absolute top-3 right-3 rounded-md bg-slate-900/85 px-2 py-1 text-xs font-medium text-white">
                  Hidden
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{position.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{position.description}</p>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/admin/adminposition/${position._id}`}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-medium text-sm text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => onEdit(position)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleHidden(position._id)}
                  className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium text-sm"
                >
                  {position.hidden ? 'Show' : 'Hide'}
                </button>
                <button
                  onClick={() => setDeleteTarget(position)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!data.length && (
            <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
              No positions yet.
            </p>
          )}
        </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this position?"
        message={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed.`
            : ''
        }
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default AdminPosition
