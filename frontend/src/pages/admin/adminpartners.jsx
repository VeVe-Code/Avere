import React from 'react'

import AdminCatalogCard from '../../components/admin/AdminCatalogCard.jsx'

import { Link } from 'react-router-dom'

import { useAdminSimpleListPage } from '../../hooks/useAdminCatalogPage.jsx'



function AdminPartners() {

  const {

    items: partners,

    setItems: setPartners,

    loading,

    reorder,

    onHiddenChange,

    ReorderBar,

  } = useAdminSimpleListPage({
    fetchUrl: '/api/partners',
    reorderUrl: '/api/partners/reorder',
    moveStorageKey: 'admin-move:partners',
  })



  const ondeleted = (_id) => {

    setPartners((prev) => prev.filter((p) => p._id !== _id))

  }



  return (

    <>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">

            Partners

          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">

            {reorder.movingId

              ? 'Tap “Move here” on another partner, or Cancel.'

              : reorder.switchingId

                ? 'Tap “Switch here” on another partner to swap places, or Cancel.'

                : 'Drag to reorder, Move to insert, or Switch to swap two partners.'}

            {reorder.savingOrder ? ' Saving order…' : ''}

          </p>

        </div>

        <Link

          to="/admin/adminpartners/create"

          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"

        >

          Add partner

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

            {!!partners.length &&

              partners.map((partner) => (

                <AdminCatalogCard

                  key={partner._id}

                  item={partner}

                  title={partner.name || 'Untitled partner'}

                  description={`Order ${partner.order ?? 0}`}

                  photo={partner.photo}

                  editPath={`/admin/adminpartners/edit/${partner._id}`}

                  apiBase="/api/partners"

                  deleteTitle="Delete this partner?"

                  deleteMessage="This logo will be permanently removed from the partners marquee."

                  onDelete={ondeleted}

                  onHiddenChange={onHiddenChange}

                  supportsPin={false}

                  imageClassName="max-h-24 max-w-full object-contain p-3 mx-auto"

                  {...reorder.getCardReorderProps(partner)}

                />

              ))}

            {!partners.length && (

              <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">

                No partners yet.

              </p>

            )}

          </div>

        </>

      )}

    </>

  )

}



export default AdminPartners

