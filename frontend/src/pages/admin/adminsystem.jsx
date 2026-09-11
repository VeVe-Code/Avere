import React from 'react'
import AdminCatalogCard from '../../components/admin/AdminCatalogCard.jsx'
import Pagination from '../../components/admin/AdminPagination.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminCatalogPage } from '../../hooks/useAdminCatalogPage.jsx'

function adminsystem() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchQuery = new URLSearchParams(location.search)
  let page = searchQuery.get('page') || 1
  page = parseInt(page) ? parseInt(page) : 1

  const {
    items: system,
    setItems: setSystem,
    links,
    loading,
    reorder,
    onHiddenChange,
    onPinnedChange,
    SortBar,
    ReorderBar,
    manualOrder,
  } = useAdminCatalogPage({
    fetchUrl: '/api/systems',
    reorderUrl: '/api/systems/reorder',
    moveStorageKey: 'admin-move:systems',
    catalogKey: 'systems',
    adminListPath: '/admin/adminsystems',
    page,
  })

  const ondeleted = (_id) => {
    if (system.length === 1 && page > 1) {
      navigate('/admin/adminsystems?page=' + (page - 1))
    } else {
      setSystem((prev) => prev.filter((s) => s._id !== _id))
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            System
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
          to="/admin/adminsystems/create"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create System
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
            {!!system.length &&
              system.map((s) => (
                <AdminCatalogCard
                  key={s._id}
                  item={s}
                  title={s.title}
                  description={s.description}
                  photo={s.photo}
                  detailPath={`/admin/adminsystems/${s._id}`}
                  editPath={`/admin/adminsystems/edit/${s._id}`}
                  apiBase="/api/systems"
                  deleteTitle="Delete this system item?"
                  deleteMessage={`“${s.title}” will be permanently removed.`}
                  onDelete={ondeleted}
                  onHiddenChange={onHiddenChange}
                  onPinnedChange={onPinnedChange}
                  {...reorder.getCardReorderProps(s)}
                />
              ))}
            {!system.length && (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
                No systems yet.
              </p>
            )}
        </div>
      )}

      <div className="flex justify-center mt-10">
        {links && (
          <Pagination basePath="/admin/adminsystems" links={links} page={page} />
        )}
      </div>
    </>
  )
}

export default adminsystem
