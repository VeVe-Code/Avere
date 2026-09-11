import React from 'react'
import AdminCatalogCard from '../../components/admin/AdminCatalogCard.jsx'
import Pagination from '../../components/admin/AdminPagination.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminCatalogPage } from '../../hooks/useAdminCatalogPage.jsx'

function AdminKnowledge() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchQuery = new URLSearchParams(location.search)
  let page = parseInt(searchQuery.get('page')) || 1

  const {
    items: knowledge,
    setItems: setKnowledge,
    links,
    loading,
    reorder,
    onHiddenChange,
    onPinnedChange,
    SortBar,
    ReorderBar,
    manualOrder,
  } = useAdminCatalogPage({
    fetchUrl: '/api/knowledge',
    reorderUrl: '/api/knowledge/reorder',
    moveStorageKey: 'admin-move:knowledge',
    catalogKey: 'knowledge',
    adminListPath: '/admin/adminknowledge',
    page,
    linksKey: 'Links',
  })

  const onDeleted = (_id) => {
    if (knowledge.length === 1 && page > 1) {
      navigate('/admin/adminknowledge?page=' + (page - 1))
    } else {
      setKnowledge((prev) => prev.filter((k) => k._id !== _id))
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Knowledge
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {reorder.movingId
              ? 'Go to any page, tap “Move here” on the target, or Cancel.'
              : reorder.switchingId
                ? 'Go to any page, tap “Switch here” on another item to swap, or Cancel.'
                : manualOrder
                  ? 'Pin posts, drag to reorder, Move to insert, or Switch to swap two items.'
                  : 'Sorted by display date. Change List sorting above to use Manual order.'}
            {reorder.savingOrder ? ' Saving order…' : ''}
          </p>
        </div>
        <Link
          to="/admin/adminknowledge/create"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Knowledge
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
            {knowledge.length > 0 &&
              knowledge.map((k) => (
                <AdminCatalogCard
                  key={k._id}
                  item={k}
                  title={k.title}
                  description={k.description}
                  photo={k.photo}
                  detailPath={`/admin/adminknowledge/${k._id}`}
                  editPath={`/admin/adminknowledge/edit/${k._id}`}
                  apiBase="/api/knowledge"
                  deleteTitle="Delete this post?"
                  deleteMessage={`“${k.title}” will be permanently removed.`}
                  onDelete={onDeleted}
                  onHiddenChange={onHiddenChange}
                  onPinnedChange={onPinnedChange}
                  imageClassName="w-full h-48 object-cover"
                  {...reorder.getCardReorderProps(k)}
                />
              ))}
            {!knowledge.length && (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
                No knowledge articles yet.
              </p>
            )}
        </div>
      )}

      <div className="flex justify-center mt-10">
        {links && (
          <Pagination basePath="/admin/adminknowledge" links={links} page={page} />
        )}
      </div>
    </>
  )
}

export default AdminKnowledge
