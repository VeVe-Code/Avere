import React, { useContext, useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/admin/sidebar'
import { Menu } from 'lucide-react'
import { AuthContext } from './contexts/AuthContext'

function AdminLayout() {
  let [open, setOpen] = useState(false)
  let { user, authReady } = useContext(AuthContext)
  let location = useLocation()

  let isAuthPage = location.pathname === '/admin/login'

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
        <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthPage) {
    if (user?.role === 'admin' || user?.role === 'owner') {
      return <Navigate to="/" replace />
    }
    return <Outlet />
  }

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 lg:ml-[272px]">
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-6
          bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Dashboard
              </p>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                Avere Admin
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {(user?.name?.trim()?.[0] || 'A').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate max-w-[160px]">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
                {user?.email}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{<Outlet />}</div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
