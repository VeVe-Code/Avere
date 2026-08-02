import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { normalizeLinks } from '../../helper/paginationLinks'

/**
 * Shared admin list pagination.
 * @param {object} props
 * @param {string} props.basePath - e.g. "/admin/adminservice"
 * @param {object|null} props.links - raw backend links / Links object
 * @param {number|string} props.page - current page
 */
export default function AdminPagination({ basePath, links: rawLinks, page }) {
  const links = normalizeLinks(rawLinks)
  const currentPage = Number(page) || 1

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  if (!links?.pages?.length) return null

  const href = (n) => `${basePath}?page=${n}`

  const btnBase =
    'inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition'
  const btnIdle =
    'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
  const btnDisabled = 'text-slate-300 dark:text-slate-600 pointer-events-none'
  const btnActive = 'bg-blue-600 text-white shadow-sm'

  return (
    <nav aria-label="Pagination" className="flex justify-center mt-8 mb-2">
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm">
        <Link
          to={href(links.prevPage ? currentPage - 1 : currentPage)}
          aria-disabled={!links.prevPage}
          className={`${btnBase} ${links.prevPage ? btnIdle : btnDisabled}`}
        >
          ← Prev
        </Link>

        {links.pages.map((link) => {
          const n = Number(link.number)
          const active = n === currentPage
          return (
            <Link
              key={n}
              to={href(n)}
              aria-current={active ? 'page' : undefined}
              className={`${btnBase} w-9 px-0 ${active ? btnActive : btnIdle}`}
            >
              {n}
            </Link>
          )
        })}

        <Link
          to={href(links.nextPage ? currentPage + 1 : currentPage)}
          aria-disabled={!links.nextPage}
          className={`${btnBase} ${links.nextPage ? btnIdle : btnDisabled}`}
        >
          Next →
        </Link>
      </div>
    </nav>
  )
}
