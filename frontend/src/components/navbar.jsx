import React, { useEffect, useState, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../helper/axios'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { AuthContext } from '../contexts/AuthContext'
import { useI18n } from '../contexts/I18nContext'
import SearchModal from './SearchModal'

function Navbar() {
  let [data, setData] = useState([])
  let [loading, setLoading] = useState(true)
  let [open, setOpen] = useState(false)
  let [activeDropdown, setActiveDropdown] = useState(null)
  let [scrolled, setScrolled] = useState(false)
  let [userMenuOpen, setUserMenuOpen] = useState(false)
  let [searchOpen, setSearchOpen] = useState(false)
  let [hoveredId, setHoveredId] = useState(null)
  let [pill, setPill] = useState({ x: 0, w: 0, o: 0 })
  let rowRef = useRef(null)
  let refs = useRef({})
  let { user, dispatch } = useContext(AuthContext)
  let { t } = useI18n()
  let navigate = useNavigate()
  let location = useLocation()

  let logout = async () => {
    try {
      await axios.post('/api/users/logout')
    } catch (e) {}
    dispatch({ type: 'LOGOUT' }


    )
    navigate('/')
    setOpen(false)
    setUserMenuOpen(false)
  }

  useEffect(() => {
    setOpen(false)
    setUserMenuOpen(false)
    setSearchOpen(false)
    setActiveDropdown(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setOpen(false)
        setUserMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
    let onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  let movePill = (id) => {
    let el = refs.current[id]
    let row = rowRef.current
    if (!el || !row) return
    let rr = row.getBoundingClientRect()
    let er = el.getBoundingClientRect()
    setPill({ x: er.left - rr.left, w: er.width, o: 1 })
  }

  let syncPill = () => {
    let active = menu.find((m) => isItemActive(m))
    if (active) movePill(active.id)
    else setPill((p) => ({ ...p, o: 0 }))
  }

  let userInitial = (user?.name || '?').trim().charAt(0).toUpperCase() || '?'

  useEffect(() => {
    let cancelled = false

    const run = () => {
      if (cancelled) return
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) syncPill()
        })
      })
    }

    run()
    // Re-measure after height spring / font layout settle
    const t1 = setTimeout(run, 120)
    const t2 = setTimeout(run, 360)

    window.addEventListener('resize', run)
    document.fonts?.ready?.then?.(run)

    return () => {
      cancelled = true
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', run)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, loading, data, scrolled])

  return (
    <div
      className={`sticky top-0 z-[9999] isolate transition-[padding] duration-300 ${
        scrolled ? 'px-3 sm:px-4 pt-2 sm:pt-2.5' : 'px-3 sm:px-5 pt-3 sm:pt-4'
      }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[90rem]"
      >
        <div className="relative rounded-2xl isolate">
          {/* Shooting star: small tip in front, long tapering tail behind */}
          <svg
            aria-hidden
            className="avere-nav-border-svg z-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect className="avere-star-wake" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-tip" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-far" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-mid" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-near" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-head-aura" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-head" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
            <rect className="avere-star-head-core" x="1.5" y="1.5" rx="16" ry="16" pathLength="1000" vectorEffect="non-scaling-stroke" />
          </svg>

          <div
            className={`
              relative z-10 rounded-2xl isolate
              border border-slate-200/90 dark:border-white/10
              bg-white dark:bg-slate-950
              ${
                scrolled
                  ? 'shadow-[0_22px_60px_-24px_rgba(15,23,42,0.55)]'
                  : 'shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]'
              }
            `}
          >
          {/* Soft glow — clipped so it cannot bleed page content */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
            <div className="absolute -top-16 left-1/4 h-28 w-40 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-14 right-1/4 h-24 w-36 rounded-full bg-cyan-300/15 blur-3xl" />
          </div>

          <div
            className={`relative flex items-center justify-between gap-4 sm:gap-5 transition-[height,padding] duration-300 ease-out ${
              scrolled ? 'h-16 px-4 sm:px-5' : 'h-[5.75rem] px-5 sm:px-7'
            }`}
          >
            {/* Logo */}
            <Link to="/" className={`relative z-20 flex items-center shrink-0 pl-0.5 group ${
              scrolled ? 'gap-3' : 'gap-3.5'
            }`}>
              <motion.img
                src="/myphoto2.jpg"
                alt="Avere"
                whileHover={{ scale: 1.06, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 360, damping: 16 }}
                className={`rounded-2xl object-cover shadow-lg shadow-blue-500/15
                  ring-1 ring-slate-200 dark:ring-white/20 transition-[width,height] duration-300
                  ${scrolled ? 'h-11 w-11' : 'h-16 w-16'}`}
              />
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="hidden sm:block leading-none"
              >
                <div className={`font-bold tracking-tight text-slate-900 dark:text-white
                  transition-all group-hover:text-blue-700 dark:group-hover:text-blue-300
                  ${scrolled ? 'text-base' : 'text-xl'}`}>
                  Avere
                </div>
                <div className={`font-medium text-slate-500 dark:text-slate-400
                  ${scrolled ? 'mt-1 text-[11px]' : 'mt-1.5 text-sm'}`}>
                  IT Solutions
                </div>
              </motion.div>
            </Link>

            {/* Nav + sliding glass pill */}
            <motion.nav
              ref={rowRef}
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.045, delayChildren: 0.18 } },
              }}
              className="relative z-20 hidden lg:flex items-center"
              onMouseLeave={() => {
                setHoveredId(null)
                syncPill()
              }}
            >
              <motion.div
                aria-hidden
                className="absolute top-0 bottom-0 rounded-xl
                  bg-blue-500/12 dark:bg-blue-400/20
                  ring-1 ring-blue-500/20 dark:ring-blue-300/25
                  pointer-events-none"
                animate={{
                  left: pill.x,
                  width: pill.w,
                  opacity: pill.o,
                }}
                transition={{
                  left: { type: 'spring', stiffness: 480, damping: 32, mass: 0.7 },
                  width: { type: 'spring', stiffness: 480, damping: 32, mass: 0.7 },
                  opacity: { duration: 0.18 },
                }}
              />

              {menu.map((item) => {
                let active = isItemActive(item)
                let openDrop = hoveredId === item.id && item.dropdown
                let lit = active || hoveredId === item.id

                return (
                  <motion.div
                    key={item.id}
                    ref={(el) => {
                      if (el) refs.current[item.id] = el
                    }}
                    variants={{
                      hidden: { opacity: 0, y: -8 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    className="relative"
                    onMouseEnter={() => {
                      setHoveredId(item.id)
                      movePill(item.id)
                    }}
                  >
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={`
                          relative z-10 inline-flex items-center rounded-xl
                          font-semibold transition-all duration-200
                          ${scrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2.5 text-[15px]'}
                          ${
                            lit
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-800 dark:text-slate-100'
                          }
                        `}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={`
                          relative z-10 inline-flex items-center gap-1 rounded-xl
                          font-semibold transition-all duration-200
                          ${scrolled ? 'px-3.5 py-2 text-sm' : 'px-4 py-2.5 text-[15px]'}
                          ${
                            lit
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-800 dark:text-slate-100'
                          }
                        `}
                      >
                        {item.name}
                        <motion.span
                          animate={{ rotate: openDrop ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        >
                          <ChevronDown size={scrolled ? 14 : 16} />
                        </motion.span>
                      </button>
                    )}

                    <AnimatePresence>
                      {openDrop && (
                        <motion.ul
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                          className={`
                            absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50
                            ${
                              item.wide && item.dropdown.length >= 6
                                ? 'w-[min(640px,70vw)] grid grid-cols-3 gap-1 p-2'
                                : item.wide && item.dropdown.length >= 3
                                  ? 'w-[min(420px,70vw)] grid grid-cols-2 gap-1 p-2'
                                  : 'w-56 flex flex-col gap-0.5 p-1.5'
                            }
                            rounded-2xl
                            bg-white dark:bg-slate-900
                            border border-slate-200/90 dark:border-white/10
                            shadow-[0_28px_60px_-22px_rgba(15,23,42,0.5)]
                          `}
                        >
                          {item.dropdown.map((sub, i) => (
                            <motion.li
                              key={sub.path + sub.name}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.025 * i, duration: 0.22 }}
                            >
                              <Link
                                to={sub.path}
                                className="block px-3 py-2.5 rounded-xl text-sm
                                  text-slate-600 dark:text-slate-300
                                  hover:bg-blue-50 dark:hover:bg-blue-500/15
                                  hover:text-blue-700 dark:hover:text-blue-300
                                  hover:translate-x-0.5
                                  transition-all duration-200"
                              >
                                {sub.name}
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.nav>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 flex items-center gap-2"
            >
              <div className="hidden lg:flex items-center gap-2">
                {user ? (
                  <div className="relative">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-label={user.name || 'Account menu'}
                      className={`relative inline-flex items-center justify-center
                        rounded-full
                        bg-blue-600 text-white font-bold
                        shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]
                        ring-2 ring-white/90 dark:ring-slate-950
                        hover:bg-blue-500 transition-all
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                        ${scrolled ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-[15px]'}`}
                    >
                      {userInitial}
                    </motion.button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                          className="absolute right-0 top-full mt-2 w-52 rounded-2xl
                            bg-white dark:bg-slate-900
                            border border-slate-200/90 dark:border-white/10 shadow-xl p-1.5 z-50"
                        >
                          <li className="px-3 py-2.5 mb-1 border-b border-slate-100 dark:border-white/10">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-full bg-blue-600 text-white text-sm font-bold">
                                {userInitial}
                              </span>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {user.name}
                              </p>
                            </div>
                          </li>
                          {[
                            { to: '/profile', label: t('nav.myProfile') },
                            { to: '/settings', label: t('nav.settings') },
                            { to: '/library', label: t('nav.myLibrary') },
                          ].map((link) => (
                            <li key={link.to}>
                              <Link
                                to={link.to}
                                onClick={() => setUserMenuOpen(false)}
                                className="block px-3 py-2 rounded-xl text-sm
                                  hover:bg-blue-50 dark:hover:bg-blue-500/15 transition-colors"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                          {(user.role === 'admin' || user.role === 'owner') && (
                            <li>
                              <Link
                                to="/admin/adminservice"
                                onClick={() => setUserMenuOpen(false)}
                                className="block px-3 py-2 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400"
                              >
                                {t('nav.dashboard')}
                              </Link>
                            </li>
                          )}
                          <li className="mt-1 border-t border-slate-100 dark:border-white/10 pt-1">
                            <button
                              type="button"
                              onClick={logout}
                              className="w-full text-left px-3 py-2 rounded-xl text-sm
                                hover:bg-slate-100 bg-red-600 text-white dark:hover:bg-white/8"
                            >
                              {t('nav.logout')}
                            </button>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2.5 text-[15px] font-semibold text-slate-800 dark:text-slate-100
                        hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="group relative inline-flex items-center overflow-hidden rounded-xl
                        bg-slate-900 dark:bg-white
                        px-5 py-2.5 text-[15px] font-bold
                        text-white dark:text-slate-900
                        shadow-[0_10px_28px_-8px_rgba(37,99,235,0.55)]
                        transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0
                        group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative">{t('nav.register')}</span>
                    </Link>
                  </>
                )}
              </div>

              {user && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setOpen(true)}
                  aria-label={user.name || 'Account'}
                  className={`lg:hidden inline-flex items-center justify-center
                    rounded-full bg-blue-600 text-white font-bold
                    shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]
                    ring-2 ring-white/90 dark:ring-slate-950
                    hover:bg-blue-500 transition-all
                    ${scrolled ? 'h-9 w-9 text-sm' : 'h-10 w-10 text-[15px]'}`}
                >
                  {userInitial}
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setSearchOpen(true)
                  setOpen(false)
                  setUserMenuOpen(false)
                }}
                aria-label="Search"
                title="Search (Ctrl+K)"
                className={`inline-flex items-center justify-center rounded-xl
                  bg-slate-100 dark:bg-white/10
                  text-slate-900 dark:text-white
                  ring-1 ring-slate-200 dark:ring-white/15
                  hover:bg-slate-200 dark:hover:bg-white/15 transition
                  ${scrolled ? 'h-9 w-9' : 'h-10 w-10 lg:h-11 lg:w-11'}`}
              >
                <Search size={scrolled ? 16 : 18} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setOpen(!open)}
                className={`lg:hidden inline-flex items-center justify-center rounded-xl
                  bg-slate-100 dark:bg-white/10
                  text-slate-900 dark:text-white
                  ring-1 ring-slate-200 dark:ring-white/15
                  ${scrolled ? 'h-10 w-10' : 'h-12 w-12'}`}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? 'close' : 'menu'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex"
                  >
                    {open ? <X size={scrolled ? 20 : 24} /> : <Menu size={scrolled ? 20 : 24} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
          </div>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="lg:hidden overflow-hidden mt-2"
            >
              <div
                className="rounded-[1.35rem] border border-slate-200/90 dark:border-white/10
                  bg-white dark:bg-slate-950
                  px-4 py-3 max-h-[70vh] overflow-y-auto
                  shadow-[0_24px_50px_-24px_rgba(15,23,42,0.45)]
                  text-slate-800 dark:text-slate-100"
              >
                {menu.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    className="border-b border-slate-100/80 dark:border-white/5 last:border-0"
                  >
                    {item.path ? (
                      <Link
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className="block py-3 text-[15px] font-medium"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.id ? null : item.id)
                        }
                        className="flex w-full items-center justify-between py-3 text-[15px] font-medium"
                      >
                        {item.name}
                        <motion.span animate={{ rotate: activeDropdown === item.id ? 180 : 0 }}>
                          <ChevronDown size={16} />
                        </motion.span>
                      </button>
                    )}
                    <AnimatePresence>
                      {item.dropdown && activeDropdown === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 pl-3 space-y-1">
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.path + sub.name}
                                to={sub.path}
                                onClick={() => setOpen(false)}
                                className="block py-2 text-sm text-slate-500 dark:text-slate-400
                                  hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <div className="pt-3 flex flex-col gap-2">
                  {user ? (
                    <>
                      <p className="flex items-center gap-2.5 text-sm text-slate-500">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full
                          bg-blue-600 text-white text-sm font-bold">
                          {userInitial}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
                      </p>
                      <Link to="/profile" onClick={() => setOpen(false)} className="py-2">
                        {t('nav.myProfile')}
                      </Link>
                      <Link to="/settings" onClick={() => setOpen(false)} className="py-2">
                        {t('nav.settings')}
                      </Link>
                      <Link to="/library" onClick={() => setOpen(false)} className="py-2">
                        {t('nav.myLibrary')}
                      </Link>
                      {(user.role === 'admin' || user.role === 'owner') && (
                        <Link
                          to="/admin/adminservice"
                          onClick={() => setOpen(false)}
                          className="py-2 text-blue-600 dark:text-blue-400 font-semibold"
                        >
                          {t('nav.dashboard')}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={logout}
                        className="text-left py-2.5 px-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
                      >
                        {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="inline-flex justify-center rounded-xl
                          bg-gradient-to-r from-blue-600 to-cyan-500
                          text-white py-2.5 text-sm font-semibold"
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                        className="mt-1 inline-flex justify-center rounded-xl
                          bg-gradient-to-r from-blue-600 to-cyan-500
                          text-white py-2.5 text-sm font-semibold"
                      >
                        {t('nav.register')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export default Navbar
