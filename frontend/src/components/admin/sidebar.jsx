import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  X,
  LogOut,
  Home,
  Wrench,
  Tags,
  Newspaper,
  CalendarDays,
  Network,
  Server,
  Shield,
  Briefcase,
  Mail,
  Users,
  Settings,
} from 'lucide-react'
import axios from '../../helper/axios'
import { AuthContext } from '../../contexts/AuthContext'

export default function Sidebar({ open, onClose }) {
  let { dispatch, user } = useContext(AuthContext)
  let navigate = useNavigate()

  let logout = async () => {
    try {
      await axios.post('/api/users/logout')
    } catch (e) {
      // clear local session even if API fails
    }
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  let menu = [
    { name: 'Service', path: '/admin/adminservice', icon: Wrench },
    { name: 'Categories', path: '/admin/adminCategories', icon: Tags },
    { name: 'Knowledge', path: '/admin/adminknowledge', icon: Newspaper },
    { name: 'Events', path: '/admin/adminevents', icon: CalendarDays },
    { name: 'Network', path: '/admin/adminnetwork', icon: Network },
    { name: 'Systems', path: '/admin/adminsystems', icon: Server },
    { name: 'Security', path: '/admin/adminSecurity', icon: Shield },
    { name: 'Hiring Positions', path: '/admin/adminposition', icon: Briefcase },
    { name: 'Contact Data', path: '/admin/admincontactus', icon: Mail },
    {
      name: 'Users',
      path: '/admin/adminusers',
      icon: Users,
      ownerOnly: true,
    },
    { name: 'Settings', path: '/admin/adminsettings', icon: Settings },
  ].filter((item) => !item.ownerOnly || user?.role === 'owner')

  let displayName = user?.name || 'Admin'
  let displayEmail = user?.email || ''
  let initial = (displayName.trim()[0] || 'A').toUpperCase()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-dvh max-h-dvh w-[272px] flex flex-col overflow-hidden
        bg-[#0b1220] text-slate-200 border-r border-white/5
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      >
        <div className="shrink-0 px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-blue-400/90">
                Avere
              </p>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Admin
              </h2>
            </div>
            <button
              type="button"
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="shrink-0 px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] ring-1 ring-white/5 px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {displayName}
              </p>
              {displayEmail && (
                <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
              )}
              <p className="text-[10px] font-medium uppercase tracking-wider text-blue-400/80 mt-0.5">
                {user?.role || 'admin'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 [-webkit-overflow-scrolling:touch]">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Manage
          </p>
          <ul className="space-y-1">
            {menu.map((item) => {
              let Icon = item.icon
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
                      ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-[0_8px_24px_-12px_rgba(37,99,235,0.9)]'
                          : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                      }`
                    }
                  >
                    <Icon
                      size={17}
                      className="shrink-0 opacity-90"
                      strokeWidth={1.75}
                    />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="shrink-0 p-4 border-t border-white/5 space-y-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
            bg-white/[0.06] text-slate-200 ring-1 ring-white/10 hover:bg-white/[0.1] hover:text-white transition"
          >
            <Home size={16} />
            Home Page
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
            text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/10 hover:text-red-200 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
