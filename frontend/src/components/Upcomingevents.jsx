import React, { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "../helper/axios";
import assetUrl from "../helper/assetUrl";

export default function UpcomingEvents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/publicevents`);
        setData(res.data.data || []);
      } catch (err) {
        console.log("API ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 px-6 sm:px-12 lg:px-28 xl:px-40 py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
          bg-[radial-gradient(ellipse_at_80%_0%,rgba(37,99,235,0.08),transparent_45%)]
          dark:bg-[radial-gradient(ellipse_at_80%_0%,rgba(37,99,235,0.16),transparent_45%)]"
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
              On the calendar
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Upcoming Events
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Meetups, demos, and community sessions from the Avere team.
            </p>
          </div>

          {!loading && data.length > 0 && (
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 self-start sm:self-auto
                text-sm font-semibold text-slate-700 dark:text-slate-200
                hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              View all events
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full
                bg-slate-900 text-white dark:bg-white dark:text-slate-900
                transition-transform group-hover:translate-x-0.5">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          )}
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-900/80 animate-pulse
                  border border-slate-200/80 dark:border-white/5"
              />
            ))}
          </div>
        )}

        {!loading && data.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[1.75rem]
              bg-slate-900 text-white
              dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
              shadow-[0_28px_60px_-30px_rgba(15,23,42,0.65)]
              ring-1 ring-white/10"
          >
            {/* Atmosphere */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0
                bg-[radial-gradient(ellipse_at_15%_20%,rgba(59,130,246,0.35),transparent_50%),radial-gradient(ellipse_at_85%_80%,rgba(34,211,238,0.18),transparent_45%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]
                bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
                bg-[size:28px_28px]"
            />
            <motion.div
              aria-hidden
              animate={{ x: [0, 40, 0], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -top-16 right-1/4 h-40 w-40 rounded-full
                bg-blue-400/30 blur-3xl"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 p-7 sm:p-10 lg:p-12 items-center">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.08 }}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold
                    tracking-[0.16em] uppercase
                    bg-white/10 text-blue-200 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-cyan-300 animate-ping opacity-75" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-cyan-300" />
                  </span>
                  Live calendar
                </motion.span>

                <motion.h3
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.14 }}
                  className="mt-5 text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.1]"
                >
                  Something&apos;s brewing
                  <span className="block text-blue-300">for the calendar.</span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-sm sm:text-base text-slate-300/90 max-w-md leading-relaxed"
                >
                  We&apos;re lining up demos, workshops, and community sessions. Fresh dates will land here soon.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.26 }}
                  className="mt-7 flex flex-wrap items-center gap-3"
                >
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 rounded-xl
                      bg-white text-slate-900 px-5 py-2.5 text-sm font-semibold
                      shadow-lg shadow-blue-500/20
                      transition hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Open events
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    to="/knowledge"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
                      text-slate-200 ring-1 ring-white/15
                      hover:bg-white/5 transition"
                  >
                    Read news instead
                  </Link>
                </motion.div>
              </div>

              {/* Preview cards */}
              <div className="relative hidden sm:block min-h-[220px] lg:min-h-[260px]">
                {[
                  { title: 'Product demo day', meta: 'Date TBA', y: 0, delay: 0.18, rotate: -2 },
                  { title: 'Security workshop', meta: 'Invite only', y: 56, delay: 0.26, rotate: 1.5 },
                  { title: 'Partner meetup', meta: 'Coming soon', y: 112, delay: 0.34, rotate: -1 },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: 28, y: card.y + 16 }}
                    whileInView={{ opacity: 1, x: 0, y: card.y }}
                    viewport={{ once: false }}
                    transition={{ delay: card.delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ rotate: card.rotate }}
                    className="absolute left-0 right-4 lg:right-0 max-w-md
                      rounded-2xl border border-white/10 bg-white/8 backdrop-blur-md
                      px-4 py-3.5 shadow-xl shadow-black/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                        bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/20">
                        <CalendarDays size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">{card.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{card.meta}</p>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-cyan-300/80 animate-pulse" />
                    </div>
                    {i === 0 && (
                      <div className="mt-3 h-1.5 w-2/3 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                          animate={{ x: ['-100%', '120%'] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ width: '40%' }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.slice(0, 4).map((item, index) => (
              <Link
                key={item._id || item.id}
                to={`/events/${item._id}`}
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
                    bg-slate-50/90 dark:bg-slate-900/80
                    border border-slate-200/80 dark:border-white/10
                    shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-blue-300/70 dark:hover:border-blue-400/35
                    hover:shadow-[0_22px_48px_-28px_rgba(37,99,235,0.4)]"
                >
                  <div className="relative shrink-0 overflow-hidden rounded-xl
                    w-28 h-24 sm:w-32 sm:h-28
                    ring-1 ring-black/5 dark:ring-white/10">
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
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <CalendarDays size={13} />
                        {new Date(item.createdAt).toLocaleDateString()}
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
  );
}
