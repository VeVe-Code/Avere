import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function hrefFor(page, query = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })
  params.set('page', String(page))
  return `?${params.toString()}`
}

export default function ListPagination({ links, page, query = {} }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  if (!links?.pages?.length) return null

  const currentPage = page

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mt-12 flex justify-center"
    >
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3 py-2 shadow-sm">
        <Link
          to={hrefFor(links.prevPage ? page - 1 : page, query)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            currentPage === 1
              ? 'text-slate-300 dark:text-slate-600 pointer-events-none'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          ← Prev
        </Link>

        {links.pages.map((link) => (
          <Link
            key={link.number}
            to={hrefFor(link.number, query)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
              link.number === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {link.number}
          </Link>
        ))}

        <Link
          to={hrefFor(links.nextPage ? page + 1 : page, query)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            !links.nextPage
              ? 'text-slate-300 dark:text-slate-600 pointer-events-none'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          Next →
        </Link>
      </div>
    </motion.div>
  )
}
