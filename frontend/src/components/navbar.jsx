import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "../helper/axios"
import { Menu, X, ChevronDown } from "lucide-react"

function Navbar() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ responsive states (same behavior as first navbar)
  const [open, setOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("/api/publiccategory")
        setData(res.data || [])
      } catch (err) {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchdata()
  }, [])

  const menu = [
    { name: "Home", path: "/" },
    {
      name: "Solutions & Services",
      dropdown: [
        { name: "System", path: "/system" },
        { name: "Security", path: "/security" },
        { name: "Network", path: "/network" },
        { name: "Services", path: "/service" },
      ],
    },
    {
      name: "Product",
      dropdown: loading
        ? [{ name: "Loading...", path: "#" }]
        : data.map(item => ({
            name: item.title,
            path: `/service?category=${item._id}`,
          })),
    },
    { name: "News", path: "/knowledge" },
    { name: "About us", path: "/about" },
    { name: "Contactus", path: "/contactus" },
  ]

  return (
    <motion.nav
      style={{ overflow: "visible" }}
      initial={{ y: -100, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="
        relative px-6 lg:px-10 py-5
        bg-white/60 backdrop-blur-xl
        rounded-2xl
        shadow-[0_30px_80px_rgba(0,0,0,0.25)]
        border border-white/30
      "
    >
      {/* reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

      {/* ribbon */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="
          absolute top-0 left-1/2 -translate-x-1/2
          h-3 w-[85%] rounded-full
          bg-gradient-to-r from-[#1e293b] via-[#475569] to-[#86adb4]
          shadow-[0_8px_25px_rgba(0,0,0,0.4)]
        "
      />

      {/* top bar */}
      <div className="flex justify-between items-center relative z-20">
        {/* logo */}
        <div className="flex items-center space-x-4">
          <motion.img
            src="/logo.png"
            alt="logo"
            initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="w-14 lg:w-16 rounded-xl shadow-2xl"
          />
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="font-extrabold text-lg lg:text-xl tracking-widest"
          >
            BISLATOR
          </motion.span>
        </div>

        {/* desktop menu */}
        <ul className="hidden lg:flex gap-10 font-medium text-slate-800">
          {menu.map(item => (
            <li key={item.name} className="relative group">
              {item.path ? (
                <Link to={item.path} className="hover:text-blue-600">
                  {item.name}
                </Link>
              ) : (
                <span className="cursor-pointer hover:text-blue-600">
                  {item.name}
                </span>
              )}

              {/* desktop dropdown */}
              {item.dropdown && (
                <ul className="
                  absolute left-1/2 -translate-x-1/2 mt-4
                  min-w-[220px]
                  rounded-2xl bg-white/70 backdrop-blur-xl
                  shadow-xl border
                  opacity-0 scale-95 translate-y-2
                  group-hover:opacity-100
                  group-hover:scale-100
                  group-hover:translate-y-0
                  transition
                ">
                  {item.dropdown.map(sub => (
                    <li key={sub.name}>
                      <Link
                        to={sub.path}
                        className="block px-6 py-3 rounded-xl hover:bg-white/70"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-slate-800"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="
              lg:hidden mt-6
              bg-white/80 backdrop-blur-xl
              rounded-2xl px-6 py-4
              shadow-xl
            "
          >
            {menu.map(item => (
              <div key={item.name} className="py-2">
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="block font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.name ? null : item.name
                      )
                    }
                    className="flex justify-between w-full font-medium"
                  >
                    {item.name}
                    <ChevronDown
                      className={`transition ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {/* mobile dropdown */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.dropdown.map(sub => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-slate-600"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
