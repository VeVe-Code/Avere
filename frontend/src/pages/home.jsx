import UpcomingEvents from "../components/Upcomingevents";
import axios from "../helper/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SEO from "../components/SEO";
import assetUrl from '../helper/assetUrl'
import { formatCatalogDate } from '../helper/displayDate.js'
import { ArrowUpRight, Cloud, Shield, Wifi, Headphones, Newspaper } from 'lucide-react'

function Home({title,description,link}) {
  const FALLBACK_IMAGES = ["/hero-fallback.png"];
  const DEFAULT_SLIDE_SEC = 7;

  const clampSlideSec = (value) => {
    let n = Number(value)
    if (!Number.isFinite(n)) return DEFAULT_SLIDE_SEC
    let i = Math.round(n)
    if (i < 5 || i > 10) return DEFAULT_SLIDE_SEC
    return i
  }

  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [slideSeconds, setSlideSeconds] = useState([DEFAULT_SLIDE_SEC]);
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  let [data, setData] = useState([])
  let [position, setPosition] = useState([])
  let [newsLoading, setNewsLoading] = useState(true)
  let [positionLoading, setPositionLoading] = useState(true)

  const slideMs =
    (slideSeconds[current] ?? DEFAULT_SLIDE_SEC) * 1000

  useEffect(() => {
    let fetchSlides = async () => {
      try {
        let res = await axios.get('/api/publicheroslides')
        let slides = Array.isArray(res.data?.data) ? res.data.data : []
        let urls = slides
          .map((s) => assetUrl(s.photo))
          .filter(Boolean)
        if (urls.length) {
          setImages(urls)
          setSlideSeconds(
            slides
              .filter((s) => assetUrl(s.photo))
              .map((s) => clampSlideSec(s.durationSeconds))
          )
        }
      } catch {
        // keep fallback photos if API is empty / down
      }
    }
    fetchSlides()
  }, [])

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (!images.length) return
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setProgressKey((k) => k + 1);
    }, slideMs);
    return () => clearTimeout(timeout);
  }, [images.length, current, slideMs]);

  useEffect(() => {
    setCurrent(0);
    setProgressKey((k) => k + 1);
  }, [images]);

  const goToSlide = (i) => {
    setCurrent(i);
    setProgressKey((k) => k + 1);
  };


 useEffect(()=>{

    let resdata = async() =>{
      try {
        setNewsLoading(true)
        let res = await axios.get('/api/publicknowledge')
        setData(res.data.data)
      } catch (err) {
        console.error(err)
        setData([])
      } finally {
        setNewsLoading(false)
      }
    }

    let resPoistion = async() =>{
      try {
        setPositionLoading(true)
        let res = await axios.get('/api/publicposition')
        setPosition(Array.isArray(res.data) ? res.data : res.data?.data || [])
      } catch (err) {
        console.error(err)
        setPosition([])
      } finally {
        setPositionLoading(false)
      }
    }

    resPoistion()
    resdata()

  },[])

  return (
<>
   <div
      className="relative w-full mt-[0.5cm] h-[78vh] md:h-[92vh] lg:min-h-[100svh] overflow-hidden"
    >
   <SEO 
  title="Avere | IT & Network Solutions Thailand"
  description="Avere provides professional IT systems integration, network infrastructure, and security solutions across Thailand."
  href="https://www.avere.example.com/"
/>

      {/* Crossfade + Ken Burns — slight blur softens text baked into photos */}
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden={i !== current}
            initial={false}
            animate={
              i === current
                ? { opacity: 1, scale: [1.04, 1.12] }
                : { opacity: 0, scale: 1.06 }
            }
            transition={
              i === current
                ? {
                    opacity: { duration: 1.35, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: slideMs / 1000, ease: 'linear' },
                  }
                : { opacity: { duration: 1.35, ease: [0.22, 1, 0.36, 1] } }
            }
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform
              brightness-[0.88]"
          />
        ))}
      </div>

      {/* Soft wash — keep photo visible */}
      <div className="absolute inset-0 bg-slate-950/22" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(2,6,23,0.28)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/45 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl px-6 py-7 sm:px-9 sm:py-8
            rounded-2xl
            bg-white/[0.03] backdrop-blur-[2px]
            ring-1 ring-white/10
            shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-blue-300">
            A World Class Outsourcing
          </p>

          <h1 className="mt-3 sm:mt-4 text-white text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none">
            AVERE RICCO
          </h1>

          <p className="mt-4 sm:mt-5 mx-auto max-w-md text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
            outsourcing services is designed to help our clients to achieve cost savings in all areas
          </p>

          <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/service"
              className="group inline-flex items-center gap-2 rounded-xl
                bg-white text-slate-900 px-5 sm:px-6 py-3
                text-sm sm:text-[15px] font-semibold
                shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)]
                transition hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore services
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              to="/contactus"
              className="inline-flex items-center rounded-xl
                px-5 sm:px-6 py-3 text-sm sm:text-[15px] font-semibold text-white
                ring-1 ring-white/45 bg-white/5
                hover:bg-white/12 transition"
            >
              Contact us
            </Link>
          </div>
        </motion.div>

        {/* Loop progress + dots */}
        <div className="absolute bottom-7 sm:bottom-9 left-0 right-0 flex flex-col items-center gap-3 px-6">
          <div className="h-[2px] w-40 sm:w-52 overflow-hidden rounded-full bg-white/20">
            <motion.div
              key={progressKey}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: slideMs / 1000, ease: 'linear' }}
              className="h-full origin-left bg-gradient-to-r from-blue-400 to-cyan-300"
            />
          </div>
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === i
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/35 hover:bg-white/65'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    
  <section className="relative overflow-hidden px-6 sm:px-12 lg:px-28 xl:px-40 pt-4 pb-6 sm:pt-5 sm:pb-7 lg:pt-6 lg:pb-8 bg-white dark:bg-[#060b11]">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0
        bg-[radial-gradient(ellipse_at_8%_0%,rgba(37,99,235,0.06),transparent_40%),radial-gradient(ellipse_at_92%_8%,rgba(99,102,241,0.06),transparent_36%)]
        dark:bg-none"
    />

    <div className="relative max-w-[1320px] mx-auto">
      <div className="mb-4 lg:mb-5 grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-5 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center min-w-0"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-[3px] w-9 rounded-full bg-blue-600 dark:bg-blue-400" />
            <p className="text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-blue-600 dark:text-blue-400">
              What we offer
            </p>
          </div>
          <h2 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[3.875rem] xl:text-[4.125rem] font-bold tracking-tight leading-[1.04]">
            <span className="text-slate-900 dark:text-white">Solutions </span>
            <span className="text-blue-600 dark:text-blue-400">&amp; Services</span>
          </h2>
          <p className="mt-3.5 sm:mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md lg:max-w-[28rem]">
            End-to-end IT capabilities — systems, security, networking, and managed services — built for clarity and reliability.
          </p>
        </motion.div>

        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center lg:justify-end w-full min-w-0"
        >
          <img
            src="/solutions-hub.png?v=43"
            alt=""
            width={666}
            height={375}
            className="block dark:hidden w-full max-w-[500px] sm:max-w-[560px] lg:max-w-full xl:max-w-[640px] h-auto object-contain object-center lg:object-right select-none pointer-events-none"
            draggable={false}
          />
          <img
            src="/solutions-hub-dark.png?v=14"
            alt=""
            width={1016}
            height={496}
            className="hidden dark:block w-full max-w-[500px] sm:max-w-[560px] lg:max-w-full xl:max-w-[640px] h-auto object-contain object-center lg:object-right select-none pointer-events-none"
            draggable={false}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {[
          {
            to: '/system',
            icon: Cloud,
            title: 'SYSTEM',
            delay: 0.08,
            tags: ['Enterprise Cloud', 'Desktop', 'Backup'],
            desc: 'Professional solutions for Enterprise Cloud, Desktop Management, Collaboration, and Backup — delivering reliable results for clients and their customers.',
            accent: {
              bar: 'from-blue-600 to-sky-400',
              iconBg: 'bg-blue-50 text-blue-600 ring-blue-100/80 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/20',
              title: 'text-blue-700 dark:text-blue-300',
              arrow: 'text-blue-600 bg-white ring-blue-200 dark:text-blue-300 dark:bg-blue-500/10 dark:ring-blue-400/25 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600',
              watermark: 'text-blue-500/[0.08] dark:text-blue-300/10',
              tag: 'bg-slate-100 text-slate-600 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10',
            },
          },
          {
            to: '/security',
            icon: Shield,
            title: 'SECURITY',
            delay: 0.14,
            tags: ['APT Defense', 'PAM', 'WAF'],
            desc: 'Protect against Advanced Persistent Threats, Privileged Account risk, and web attacks with solutions that keep operations uninterrupted.',
            accent: {
              bar: 'from-indigo-500 to-violet-500',
              iconBg: 'bg-indigo-50 text-indigo-600 ring-indigo-100/80 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/20',
              title: 'text-indigo-700 dark:text-violet-300',
              arrow: 'text-indigo-600 bg-white ring-indigo-200 dark:text-violet-300 dark:bg-violet-500/10 dark:ring-violet-400/25 group-hover:bg-violet-600 group-hover:text-white group-hover:ring-violet-600',
              watermark: 'text-indigo-500/[0.08] dark:text-violet-300/10',
              tag: 'bg-slate-100 text-slate-600 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10',
            },
          },
          {
            to: '/network',
            icon: Wifi,
            title: 'NETWORK',
            delay: 0.2,
            tags: ['Access Point', 'Switch', 'Gateway'],
            desc: 'Innovative network products — Access Points, Switches, Controllers, and Secure Web Gateway — to optimize your infrastructure.',
            accent: {
              bar: 'from-sky-500 to-cyan-400',
              iconBg: 'bg-cyan-50 text-cyan-700 ring-cyan-100/80 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-400/20',
              title: 'text-cyan-800 dark:text-cyan-300',
              arrow: 'text-cyan-700 bg-white ring-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/10 dark:ring-cyan-400/25 group-hover:bg-cyan-600 group-hover:text-white group-hover:ring-cyan-600',
              watermark: 'text-cyan-500/[0.08] dark:text-cyan-300/10',
              tag: 'bg-slate-100 text-slate-600 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10',
            },
          },
          {
            to: '/service',
            icon: Headphones,
            title: 'SERVICE',
            delay: 0.26,
            tags: ['Support', 'Managed IT'],
            desc: 'A wide range of IT services tailored to your requirements — from day-to-day support to longer-term operational needs.',
            accent: {
              bar: 'from-violet-500 to-fuchsia-400',
              iconBg: 'bg-violet-50 text-violet-600 ring-violet-100/80 dark:bg-fuchsia-500/15 dark:text-fuchsia-300 dark:ring-fuchsia-400/20',
              title: 'text-violet-700 dark:text-fuchsia-300',
              arrow: 'text-violet-600 bg-white ring-violet-200 dark:text-fuchsia-300 dark:bg-fuchsia-500/10 dark:ring-fuchsia-400/25 group-hover:bg-violet-600 group-hover:text-white group-hover:ring-violet-600',
              watermark: 'text-violet-500/[0.08] dark:text-fuchsia-300/10',
              tag: 'bg-slate-100 text-slate-600 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10',
            },
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.to} to={item.to} className="group block h-full">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-7
                  bg-white dark:bg-slate-900/90
                  border border-slate-200/70 dark:border-white/[0.08]
                  shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_18px_40px_-24px_rgba(37,99,235,0.3)]"
              >
                <span
                  aria-hidden
                  className={`absolute left-6 sm:left-7 top-0 h-[3px] w-16 rounded-b-full bg-gradient-to-r ${item.accent.bar}`}
                />

                <Icon
                  aria-hidden
                  size={130}
                  strokeWidth={1}
                  className={`pointer-events-none absolute -right-1 bottom-0 ${item.accent.watermark}
                    transition-transform duration-500 group-hover:scale-[1.03]`}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`inline-flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ring-1
                      transition-transform duration-300 group-hover:scale-105 ${item.accent.iconBg}`}>
                      <Icon size={20} strokeWidth={1.75} className="sm:hidden" />
                      <Icon size={22} strokeWidth={1.75} className="hidden sm:block" />
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold tracking-tight ${item.accent.title}`}>
                      {item.title}
                    </h3>
                  </div>
                  <span className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full ring-1
                    transition-all duration-300
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${item.accent.arrow}`}>
                    <ArrowUpRight size={16} className="sm:hidden" />
                    <ArrowUpRight size={17} className="hidden sm:block" />
                  </span>
                </div>

                <p className="relative mt-3.5 sm:mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>

                <div className="relative mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium ring-1 ${item.accent.tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  </section>


