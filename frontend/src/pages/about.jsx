import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'

const ease = [0.22, 1, 0.36, 1]

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const services = [
  {
    num: '01',
    title: 'Cloud Man-Day Support',
    desc: 'Infrastructure setup, migration, troubleshooting, architecture, monitoring, and performance optimization.',
  },
  {
    num: '02',
    title: 'Software Development',
    desc: 'Custom applications and enterprise software built for productivity and scale.',
  },
  {
    num: '03',
    title: 'Cloud Migration',
    desc: 'Move on-premise systems to AWS, Azure, GCP, or Huawei Cloud with minimal disruption.',
  },
  {
    num: '04',
    title: 'DevOps & Automation',
    desc: 'CI/CD, automated deployment, and reliability engineering across modern toolchains.',
  },
  {
    num: '05',
    title: 'Database Services',
    desc: 'Migration, backup management, and performance tuning for critical data platforms.',
  },
  {
    num: '06',
    title: 'Licensing & Hardware',
    desc: 'Authorized reseller support for enterprise IT solutions and software licensing.',
  },
]

const strengths = [
  { title: 'Rapid response', text: 'Fast, efficient support tailored to each engagement.' },
  { title: 'Specialist talent', text: 'Hands-on experience across enterprise environments.' },
  { title: 'Flexible delivery', text: 'Scalable packages for teams of any size.' },
  { title: 'Long-term care', text: 'Dedicated partnership focused on client success.' },
  { title: 'Security first', text: 'Governance and compliance built into delivery.' },
  { title: 'Always improving', text: 'Agile and DevOps culture of continuous innovation.' },
]

const clouds = ['AWS', 'Azure', 'GCP', 'Huawei Cloud']

const facts = [
  { label: 'Founded', value: '2016' },
  { label: 'Based in', value: 'Bangkok' },
  { label: 'Focus', value: 'Cloud & IT' },
  { label: 'Model', value: 'End-to-end' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <SEO
        title="About Us - Avere"
        description="Avere Co., Ltd. — Bangkok-based IT services and cloud solutions since 2016."
      />

      {/* Full-bleed photo hero */}
      <section className="relative min-h-[88vh] flex items-end">
        <img
          src="/about1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/75 to-[#070b14]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/80 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-blue-300 mb-4"
          >
            About the company
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease }}
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight max-w-2xl"
          >
            Avere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="mt-5 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            Reliable IT services and cloud solutions for organizations accelerating digital transformation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/contactus"
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-6 py-2.5 text-sm font-semibold hover:bg-blue-50 transition"
            >
              Talk to us
              <ArrowRight size={16} />
            </Link>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Read our story
            </a>
          </motion.div>
        </div>
      </section>

      {/* Facts strip */}
      <section className="border-y border-white/10 bg-[#0a101c]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {facts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease }}
            >
              <p className="text-[11px] tracking-[0.2em] uppercase text-slate-500 mb-1">{f.label}</p>
              <p className="text-xl sm:text-2xl font-semibold text-white">{f.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="scroll-mt-24 px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
              Our story
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6 text-white">
              From Bangkok to enterprise-ready delivery
            </h2>
            <div className="space-y-4 text-slate-400 text-[15px] sm:text-base leading-relaxed">
              <p>
                Founded on February 29, 2016, Avere Co., Ltd. is a Bangkok-based technology company
                providing professional IT services and cloud solutions that help organizations
                accelerate digital transformation.
              </p>
              <p>
                With skilled engineers and developers, we deliver end-to-end work across software
                development, cloud infrastructure, DevOps automation, and IT outsourcing — with
                agility, flexibility, and continuous innovation.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
            className="relative"
          >
            <img
              src="/about2.png"
              alt="Avere"
              className="w-full rounded-sm object-cover aspect-[5/6] sm:aspect-[4/5]"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm text-slate-200">Avere Co., Ltd. · Bangkok, Thailand</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business target */}
      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-20 bg-[#0a101c] border-y border-white/10">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
            Purpose
          </p>
          <h2 className="text-3xl font-semibold tracking-tight mb-5">Business target</h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Deliver reliable, innovative IT solutions that improve efficiency, security, and digital
            performance — through high-quality system integration across hardware, software,
            networking, and security.
          </p>
        </motion.div>
      </section>

      {/* Services — numbered list */}
      <section className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12 max-w-xl"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              What we deliver
            </h2>
          </motion.div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {services.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.04, duration: 0.45, ease }}
                className="group grid grid-cols-[auto_1fr] sm:grid-cols-[4.5rem_1fr_1.4fr] gap-4 sm:gap-8 py-7 sm:py-8 items-start"
              >
                <span className="text-sm font-medium text-blue-400/80 tabular-nums pt-1">
                  {s.num}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {s.title}
                </h3>
                <p className="col-span-2 sm:col-span-1 text-sm sm:text-[15px] text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud + vision split */}
      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-24 bg-[#0a101c] border-y border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
              Platforms
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Cloud expertise
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
              Experience across AWS, Microsoft Azure, Google Cloud, and Huawei Cloud — with
              certifications including AWS Solutions Architect, Azure Administrator Associate, and
              Google Cloud Engineer.
            </p>
            <div className="flex flex-wrap gap-2">
              {clouds.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:border-l md:border-white/10 md:pl-16"
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
              Vision
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Where we’re headed
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Empower businesses with reliable, scalable, and secure cloud technology — driving
              innovation and operational excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Strengths */}
      <section className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
              Why Avere
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Key strengths</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {strengths.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease }}
              >
                <div className="mb-3 h-px w-8 bg-blue-500" />
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <motion.div
          className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-md">
              Let’s build your next system together.
            </h2>
            <p className="mt-3 text-slate-400 max-w-md text-sm sm:text-base">
              Share your infrastructure or software goals — we’ll respond with a clear next step.
            </p>
          </div>
          <Link
            to="/contactus"
            className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-semibold transition"
          >
            Contact Avere
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
