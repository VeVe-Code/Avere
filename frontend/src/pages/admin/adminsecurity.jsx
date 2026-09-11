import React from 'react'
import AdminCatalogCard from '../../components/admin/AdminCatalogCard.jsx'
import Pagination from '../../components/admin/AdminPagination.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminCatalogPage } from '../../hooks/useAdminCatalogPage.jsx'

function adminsecurity() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchQuery = new URLSearchParams(location.search)
  let page = searchQuery.get('page') || 1
  page = parseInt(page) ? parseInt(page) : 1

  const {
    items: security,
    setItems: setSecurity,
    links,
    loading,
    reorder,
    onHiddenChange,
    onPinnedChange,
    SortBar,
    ReorderBar,
    manualOrder,
  } = useAdminCatalogPage({
    fetchUrl: '/api/security',
    reorderUrl: '/api/security/reorder',
    moveStorageKey: 'admin-move:security',
    catalogKey: 'security',
    adminListPath: '/admin/adminSecurity',
    page,
    linksKey: 'links',
  })

  const ondeleted = (_id) => {
    if (security.length === 1 && page > 1) {
      navigate(`/admin/adminsecurity?page=${page - 1}`)
    } else {
      setSecurity((prev) => prev.filter((s) => s._id !== _id))
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Security
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {reorder.movingId
              ? 'Go to any page, tap “Move here” on the target, or Cancel.'
              : reorder.switchingId
                ? 'Go to any page, tap “Switch here” on another item to swap, or Cancel.'
                : manualOrder
                  ? 'Pin items, drag to reorder, Move to insert, or Switch to swap two items.'
                  : 'Sorted by display date. Change List sorting above to use Manual order.'}
            {reorder.savingOrder ? ' Saving order…' : ''}
          </p>
        </div>
        <Link
          to="/admin/adminSecurity/create"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Security
        </Link>
      </div>

      <SortBar />

      {(reorder.movingId || reorder.switchingId) ? <ReorderBar /> : null}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {!!security.length &&
              security.map((s) => (
                <AdminCatalogCard
                  key={s._id}
                  item={s}
                  title={s.title}
                  description={s.description}
                  photo={s.photo}
                  detailPath={`/admin/adminSecurity/${s._id}`}
                  editPath={`/admin/adminsecurity/edit/${s._id}`}
                  apiBase="/api/security"
                  deleteTitle="Delete this security item?"
                  deleteMessage={`“${s.title}” will be permanently removed.`}
                  onDelete={ondeleted}
                  onHiddenChange={onHiddenChange}
                  onPinnedChange={onPinnedChange}
                  {...reorder.getCardReorderProps(s)}
                />
              ))}
            {!security.length && (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
                No security items yet.
              </p>
            )}
        </div>
      )}

      <div className="flex justify-center mt-10">
        {!!links && (
          <Pagination basePath="/admin/adminsecurity" links={links} page={page} />
        )}
      </div>
    </>
  )
}

export default adminsecurity
