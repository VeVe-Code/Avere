import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';

function admincontactdetail() {
  let { id } = useParams()
  let [data, setData] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    const resdata = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/contactus/' + id)
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
   <>
    <section className="min-h-screen bg-gray-50 dark:bg-slate-950 py-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Image */}
       

        {/* Content */}
        <div className="p-8 md:p-12 space-y-6 min-w-0 max-w-full overflow-hidden break-words">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white break-words min-w-0"
          >
            {data.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed break-words"
          >
            {data.email}
          </motion.p>
           <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed break-words"
          >
            {data.phno}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t  pt-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">
              About Msg
            </h3>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              {data.msg}
            </p>
          </motion.div>
        </div>
    
      </motion.div>
          <Link to="/admin/admincontactus">
           <div className='shadow-2xl bg-amber-400 px-3 py-2 w-15 rounded-full mt-20'>
<IoMdArrowRoundBack className='text-3xl' />

        </div></Link>
    </section>
   </>
  )
}

export default admincontactdetail
