import axios from '../helper/axios'
import React, { useEffect, useState } from 'react'
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { Link, useSearchParams } from "react-router-dom"

function Service() {
  let [data, setData] = useState([])
  let [search, setSearch] = useState('')
  let [loading, setLoading] = useState(false)

  // ✅ GET category from URL (?category=ID)
  const [searchParams] = useSearchParams()
  const category = searchParams.get("category")

  useEffect(() => {
    let fetchData = async () => {
      try {
        setLoading(true)

        let res = await axios.get('/api/publicservice', {
          params: {
            title: search,
            category: category
          }
        })

        setData(res.data.data || [])
      } catch (err) {
        console.log("API ERROR:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, category])

  return (
    <section className="min-h-screen py-16 px-4 sm:px-6 md:px-10 lg:px-24 bg-gray-50">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-left"
        >
          Services
        </motion.h2>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full sm:w-80 group"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            whileHover={{ opacity: 0.6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 
                       rounded-xl blur"
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative flex items-center bg-white rounded-xl shadow-md px-4 py-2"
          >
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Search className="w-5 h-5 text-gray-400 mr-2 transition group-focus-within:text-blue-500" />
            </motion.div>

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400
                         focus:placeholder-gray-300 text-sm sm:text-base"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-400 mt-10">
          Loading services...
        </p>
      )}

      {/* Content */}
      <div className="mt-6 space-y-5 px-0 sm:px-4 md:px-10 lg:px-20">
        {!loading && Array.isArray(data) && data.map((d, index) => (

          <motion.div
            key={d._id}
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: index * 0.08
            }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-start
                       shadow-xl py-4 sm:py-6 px-3 sm:px-6 rounded-2xl bg-white
                       transition-all duration-300"
          >

            <motion.img
              src={import.meta.env.VITE_BACKEND_ASSET_URL + d.photo}
              alt={d.name}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-full sm:w-44 md:w-52 h-40 md:h-40
                         object-cover rounded-xl shadow-md"
            />

            <div className="flex-1 space-y-2 px-5 mt-3 sm:space-y-3">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold
                             text-black hover:text-orange-500 break-words">
                {d.name}
              </h3>

              <p className="text-gray-800 text-xs sm:text-base leading-relaxed">
                {d.description}
              </p>

              {/* Category title */}
              <p className="text-xs sm:text-sm text-blue-500 font-medium">
                {d.category?.title}
              </p>

              <Link
                to={`/service/${d._id}`}
                className="inline-block text-blue-500 hover:underline font-medium text-sm sm:text-base"
              >
                Details →
              </Link>

              <p className="text-[10px] sm:text-sm text-gray-400 italic mt-1 sm:mt-2">
                {new Date(d.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}

        {!loading && data.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No services found
          </p>
        )}
      </div>
    </section>
  )
}

export default Service
