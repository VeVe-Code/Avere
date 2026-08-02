import axios from '../helper/axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import assetUrl from '../helper/assetUrl'
import SaveButton from '../components/SaveButton'
import SEO from '../components/SEO'
import RichTextContent from '../components/RichTextContent'

function KnowledgeDetail() {
  let { id } = useParams()
  let [data, setData] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    let fetchData = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/publicknowledge/' + id)
        setData(res.data)
      } catch (err) {
        console.error(err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
    <article className="min-h-screen relative bg-white dark:bg-slate-950">
      <SEO
        title={`${data.title || 'News'} - Avere`}
        description={data.description || 'Avere news article'}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#f8fafc_50%,_#f1f5f9_100%)] dark:bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_50%,_#020617_100%)]" />

      <div className="relative z-10 pb-16 sm:pb-20 pt-6 sm:pt-10">
        {data.photo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mb-6 sm:mb-8"
          >
            <div className="mx-auto max-w-5xl px-3 sm:px-6">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 ring-1 ring-slate-200/70 dark:ring-slate-700 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)]">
                <img
                  src={assetUrl(data.photo)}
                  alt={data.title}
                  className="block w-full h-auto max-h-[75vh] object-contain mx-auto"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] overflow-hidden"
          >
            <div className="px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-10 space-y-8 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/knowledge"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to News
                </Link>
                <SaveButton type="knowledge" id={id} />
              </div>

              <header className="space-y-4 min-w-0 border-b border-slate-100 dark:border-slate-800 pb-8">
                {data.createdAt && (
                  <time className="text-xs font-medium tracking-wide uppercase text-blue-700 dark:text-blue-400">
                    {new Date(data.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15] break-words">
                  {data.title}
                </h1>
                {data.description && (
                  <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                    {data.description}
                  </p>
                )}
              </header>

              <section className="space-y-4 min-w-0">
                <RichTextContent value={data.about} />
              </section>

              {data.sections && data.sections.length > 0 && (
                <div className="space-y-0">
                  {data.sections.map((sec, idx) => {
                    let body = sec.detail || sec.description || ''
                    return (
                      <motion.section
                        key={idx}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.45 }}
                        className="border-t border-slate-100 dark:border-slate-800 pt-10 mt-10 space-y-5 min-w-0"
                      >
                        {sec.photo && (
                          <div className="overflow-hidden rounded-xl bg-slate-100/80 dark:bg-slate-800/80 ring-1 ring-slate-200/70 dark:ring-slate-700">
                            <img
                              src={assetUrl(sec.photo)}
                              className="block w-full h-auto max-h-[70vh] object-contain mx-auto"
                              alt={sec.title || `block-${idx + 1}`}
                            />
                          </div>
                        )}
                        <div className="space-y-3 min-w-0">
                          {sec.title && (
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 break-words">
                              {sec.title}
                            </h2>
                          )}
                          {body && <RichTextContent value={body} />}
                        </div>
                      </motion.section>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .rich-content h1 { font-size: 1.75rem; font-weight: 600; color: #0f172a; margin: 0.75rem 0 0.5rem; }
        .rich-content h2 { font-size: 1.5rem; font-weight: 600; color: #0f172a; margin: 0.75rem 0 0.5rem; }
        .rich-content h3 { font-size: 1.25rem; font-weight: 600; color: #1e293b; margin: 0.5rem 0 0.35rem; }
        .rich-content p { margin: 0.5rem 0; }
        .rich-content ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
        .rich-content ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
        .rich-content a { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
        .rich-content blockquote { border-left: 3px solid #cbd5e1; padding-left: 0.75rem; color: #64748b; margin: 0.75rem 0; }
        .rich-content code { background: #f1f5f9; border-radius: 0.25rem; padding: 0.1rem 0.3rem; font-size: 0.875em; }
        .rich-content pre { background: #0f172a; color: #e2e8f0; border-radius: 0.5rem; padding: 0.75rem 1rem; overflow-x: auto; margin: 0.75rem 0; }
        .rich-content pre code { background: transparent; color: inherit; padding: 0; }
        .rich-content strong { font-weight: 600; color: #0f172a; }
        .dark .rich-content h1, .dark .rich-content h2, .dark .rich-content strong { color: #f1f5f9; }
        .dark .rich-content h3 { color: #e2e8f0; }
        .dark .rich-content blockquote { border-left-color: #475569; color: #94a3b8; }
        .dark .rich-content code { background: #1e293b; color: #e2e8f0; }
        .dark .rich-content a { color: #60a5fa; }
      `}</style>
    </article>
  )
}

export default KnowledgeDetail
