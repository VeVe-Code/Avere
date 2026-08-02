import axios from '../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import assetUrl from '../helper/assetUrl'
import SaveButton from '../components/SaveButton'
import RichTextContent from '../components/RichTextContent'

function ServiceDetail() {
  let { id } = useParams()
  let [data, setData] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    const resdata = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/publicnetwork/' + id)
        setData(res.data)
      } catch (err) {
        console.error(err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    resdata()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Not found</p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-slate-950 py-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-transparent dark:border-slate-800"
      >
        {/* Image */}
        <div className="h-[320px] md:h-[420px] overflow-hidden">
          <img
            src={assetUrl(data.photo)}
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-6 min-w-0 max-w-full overflow-hidden break-words">
          <div className="flex flex-wrap items-start justify-between gap-4 min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 break-all min-w-0 flex-1">
            {data.name || data.title}
          </h1>
          <SaveButton type="network" id={id} />
          </div>

          <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed break-all">
            {data.description}
          </p>

          <div className="border-t dark:border-slate-700 pt-6 space-y-3">
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
