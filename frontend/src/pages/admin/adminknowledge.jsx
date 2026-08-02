import axios from '../../helper/axios.js'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import KnowledgePagi from "../../components/admin/AdminPagination.jsx";
import AdminKnowledgeCard from "../../components/admin/AdminKnowledgeCard.jsx";
function AdminKnowledge() {
  const [knowledge, setKnowledge] = useState([])
  const [Links, setLinks] = useState(null)
  const [loading, setLoading] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()

  const searchQuery = new URLSearchParams(location.search)
  let page = parseInt(searchQuery.get('page')) || 1

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        setLoading(true)
        const res = await axios.get('/api/knowledge?page=' + page)
        setKnowledge(res.data.data)
        setLinks(res.data.Links)
        window.scrollTo(0, 0)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchKnowledge()
  }, [page])

  const onDeleted = (_id) => {
    if (knowledge.length === 1 && page > 1) {
      navigate('/admin/adminknowledge?page=' + (page - 1))
    } else {
      setKnowledge(prev => prev.filter(k => k._id !== _id))
    }
  }

  const onHiddenChange = (_id, hidden) => {
    setKnowledge((prev) =>
      prev.map((k) => (k._id === _id ? { ...k, hidden } : k))
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-7">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge</h1>

          <Link to="/admin/adminknowledge/create">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl">
              Create Knowledge
            </button>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {knowledge.length > 0 &&
              knowledge.map(k => (
                <AdminKnowledgeCard
                  key={k._id}
                  k={k}
                  onDeleted={onDeleted}
                  onHiddenChange={onHiddenChange}
                />
              ))}
            {!knowledge.length && (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
                No knowledge articles yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center px-4">
        {!loading && Links && (
          <KnowledgePagi basePath="/admin/adminknowledge" links={Links} page={page} />
        )}
      </div>
    </>
  )
}

export default AdminKnowledge
