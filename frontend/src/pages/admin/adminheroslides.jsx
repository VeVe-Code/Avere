import React from 'react'
import AdminCatalogCard from '../../components/admin/AdminCatalogCard.jsx'
import { Link } from 'react-router-dom'
import { useAdminSimpleListPage } from '../../hooks/useAdminCatalogPage.jsx'

function AdminHeroSlides() {
  const {
    items: slides,
    setItems: setSlides,
    loading,
    reorder,
    onHiddenChange,
    ReorderBar,
  } = useAdminSimpleListPage({
    fetchUrl: '/api/heroslides',
    reorderUrl: '/api/heroslides/reorder',
    moveStorageKey: 'admin-move:heroslides',
  })

  const ondeleted = (_id) => {
    setSlides((prev) => prev.filter((s) => s._id !== _id))
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Hero Slides
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {reorder.movingId
              ? 'Tap “Move here” on another slide, or Cancel.'
              : reorder.switchingId
                ? 'Tap “Switch here” on another slide to swap places, or Cancel.'
                : 'Drag to reorder, Move to insert, or Switch to swap two slides.'}
            {reorder.savingOrder ? ' Saving order…' : ''}
          </p>
        </div>
        <Link
          to="/admin/adminheroslides/create"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add slide
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {(reorder.movingId || reorder.switchingId) ? <ReorderBar /> : null}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {!!slides.length &&
              slides.map((slide) => (
                <AdminCatalogCard
                  key={slide._id}
                  item={slide}
                  title={`Slide · ${slide.durationSeconds ?? 7}s`}
                  description={`Order ${slide.order ?? 0}`}
                  photo={slide.photo}
                  editPath={`/admin/adminheroslides/edit/${slide._id}`}
                  apiBase="/api/heroslides"
                  deleteTitle="Delete this slide?"
                  deleteMessage="This photo will be permanently removed from the home slider."
                  onDelete={ondeleted}
                  onHiddenChange={onHiddenChange}
                  supportsPin={false}
                  imageClassName="mx-auto h-48 w-full object-cover rounded-lg"
                  {...reorder.getCardReorderProps(slide)}
                />
              ))}
            {!slides.length && (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
                No hero slides yet.
              </p>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default AdminHeroSlides
