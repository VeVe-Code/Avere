import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import AdminCategorycard from '../../components/admin/admincartegorycard'

function AdminCategory() {
  const [data, setData] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)

  const fetchCategories = async () => {
    try {
      let res = await axios.get('/api/category')
      setData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setLoading(true)

      if (editId) {
        let res = await axios.patch('/api/category/' + editId, { title })
        setData(prev => prev.map(d => (d._id === editId ? res.data : d)))
        setEditId(null)
      } else {
        let res = await axios.post('/api/category', { title })
        setData(prev => [res.data, ...prev])
      }

      setTitle('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const Ondelete = (_id) => {
    setData(prev => prev.filter(d => d._id !== _id))
  }

  const onEdit = (d) => {
    setTitle(d.title)
    setEditId(d._id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8 py-6">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl rounded-2xl 
                      px-4 md:px-8 py-4 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Categories
          </h1>

          {/* Form */}
          <form
            onSubmit={submitHandler}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Category title..."
              className="w-full sm:w-64 border border-slate-300 
                         px-4 py-2 rounded-xl focus:outline-none 
                         focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 
                         text-white px-6 py-2 rounded-xl 
                         transition-all duration-200 
                         disabled:opacity-50"
            >
              {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((d) => (
            <AdminCategorycard
              key={d._id}
              d={d}
              Ondelete={Ondelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <p className="text-center text-slate-500 col-span-full">
            No categories found
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminCategory
