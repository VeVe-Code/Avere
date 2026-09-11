import axios from '../../helper/axios'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Plus, Search, Package, X } from 'lucide-react'
import AdminCategorycard from '../../components/admin/admincartegorycard'
import { FormErrorBanner } from '../../components/admin/AdminFormUI'
import { PRODUCT_CATEGORIES } from '../../constants/productCategories'

function AdminCategory() {
  const [data, setData] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [editId, setEditId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const inputRef = useRef(null)

  const fetchCategories = async () => {
    try {
      setFetching(true)
      let res = await axios.get('/api/category')
      setData(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError('Failed to load products')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (formOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [formOpen, editId])

  const filtered = useMemo(() => {
    let list = data
    if (sectionFilter !== 'all') {
      list = list.filter((d) => d.category === sectionFilter)
    }
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (d) =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.category || '').toLowerCase().includes(q)
    )
  }, [data, query, sectionFilter])

  const resetForm = () => {
    setTitle('')
    setCategory('')
    setEditId(null)
    setError('')
    setFormOpen(false)
  }

  const openCreate = () => {
    setEditId(null)
    setTitle('')
    setCategory('')
    setError('')
    setFormOpen(true)
  }

  const onEdit = (d) => {
    setEditId(d._id)
    setTitle(d.title || '')
    setCategory(d.category || '')
    setError('')
    setFormOpen(true)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const value = title.trim()
    if (!value) {
      setError('Product title is required')
      return
    }
    if (!category) {
      setError('Please select a category')
      return
    }

    try {
      setLoading(true)
      setError('')
      const payload = { title: value, category }

      if (editId) {
        let res = await axios.patch('/api/category/' + editId, payload)
        setData((prev) => prev.map((d) => (d._id === editId ? res.data : d)))
      } else {
        let res = await axios.post('/api/category', payload)
        setData((prev) => [res.data, ...prev])
      }

      resetForm()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          'Could not save product'
      )
    } finally {
      setLoading(false)
    }
  }

  const onDelete = (_id) => {
    setData((prev) => prev.filter((d) => d._id !== _id))
    if (editId === _id) resetForm()
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-1">
            Catalog
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add a product name and assign it to one of the 6 fixed categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      {(formOpen || editId) && (
        <div
          className={`mb-6 rounded-2xl border bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm ${
            error
              ? 'border-red-200 dark:border-red-900/50'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {editId ? 'Edit product' : 'New product'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                No image needed — title + category only.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mb-4">
              <FormErrorBanner message={error} />
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-3" noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="product-title">
                Product title
              </label>
              <input
                id="product-title"
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. Microsoft Azure, Cisco, AWS..."
                aria-invalid={Boolean(error)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-400 dark:border-red-500/80 bg-red-50/40 dark:bg-red-950/25 focus:ring-red-500/25 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-blue-500/40 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="product-category">
                Category
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  if (error) setError('')
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Save changes' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 min-w-[200px]"
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} of {data.length} products
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
            Product
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 text-right">
            Actions
          </span>
        </div>

        {fetching ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading products...
          </div>
        ) : filtered.length > 0 ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((d) => (
              <AdminCategorycard
                key={d._id}
                d={d}
                active={editId === d._id}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </ul>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Package size={22} />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {query.trim() || sectionFilter !== 'all' ? 'No matching products' : 'No products yet'}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {query.trim() || sectionFilter !== 'all'
                ? 'Try a different search or filter.'
                : 'Create your first product and pick a category.'}
            </p>
            {!query.trim() && sectionFilter === 'all' && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add product
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default AdminCategory
