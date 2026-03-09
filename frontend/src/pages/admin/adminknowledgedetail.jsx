import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

function ServiceDetail() {
  let { id } = useParams()
  let [data, setData] = useState(null)

  useEffect(() => {
    const resdata = async () => {
      let res = await axios.get('/api/knowledge/' + id)
      setData(res.data)
    }
    resdata()
  }, [id])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-gray-500"
        >
          Loading...
        </motion.h1>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 py-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="h-[320px] md:h-[420px] overflow-hidden"
        >
          <img
            src={import.meta.env.VITE_BACKEND_ASSET_URL + data.photo}
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            {data.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            {data.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t pt-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              About this knowledge
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {data.about}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default ServiceDetail
