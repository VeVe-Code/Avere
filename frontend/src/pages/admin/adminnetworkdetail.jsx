import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import assetUrl from '../../helper/assetUrl'
import RichTextContent from '../../components/RichTextContent'

function ServiceDetail() {
  let { id } = useParams()
  let [data, setData] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    const resdata = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/network/' + id)
        setData(res.data)
      } catch (err) {
        console.error(err)
      }
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
    <section className="min-h-screen bg-gray-50 dark:bg-slate-950 py-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Image */}
        <div className="pt-[2cm] px-[2cm] h-[calc(320px+2cm)] md:h-[calc(420px+2cm)] overflow-hidden">
          <img
            src={assetUrl(data.photo)}
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-6 min-w-0 max-w-full overflow-hidden break-words">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white break-words min-w-0">
            {data.name}
          </h1>

          <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed break-words">
            {data.description}
          </p>

          <div className="border-t pt-6 space-y-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
              About this Network
            </h3>
            <RichTextContent value={data.about} />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default ServiceDetail
