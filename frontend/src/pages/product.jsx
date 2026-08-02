import React, { useEffect, useState } from 'react'
import axios from '../helper/axios'
import { Link, useSearchParams } from 'react-router-dom'
import assetUrl from '../helper/assetUrl'
import LoadingSpinner from '../components/LoadingSpinner'

function Product() {
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category') || ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({ systems: [], security: [], network: [], services: [] })
  const [categoryTitle, setCategoryTitle] = useState('All')

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (categoryId) params.category = categoryId
      params.limit = 12
      const res = await axios.get('/api/publicall', { params })
      setData(res.data || { systems: [], security: [], network: [], services: [] })
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get('/api/publiccategory')
        const cats = res.data || []
        const found = cats.find((c) => c._id === categoryId)
        setCategoryTitle(found ? found.title : 'All')
      } catch {
        setCategoryTitle('All')
      }
    }
    run()
  }, [categoryId])

  useEffect(() => {
    fetchAll()
  }, [categoryId])

  const img = (p) => assetUrl(p)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-white dark:bg-slate-950">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Products {categoryTitle !== 'All' ? `• ${categoryTitle}` : ''}
        </h1>
      </div>

      {loading && <LoadingSpinner />}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (() => {
        const sections = [
          { key: 'systems', title: 'Systems', items: data.systems, to: '/system', detail: (id) => `/system/${id}`, service: false },
          { key: 'security', title: 'Security', items: data.security, to: '/security', detail: (id) => `/security/${id}`, service: false },
          { key: 'network', title: 'Network', items: data.network, to: '/network', detail: (id) => `/network/${id}`, service: false },
          { key: 'services', title: 'Services', items: data.services, to: '/service', detail: (id) => `/service/${id}`, service: true },
        ]
        const nonEmpty = sections.filter((s) => Array.isArray(s.items) && s.items.length > 0)
        if (nonEmpty.length === 0) {
          return <div className="text-slate-600 dark:text-slate-400">No products found.</div>
        }
        const s = nonEmpty[0]
        return <Section title={s.title} items={s.items} to={s.to} detail={s.detail} img={img} service={s.service} />
      })()}
    </div>
  )
}

function Section({ title, items, to, detail, img, service }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <Link to={to} className="text-blue-600 dark:text-blue-400">See all →</Link>
      </div>
      {items.length === 0 ? (
        <div className="text-gray-500 dark:text-slate-400">No {title.toLowerCase()} found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item._id} to={detail(item._id)} className="block rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow">
              <img src={img(item.photo)} alt={service ? item.name : item.title} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-3">
                <div className="text-sm text-gray-500 dark:text-slate-400">{item.category?.title}</div>
                <h3 className="font-semibold mt-1 text-slate-900 dark:text-slate-100">{service ? item.name : item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Product
