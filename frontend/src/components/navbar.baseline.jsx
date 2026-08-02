/**
 * BASELINE / ORIGINAL navbar design snapshot.
 * Restore by copying this file over navbar.jsx when user asks for မူရင်း design.
 * Kept for reference — not imported by the app.
 */
import React, { useEffect, useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../helper/axios'
import { Menu, X, ChevronDown } from 'lucide-react'
import { AuthContext } from '../contexts/AuthContext'
import { useI18n } from '../contexts/I18nContext'

function Navbar() {
  let [data, setData] = useState([])
  let [loading, setLoading] = useState(true)
  let [open, setOpen] = useState(false)
  let [activeDropdown, setActiveDropdown] = useState(null)
  let [scrolled, setScrolled] = useState(false)
  let [userMenuOpen, setUserMenuOpen] = useState(false)
  let [hoveredId, setHoveredId] = useState(null)
  let { user, dispatch } = useContext(AuthContext)
  let { t } = useI18n()
  let navigate = useNavigate()
  let location = useLocation()

  let logout = async () => {
    try {
      await axios.post('/api/users/logout')
    } catch (e) {}
    dispatch({ type: 'LOGOUT' })
    navigate('/')
    setOpen(false)
    setUserMenuOpen(false)
  }

  useEffect(() => {
    setOpen(false)
    setUserMenuOpen(false)
    setActiveDropdown(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    let fetchdata = async () => {
      try {
        let res = await axios.get('/api/publiccategory')
        setData(res.data || [])
      } catch (err) {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchdata()
    let handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  let isItemActive = (item) => {
    if (item.path === '/') return location.pathname === '/'
    if (item.path) return location.pathname.startsWith(item.path)
    return item.dropdown?.some(
      (sub) =>
        sub.path !== '#' &&
        (location.pathname === sub.path ||
          location.pathname + location.search === sub.path)
    )
  }

  let menu = [
    { id: 'home', name: t('nav.home'), path: '/' },
    {
      id: 'solutions',
      name: t('nav.solutions'),
      wide: false,
      dropdown: [
        { name: t('nav.system'), path: '/system' },
        { name: t('nav.security'), path: '/security' },
        { name: t('nav.network'), path: '/network' },
        { name: t('nav.services'), path: '/service' },
      ],
    },
    {
      id: 'product',
      name: t('nav.product'),
      wide: true,
      dropdown: loading
        ? [{ name: t('nav.loading'), path: '#' }]
        : data.map((item) => ({
            name: item.title,
            path: `/product?category=${item._id}`,
          })),
    },
    {
      id: 'news',
      name: t('nav.newsEvents'),
      wide: false,
      dropdown: [
        { name: t('nav.news'), path: '/knowledge' },
        { name: t('nav.events'), path: '/events' },
      ],
    },
    { id: 'about', name: t('nav.about'), path: '/about' },
    { id: 'contact', name: t('nav.contact'), path: '/contactus' },
  ]

  return (
    <motion.nav
      style={{ overflow: 'visible' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: scrolled ? 0.985 : 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`
        sticky top-0 z-[9999] transition-[padding,box-shadow,background-color] duration-500
        ${
          scrolled
            ? 'py-3 bg-white/90 dark:bg-slate-900/90 shadow-2xl'
            : 'py-5 bg-white/60 dark:bg-slate-900/70 shadow-[0_30px_80px_rgba(0,0,0,0.25)]'
        }
        px-7 lg:px-10 backdrop-blur-xl rounded-2xl
        border border-white/30 dark:border-slate-700/50
      `}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 w-[88%] h-2 bg-gradient-to-r from-[#1e293b] via-[#475569] to-[#86adb4] rounded-t-2xl shadow-[0_6px_20px_rgba(0,0,0,0.3)] origin-left"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-slate-800/30 dark:via-transparent pointer-events-none rounded-2xl" />

      <div className="flex justify-between items-center relative z-20">
        <motion.div animate={{ scale: scrolled ? 0.88 : 1 }} transition={{ duration: 0.35 }}>
          <Link to="/">
            <motion.img
              src="/myphoto2.jpg"
              alt="logo"
              whileHover={{ scale: 1.04 }}
              className="w-20 lg:w-32 rounded-xl shadow-2xl"
            />
          </Link>
        </motion.div>

        <ul className="hidden lg:flex gap-8 xl:gap-10 font-medium text-slate-800 dark:text-slate-100 items-center">
          {menu.map((item) => {
            let active = isItemActive(item)
            let openDrop = hoveredId === item.id && item.dropdown
            return (
              <li
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`relative inline-flex py-1 transition-colors ${
                      active ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {item.name}
                    <motion.span
                      className="absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-blue-500"
                      animate={{
                        width: active || hoveredId === item.id ? '100%' : '0%',
                        opacity: active || hoveredId === item.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.28 }}
                    />
                  </Link>
                ) : (
                  <span
                    className={`relative inline-flex items-center gap-1 cursor-pointer py-1 ${
                      active || openDrop
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {item.name}
                    <motion.span animate={{ rotate: openDrop ? 180 : 0 }}>
                      <ChevronDown size={15} />
                    </motion.span>
                  </span>
                )}

                <AnimatePresence>
                  {openDrop && (
                    <motion.ul
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-slate-200/60 dark:border-slate-700 ${
                        item.wide
                          ? 'w-[700px] grid grid-cols-3 gap-3 p-5'
                          : 'w-[250px] flex flex-col gap-1 p-3'
                      }`}
                    >
                      {item.dropdown.map((sub) => (
                        <li key={sub.path + sub.name}>
                          <Link
                            to={sub.path}
                            className="block px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            )
          })}

          <li className="relative">
            {user ? (
              <div>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  {user.name}
                  <ChevronDown size={16} className={userMenuOpen ? 'rotate-180' : ''} />
                </button>
                {userMenuOpen && (
                  <ul className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                    <li>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        {t('nav.myProfile')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        {t('nav.settings')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/library" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        {t('nav.myLibrary')}
                      </Link>
                    </li>
                    {(user.role === 'admin' || user.role === 'owner') && (
                      <li>
                        <Link to="/admin/adminservice" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-700 dark:text-blue-400 font-medium">
                          {t('nav.dashboard')}
                        </Link>
                      </li>
                    )}
                    <li>
                      <button type="button" onClick={logout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        {t('nav.logout')}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <span className="flex items-center gap-4">
                <Link to="/settings" className="hover:text-blue-600 dark:hover:text-blue-400">{t('nav.settings')}</Link>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">{t('nav.login')}</Link>
                <Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400">{t('nav.register')}</Link>
              </span>
            )}
          </li>
        </ul>

        <button type="button" onClick={() => setOpen(!open)} className="lg:hidden text-slate-800 dark:text-slate-100">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="mt-6 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl border border-slate-200/60 dark:border-slate-700 max-h-[75vh] overflow-y-auto">
              {menu.map((item) => (
                <div key={item.id} className="py-2">
                  {item.path ? (
                    <Link to={item.path} onClick={() => setOpen(false)} className="block font-medium">
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                      className="flex justify-between w-full font-medium"
                    >
                      {item.name}
                      <ChevronDown className={activeDropdown === item.id ? 'rotate-180' : ''} />
                    </button>
                  )}
                  {item.dropdown && activeDropdown === item.id && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdown.map((sub) => (
                        <Link key={sub.path + sub.name} to={sub.path} onClick={() => setOpen(false)} className="block text-sm text-slate-600 dark:text-slate-300">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
