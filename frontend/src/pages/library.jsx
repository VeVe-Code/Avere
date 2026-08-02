import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from '../helper/axios'
import assetUrl from '../helper/assetUrl'
import { AuthContext } from '../contexts/AuthContext'

function Library() {
  let { user, authReady } = useContext(AuthContext)
  let [items, setItems] = useState([])
  let [loading, setLoading] = useState(true)
  let [error, setError] = useState('')
  let [filter, setFilter] = useState('all')

  let fetchLibrary = async () => {
    try {
      setLoading(true)
      let res = await axios.get('/api/users/library')
      setItems(res.data || [])
      setError('')
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load library')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchLibrary()
  }, [user])

  let unsave = async (type, id) => {
    try {
      await axios.delete('/api/users/library/' + type + '/' + id)
      setItems(prev => prev.filter(item => !(item.type === type && item._id === id)))
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to remove')
    }
  }

  if (authReady && !user) {
    return <Navigate to="/login" replace state={{ from: '/library' }} />
  }

  let filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  let filters = [
    { key: 'all', label: 'All' },
    { key: 'knowledge', label: 'News' },
    { key: 'service', label: 'Service' },
    { key: 'system', label: 'System' },
    { key: 'network', label: 'Network' },
    { key: 'security', label: 'Security' },
    { key: 'events', label: 'Events' },
  ]

  return (
    <section className="min-h-screen py-16 px-4 sm:px-6 md:px-10 lg:px-24 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">My Library</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">All content you saved</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                filter === f.key
                  ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 border dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {loading && <p className="text-slate-500 dark:text-slate-400">Loading...</p>}

        {!loading && !filtered.length && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-10 text-center text-slate-500 dark:text-slate-400">
            No saved items yet. Open any detail page and tap Save to Library.
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <div key={item.type + '-' + item._id} className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              {item.photo && (
                <img
                  src={assetUrl(item.photo)}
                  alt={item.title}
                  className="w-full h-40 object-contain mb-4"
                />
              )}
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">{item.label}</p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm line-clamp-3">{item.description}</p>
              <div className="mt-4 flex gap-3">
                <Link
                  to={item.path}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Open →
                </Link>
                <button
                  type="button"
                  onClick={() => unsave(item.type, item._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Library
