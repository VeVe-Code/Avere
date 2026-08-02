import axios from '../helper/axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Linkify from 'react-linkify'

function PositionDetail() {
  const { id } = useParams()
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPosition = async () => {
    try {
      setLoading(true)
      let res = await axios.get(`/api/publicposition/${id}`)
      setPosition(res.data)
    } catch (err) {
      console.error(err)
      setPosition(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosition()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-slate-300 text-sm">Position not found</p>
      </div>
    )
  }

  // ✅ Split lines
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
        <h1 key={index} className="text-2xl md:text-3xl font-bold text-white">
          {text}
        </h1>
      )
    }

    // H1
    if (text.startsWith("# ")) {
      return (
        <h1 key={index} className="text-3xl font-bold text-white">
          {text.slice(2)}
        </h1>
      )
    }

    // H2
    if (text.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-semibold text-slate-200">
          {text.slice(3)}
        </h2>
      )
    }

    // H3
    if (text.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold text-slate-300">
          {text.slice(4)}
        </h3>
      )
    }

    // Step 1: manual bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g)

    return (
      <p key={index} className="text-slate-300 leading-relaxed">
        {parts.map((part, i) => {
          // ✅ Manual bold
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-bold text-white">
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
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden"
      >
        {/* Content */}
        <div className="p-8 md:p-12 space-y-6 min-w-0 max-w-full overflow-hidden break-words">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {position.title}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed">
            {position.description}
          </p>

          {position.detail && (
            <div className="border-t border-slate-700 pt-6 space-y-3">
              <h3 className="text-xl font-semibold text-slate-200">
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
                    className="text-blue-400 underline hover:text-blue-300"
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
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-700">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Back to Positions
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default PositionDetail