<UpcomingEvents></UpcomingEvents>
<section className="relative overflow-hidden bg-gray-50 dark:bg-slate-950 px-6 sm:px-12 lg:px-28 xl:px-40 py-16 sm:py-20">
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0
      bg-[radial-gradient(ellipse_at_15%_20%,rgba(37,99,235,0.08),transparent_45%)]
      dark:bg-[radial-gradient(ellipse_at_15%_20%,rgba(37,99,235,0.16),transparent_45%)]"
  />

  <div className="relative max-w-[1400px] mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div className="max-w-xl">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-blue-600 dark:text-blue-400 mb-3">
          Latest insights
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Knowledge Update
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Product notes, industry updates, and stories from the Avere team.
        </p>
      </div>

      {!newsLoading && Array.isArray(data) && data.length > 0 && (
        <Link
          to="/knowledge"
          className="group inline-flex items-center gap-2 self-start sm:self-auto
            text-sm font-semibold text-slate-700 dark:text-slate-200
            hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          See all knowledge
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full
            bg-slate-900 text-white dark:bg-white dark:text-slate-900
            transition-transform group-hover:translate-x-0.5">
            <ArrowUpRight size={16} />
          </span>
        </Link>
      )}
    </motion.div>

    {newsLoading && (
      <div className="flex justify-center py-16">
        <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )}

    {!newsLoading && (!Array.isArray(data) || data.length === 0) && (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[1.75rem] px-7 py-10 sm:px-10 sm:py-12
          bg-white dark:bg-slate-900
          ring-1 ring-slate-200/80 dark:ring-white/10
          shadow-[0_24px_50px_-30px_rgba(15,23,42,0.4)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full
            bg-blue-500/15 blur-3xl"
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
            bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300
            ring-1 ring-blue-100 dark:ring-blue-400/20">
            <Newspaper size={26} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">
              Knowledge
            </p>
            <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fresh stories are being prepared
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              Product notes and industry updates will appear here as soon as they publish.
            </p>
          </div>
          <Link
            to="/knowledge"
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto
              rounded-xl bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-semibold
              text-white dark:text-slate-900
              transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Visit knowledge
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </motion.div>
    )}

    {!newsLoading && Array.isArray(data) && data.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {data.slice(0, 4).map((item, index) => (
          <Link
            key={item._id || item.id}
            to={`/knowledge/${item.id || item._id}`}
            className="group block h-full"
          >
            <motion.article
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.08,
              }}
              className="relative h-full overflow-hidden rounded-2xl p-4 sm:p-5
                flex gap-4
                bg-white/90 dark:bg-slate-900/80
                border border-slate-200/80 dark:border-white/10
                shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-blue-300/70 dark:hover:border-blue-400/35
                hover:shadow-[0_22px_48px_-28px_rgba(37,99,235,0.4)]"
            >
              <div className="relative shrink-0 overflow-hidden rounded-xl
                w-28 h-24 sm:w-32 sm:h-28
                ring-1 ring-black/5 dark:ring-white/10 bg-slate-100 dark:bg-slate-800">
                <img
                  src={assetUrl(item.photo)}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500
                    group-hover:scale-105"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white leading-snug
                    line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-300
                    transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                    {formatCatalogDate(item)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium
                    text-slate-600 dark:text-slate-300
                    group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Read more
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    )}
  </div>
</section>


<section className="relative py-16 sm:py-20 overflow-hidden bg-slate-100 dark:bg-slate-950">
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-100
      bg-[radial-gradient(ellipse_at_20%_20%,rgba(37,99,235,0.12),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(14,165,233,0.08),transparent_45%)]
      dark:bg-[radial-gradient(ellipse_at_20%_20%,rgba(37,99,235,0.18),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(56,189,248,0.08),transparent_45%)]"
  />

  <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">

    {/* Left visual — show full banner (no crop); text is baked into the image */}
    <motion.div
      initial={{ opacity: 0, x: -36 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="group relative w-full self-center rounded-[28px] overflow-hidden
        ring-1 ring-black/5 dark:ring-white/10 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]
        bg-white"
    >
      <Link to="/position" className="block" aria-label="View open positions">
        <motion.img
          src="/careers-join.png"
          alt="Join Avere Ricco — we are looking for talented people"
          className="block w-full h-auto transition duration-500 group-hover:scale-[1.01]"
          initial={{ opacity: 0.92 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </Link>
    </motion.div>

    {/* Right list */}
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-700 dark:text-blue-400 mb-2">
          Open roles
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          We are Hiring
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Explore current openings and grow with Avere.
        </p>
      </div>

      <div className="flex-grow">
        {positionLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : Array.isArray(position) && position.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {position.slice(0, 4).map((item, index) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -3 }}
              >
                <Link
                  to={`/position/${item._id || item.id}`}
                  className="block h-full rounded-2xl border border-slate-200/90 dark:border-slate-800
                    bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5
                    shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)]
                    transition hover:border-blue-300 dark:hover:border-blue-500/40
                    hover:shadow-[0_16px_40px_-24px_rgba(37,99,235,0.35)]"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                    View details
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700
              bg-white/70 dark:bg-slate-900/50 px-6 py-10 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full
              bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-lg">
              ✦
            </div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              No open roles right now
            </p>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              New opportunities appear here. Check back soon or browse the careers page.
            </p>
            <Link
              to="/position"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100
                text-white dark:text-slate-900 px-5 py-2.5 text-sm font-semibold
                hover:opacity-90 transition"
            >
              Browse careers
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        )}
      </div>

      {!positionLoading && Array.isArray(position) && position.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="mt-8"
        >
          <Link to="/position" className="group inline-flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100">
            <span className="w-10 h-10 flex items-center justify-center rounded-full
              bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900
              transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500">
              <motion.span
                className="inline-block"
                whileHover={{ x: 2 }}
              >
                →
              </motion.span>
            </span>
            <span className="tracking-wide">SEE MORE</span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  </div>
</section>

{/* OUR STORY SECTION */}
<section className="relative bg-white dark:bg-slate-950 py-20 sm:py-28 overflow-hidden">
  {/* Quiet atmosphere only — no crossing lines */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0
      bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),transparent_45%)]
      dark:bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_45%)]"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 bottom-0 h-32
      bg-gradient-to-t from-slate-100/80 to-transparent
      dark:from-slate-900/80 dark:to-transparent"
  />

  <div className="relative max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

      {/* Images — stacked + scroll / hover motion */}
      <div className="lg:col-span-6">
        <div className="flex flex-col gap-5 sm:gap-6">
          {[
            { src: '/about1.png', alt: 'Avere Ricco office reception', delay: 0 },
            { src: '/about2.png', alt: 'Avere Ricco team outing', delay: 0.18 },
          ].map((img) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, x: -48, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.75, delay: img.delay, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative w-full h-56 sm:h-64 rounded-[28px] sm:rounded-[40px] overflow-hidden
                shadow-[0_20px_48px_-28px_rgba(15,23,42,0.45)]
                will-change-transform"
            >
              <motion.img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.15, delay: img.delay, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Copy — staggered reveal */}
      <div className="lg:col-span-6 lg:pl-4 space-y-6">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-3"
          >
            About Avere
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Our Story
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 h-0.5 w-14 origin-left rounded-full bg-blue-600 dark:bg-blue-400"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}
          className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] sm:text-base max-w-xl"
        >
          Founded on February 29, 2016, Avere Co., Ltd. is a Bangkok-based technology company providing
          professional IT services and cloud solutions to help organizations accelerate their digital
          transformation. With a team of skilled engineers and developers, Avere offers end-to-end services
          ranging from software development and cloud infrastructure management to DevOps automation
          and IT outsourcing. We are committed to delivering high-quality solutions with agility, flexibility, and
          continuous innovation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-3 sm:gap-3.5 group pt-1"
          >
            <span className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-slate-900 dark:bg-white
              text-white dark:text-slate-900 flex items-center justify-center
              transition duration-300 group-hover:bg-blue-600 group-hover:text-white
              dark:group-hover:bg-blue-500 shadow-lg shadow-slate-900/10">
              <motion.span
                aria-hidden
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </span>
            <span className="relative inline-flex flex-col pb-1.5">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase
                text-slate-900 dark:text-slate-100
                group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                Read more
              </span>
              <span aria-hidden className="pointer-events-none absolute left-0 bottom-0 h-px w-full overflow-hidden">
                <span
                  className="block h-full w-full origin-left scale-x-[0.28]
                    bg-slate-300 dark:bg-slate-600
                    transition-transform duration-500 ease-out
                    group-hover:scale-x-100
                    group-hover:bg-blue-600 dark:group-hover:bg-blue-400"
                />
              </span>
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
</section>

</>
  );
}

export default Home;
