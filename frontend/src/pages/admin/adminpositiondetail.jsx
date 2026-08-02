import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io"
import { motion } from 'framer-motion'
import Linkify from 'react-linkify'

function AdminPositionDetail() {
  const { id } = useParams()
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/position/' + id)
        setPosition(res.data)
      } catch (err) {
        console.error(err)
        setPosition(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPosition()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!position) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-500">
          Position not found
        </div>
      </div>
    )
  }

  // ✅ Split lines for detail formatting
  const lines = position.detail
    ? position.detail.split("\n").filter(line => line.trim() !== "")
    : []

  // ✅ Check list
  const isList =
    lines.length > 0 &&
    lines.every(line => line.trim().startsWith("-"))

  // ✅ SMART FORMAT FUNCTION
  const formatText = (line, index) => {
    const text = line.trim()

    // 🔥 AUTO TITLE
    if (index === 0) {
      return (
        <h1 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {text}
        </h1>
      )
    }

    // H1
    if (text.startsWith("# ")) {
      return (
        <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white">
          {text.slice(2)}
        </h1>
      )
    }

    // H2
    if (text.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
          {text.slice(3)}
        </h2>
      )
    }

    // H3
    if (text.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold text-gray-700 dark:text-slate-300">
          {text.slice(4)}
        </h3>
      )
    }

    // Step 1: manual bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g)

    return (
      <p key={index} className="text-gray-600 dark:text-slate-400 leading-relaxed">
        {parts.map((part, i) => {
          // ✅ Manual bold
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-bold text-gray-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            )
          }

          return <span key={i}>{part}</span>
        })}
      </p>
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
        {/* Content */}
        <div className="p-8 md:p-12 space-y-6 min-w-0 max-w-full overflow-hidden break-words">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white break-words min-w-0"
          >
            {position.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed break-all"
          >
            {position.description}
          </motion.p>

          {position.detail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-t pt-6 space-y-3"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">
                Position Details
              </h3>

              {/* ✅ Link + Content */}
              <Linkify
                componentDecorator={(href, text, key) => (
                  <a
                    href={href}
                    key={key}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {text}
                  </a>
                )}
              >
                <div className="space-y-2 min-w-0 break-all overflow-hidden">
                  {isList ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {lines.map((line, idx) => (
                        <li key={idx}>
                          {formatText(line.replace(/^\-\s*/, ""), idx)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    lines.map((line, idx) => formatText(line, idx))
                  )}
                </div>
              </Linkify>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 pt-6 border-t"
          >
            <Link
              to="/admin/adminposition"
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              <IoMdArrowRoundBack className="text-xl" />
              Back to Positions
            </Link>

        
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default AdminPositionDetail
