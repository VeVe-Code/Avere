import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Wrench } from 'lucide-react'
import SEO from '../components/SEO'
import { toTelHref, useContactInfo } from '../contexts/ContactInfoContext'

function Maintenance() {
  const { info } = useContactInfo()
  const telHref = toTelHref(info.phone)

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#050a14] text-slate-100">
      <SEO
        title="Maintenance — Avere Ricco"
        description="Avere Ricco is temporarily offline for server maintenance. Please check back shortly."
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.img
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src="/logo-dark.png?v=5"
          alt="Avere Ricco"
          className="h-14 w-auto object-contain sm:h-16"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-10 w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.55)] backdrop-blur-md sm:p-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            Server maintenance
          </div>

          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_12px_32px_-12px_rgba(37,99,235,0.9)]">
            <Wrench size={22} />
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            We’ll be back soon
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
            Avere Ricco is temporarily offline while we upgrade our servers.
            The full website will return shortly. Thank you for your patience.
          </p>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-1">
            {info.email && (
              <a
                href={`mailto:${info.email}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.06] hover:text-white"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Mail size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">
                    Email
                  </span>
                  <span className="block truncate font-medium">{info.email}</span>
                </span>
              </a>
            )}
            {info.phone && (
              telHref ? (
                <a
                  href={telHref}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                    <Phone size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-500">
                      Phone
                    </span>
                    <span className="block font-medium">{info.phone}</span>
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                    <Phone size={16} />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-slate-500">
                      Phone
                    </span>
                    <span className="block font-medium">{info.phone}</span>
                  </span>
                </div>
              )
            )}
            {info.address && (
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <MapPin size={16} />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">
                    Address
                  </span>
                  <span className="mt-0.5 block whitespace-pre-line font-medium leading-relaxed">
                    {info.address}
                  </span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <p className="mt-8 text-xs tracking-wide text-slate-500">
          {info.companyName || 'AVERE CO., LTD.'}
        </p>
        <Link
          to="/login"
          className="mt-4 text-[11px] text-slate-600 transition hover:text-slate-400"
        >
          Staff login
        </Link>
      </div>
    </div>
  )
}

export default Maintenance
