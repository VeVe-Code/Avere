import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import axios from '../helper/axios'
import assetUrl from '../helper/assetUrl'

function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setResults([])
    setSearched(false)
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    if (timerRef.current) clearTimeout(timerRef.current)

    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      setSearched(false)
      return
    }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await axios.get('/api/publicsearch', { params: { q, limit: 6 } })
        setResults(Array.isArray(res.data?.results) ? res.data.results : [])
        setSearched(true)
      } catch (err) {
        console.error(err)
        setResults([])
        setSearched(true)
      } finally {
        setLoading(false)
      }
    }, 280)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, open])

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for? (Esc to close)"
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 outline-none"
              />
              {loading ? (
                <Loader2 size={16} className="shrink-0 text-slate-400 animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {!query.trim() && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  Search services, network, systems, security, news, events & jobs
                </p>
              )}

              {query.trim() && searched && !loading && results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No results for “{query.trim()}”
                </p>
              )}

              {results.length > 0 && (
                <ul className="py-2">
                  {results.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition"
                      >
                        {item.photo ? (
                          <img
                            src={assetUrl(item.photo)}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-[10px] font-semibold uppercase">
                            {item.label?.slice(0, 3)}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            <span className="text-blue-400">{item.label}</span>
                            {item.description ? ` · ${item.description}` : ''}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal
