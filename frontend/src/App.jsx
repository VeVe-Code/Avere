import React, { useContext } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/footer.jsx'
import ScrollToTop from './components/ScrollToTop'
import CrispChat from './components/CrispChat'
import FaqChatBot from './components/FaqChatBot'
import PartnersMarquee from './components/PartnersMarquee.jsx'
import Maintenance from './pages/maintenance.jsx'
import { AuthContext } from './contexts/AuthContext'

const MAINTENANCE_ON =
  String(import.meta.env.VITE_MAINTENANCE_MODE || '').toLowerCase() === 'true'

const OPEN_PATHS = ['/login', '/verify-email']

function isOpenPath(pathname) {
  return OPEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

function isStaff(user) {
  return user?.role === 'admin' || user?.role === 'owner'
}

function App() {
  let { user, authReady } = useContext(AuthContext)
  let location = useLocation()

  if (MAINTENANCE_ON && !authReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#050a14]">
        <div className="h-9 w-9 border-[3px] border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  let showMaintenance =
    MAINTENANCE_ON && !isStaff(user) && !isOpenPath(location.pathname)

  if (showMaintenance) {
    return (
      <>
        <ScrollToTop />
        <Maintenance />
      </>
    )
  }

  return (
    <>
      <ScrollToTop />
      {!MAINTENANCE_ON && (
        <>
          <CrispChat />
          <FaqChatBot />
        </>
      )}
      {MAINTENANCE_ON && isStaff(user) && (
        <div className="sticky top-0 z-[100] bg-amber-500 text-amber-950 text-center text-xs sm:text-sm font-semibold py-1.5 px-3">
          Maintenance mode is on for visitors — you see the full site as{' '}
          {user?.role}.{' '}
          <Link to="/admin/adminservice" className="underline underline-offset-2">
            Open admin
          </Link>
        </div>
      )}

      <Navbar />

      <main className="relative z-0 min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Outlet />
      </main>

      {location.pathname === '/' && <PartnersMarquee />}
      <Footer />
    </>
  )
}

export default App
