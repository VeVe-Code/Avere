import { useEffect, useState } from 'react'
import axios from '../../helper/axios.js'
import AdminserviceCard from '../../components/admin/AdminServiceCard.jsx'
import Pagination from '../../components/admin/AdminPagination.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

function Adminservice() {
  let [services, setServices] = useState([])
  let location = useLocation()
  let [links, setLinks] = useState(null)
  let [loading, setLoading] = useState(true)
  let navigate = useNavigate()
  let searchQuery = new URLSearchParams(location.search)
  let page = searchQuery.get('page') || 1
  page = parseInt(page) ? parseInt(page) : 1

  useEffect(() => {
    let fetchservices = async () => {
      try {
        setLoading(true)
        let res = await axios('/api/service?page=' + page)
        let data = res.data
        setServices(data.data)
        setLinks(data.links)
        window.scrollTo(0, 0)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchservices()
  }, [page])

  let onDelete = (_id) => {
    if (services.length === 1 && page > 1) {
      navigate('/admin/adminservice?page=' + (page - 1))
    } else {
      setServices((prev) => prev.filter((service) => service._id !== _id))
    }
  }

  let onHiddenChange = (_id, hidden) => {
    setServices((prev) =>
      prev.map((service) => (service._id === _id ? { ...service, hidden } : service))
    )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-1">
            Catalog
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Services
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create and manage service listings.
          </p>
        </div>
        <Link
          to="/admin/adminservice/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus size={16} />
          Create Service
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {!!services.length &&
              services.map((service) => (
                <AdminserviceCard
                  key={service._id}
                  service={service}
                  onDelete={onDelete}
                  onHiddenChange={onHiddenChange}
                />
              ))}
          </div>

          {!services.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
              No services yet. Create your first one.
            </div>
          )}
        </>
      )}

      <div className="flex justify-center mt-10">
        {!loading && !!links && (
          <Pagination basePath="/admin/adminservice" links={links} page={page} />
        )}
      </div>
    </>
  )
}

export default Adminservice
