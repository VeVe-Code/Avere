import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';

function admincontactdetail() {
  let { id } = useParams()
  let [data, setData] = useState(null)

  useEffect(() => {
    const resdata = async () => {
      let res = await axios.get('/api/contactus/' + id)
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
   <>
    <section className="min-h-screen bg-gray-50 py-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Image */}
       

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
            {data.email}
          </motion.p>
           <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            {data.phno}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t  pt-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              About Msg
            </h3>
            <p className="text-gray-600 leading-relaxed">
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
