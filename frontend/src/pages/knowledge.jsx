import axios from '../helper/axios'
import React, { useEffect, useState } from 'react'
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

function Network() {
  let [data, setData] = useState([])
  let [search, setSearch] = useState('')
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    let fetchData = async () => {
      try {
        setLoading(true)
        let res = await axios.get(`/api/publicknowledge?title=${search}`)
        setData(res.data.data || [])
      } catch (err) {
        console.log("API ERROR:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search])

  return (
    <section className="min-h-screen py-16 px-4 sm:px-6 md:px-10 lg:px-24 bg-gray-50">
<SEO
        title="Knowledge Page - Bislator"
        description="Knowledge page"
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-left"
        >
         News
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
            className="absolute -inset-0.5 bg-linear-to-r from-blue-500 via-blue-500 to-blue-500 rounded-xl blur"
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative flex items-center bg-white rounded-xl shadow-md px-4 py-2"
          >
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-5 px-0 sm:px-4 md:px-10 lg:px-20">

        {/* 🔄 LOADING STATE */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </motion.div>
        )}

        {/* ❌ NO DATA */}
        {!loading && data.length === 0 && (
          <p className="text-center text-gray-400 italic py-20">
            No results found
          </p>
        )}

        {/* ✅ DATA */}
        {!loading && Array.isArray(data) && data.map((d, index) => (
          <motion.div
            key={d._id}
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 shadow-xl py-4 sm:py-6 px-3 sm:px-6 rounded-2xl bg-white"
          >
            <motion.img
              src={import.meta.env.VITE_BACKEND_ASSET_URL + d.photo}
              alt="network"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-full sm:w-44 md:w-52 h-40 object-cover rounded-xl shadow-md"
            />

            <div className="flex-1 space-y-2 px-5 mt-3 sm:space-y-3">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-black hover:text-orange-500">
                {d.title}
              </h3>

              <p className="text-gray-800 text-xs sm:text-base">
                {d.description}
              </p>

                <Link to={`/knowledge/${d._id}`} className="inline-block text-blue-500 hover:underline font-medium text-sm sm:text-base">
                 Details →
              </Link>

              <p className="text-[10px] sm:text-sm text-gray-400 italic">
                {d.createdAt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Network
