import axios from '../helper/axios'
import assetUrl from '../helper/assetUrl'
import React, { useEffect, useMemo, useState } from 'react'

function PartnersMarquee() {
  const [partners, setPartners] = useState([])

  useEffect(() => {
    let fetchPartners = async () => {
      try {
        let res = await axios.get('/api/publicpartners')
        let list = Array.isArray(res.data?.data) ? res.data.data : []
        setPartners(list.filter((p) => p.photo))
      } catch {
        setPartners([])
      }
    }
    fetchPartners()
  }, [])

  // Build a dense unit, then double it so translateX(-50%) loops seamlessly
  const loop = useMemo(() => {
    if (!partners.length) return []
    let unit = [...partners]
    while (unit.length < 6) {
      unit = unit.concat(partners)
    }
    return unit.concat(unit)
  }, [partners])

  if (!partners.length) return null

  return (
    <section
      className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#050a14]"
      aria-label="Our partners"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-slate-800 dark:text-slate-100">
          Our Partners
        </h2>
      </div>

      <div className="relative overflow-hidden pb-10">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-14
            bg-gradient-to-r from-white dark:from-[#050a14] to-transparent"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-14
            bg-gradient-to-l from-white dark:from-[#050a14] to-transparent"
        />

        <div className="avere-partners-marquee flex w-max items-stretch gap-3 sm:gap-3.5 px-3 sm:px-4">
          {loop.map((p, i) => (
            <article
              key={`${p._id}-${i}`}
              className="flex h-[220px] sm:h-[240px] w-[200px] sm:w-[230px] shrink-0 flex-col
                overflow-hidden rounded-lg border border-slate-200 dark:border-white/10
                bg-white dark:bg-slate-900
                shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none"
            >
              <div className="flex flex-1 items-center justify-center px-6 py-5">
                <img
                  src={assetUrl(p.photo)}
                  alt={p.name || 'Partner'}
                  className="max-h-[120px] sm:max-h-[140px] max-w-full object-contain"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <div
                className="shrink-0 h-9 sm:h-10 flex items-center justify-center px-3
                  text-[11px] sm:text-xs font-semibold tracking-wide
                  text-slate-700 dark:text-slate-200
                  bg-[linear-gradient(90deg,#d4d4d8_0%,#f5e6c8_35%,#e7e5e4_70%,#d4d4d8_100%)]
                  dark:bg-[linear-gradient(90deg,#1e293b_0%,#334155_35%,#292524_70%,#1e293b_100%)]
                  border-t border-slate-200/90 dark:border-white/10"
              >
                <span className="line-clamp-1">
                  {p.name?.trim() || 'Partner'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersMarquee
