import axios from '../helper/axios'
import React, { useEffect, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

function previewText(text, max = 20) {
  let t = (text || '').trim()
  if (t.length <= max) return t
  return t.slice(0, max) + '...'
}

function Position() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let fetchPositions = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/publicposition')
        setPositions(Array.isArray(res.data) ? res.data : res.data?.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPositions()
  }, [])

  const filtered = positions.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    )
  })

  return (
    <section className="min-h-screen relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#f8fafc_45%,_#f1f5f9_100%)] dark:bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_45%,_#020617_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.15] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative z-10 py-14 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-24">
        <SEO title="Open Positions - Avere" description="Join the Avere team" />

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-700 dark:text-blue-400 mb-2">
                Careers
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Open Positions
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Join our team and make an impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="w-full sm:w-72"
            >
              <label className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3.5 py-2.5 shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/15">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search positions..."
                  className="w-full outline-none bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
              </label>
            </motion.div>
          </div>

          {loading && (
            <div className="flex justify-center py-24">
              <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-slate-400 dark:text-slate-500 py-24 text-sm">
              No positions available at the moment
            </p>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-3 md:space-y-5">
              {filtered.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <Link
                    to={`/position/${p._id}`}
                    className="group flex gap-3.5 sm:gap-5 md:gap-7 rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 transition duration-300 hover:border-blue-200 dark:hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-[0_12px_40px_-20px_rgba(37,99,235,0.35)]"
                  >
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-[15px] sm:text-lg md:text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </h2>
                        {p.createdAt && (
                          <time className="shrink-0 text-[11px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-500 tabular-nums pt-1">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </time>
                        )}
                      </div>

                      <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 break-all">
                          {previewText(p.description, 40)}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm md:text-base font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          Detail
                          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Position
