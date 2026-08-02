import React from 'react'
import { Link } from 'react-router-dom'
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { Mail, MapPin, Phone } from 'lucide-react'

const solutions = [
  { to: '/system', label: 'Systems' },
  { to: '/service', label: 'Services' },
  { to: '/network', label: 'Network' },
  { to: '/security', label: 'Security' },
]

const quickLinks = [
  { to: '/knowledge', label: 'News' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About us' },
  { to: '/contactus', label: 'Contact us' },
]

const social = [
  { href: '#', label: 'Twitter', Icon: FaTwitter },
  { href: '#', label: 'Facebook', Icon: FaFacebookF },
  { href: '#', label: 'Instagram', Icon: FaInstagram },
  { href: '#', label: 'LinkedIn', Icon: FaLinkedinIn },
]

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
    >
      <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-3" />
      <span>{children}</span>
    </Link>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050a14] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block group">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400/90">
                IT Solutions Thailand
              </span>
              <span className="mt-1 block text-4xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-100">
                Avere
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Where business needs become solutions — networks, systems, security,
              and services built for growing teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                    bg-white/[0.04] text-slate-300 ring-1 ring-white/10
                    transition-all duration-300
                    hover:bg-blue-600 hover:text-white hover:ring-blue-500/40
                    hover:shadow-[0_10px_24px_-12px_rgba(37,99,235,0.8)]"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white">
              Solutions
            </h4>
            <div className="mt-2 mb-4 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            <ul className="space-y-2.5">
              {solutions.map((item) => (
                <li key={item.to}>
                  <FooterLink to={item.to}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white">
              Quick links
            </h4>
            <div className="mt-2 mb-4 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <FooterLink to={item.to}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold text-white">
              Contact info
            </h4>
            <div className="mt-2 mb-4 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />

            <p className="text-sm font-medium text-slate-200">AVERE CO., LTD.</p>

            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/10 text-blue-400">
                  <MapPin size={14} />
                </span>
                <span>Bangkok, Thailand</span>
              </li>
              <li>
                <a
                  href="mailto:info@avere.example.com"
                  className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/10 text-blue-400">
                    <Mail size={14} />
                  </span>
                  <span>info@avere.example.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+6621245263"
                  className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/10 text-blue-400">
                    <Phone size={14} />
                  </span>
                  <span>+66 21245263</span>
                </a>
              </li>
            </ul>

            <Link
              to="/contactus"
              className="mt-6 inline-flex items-center justify-center rounded-xl
                bg-gradient-to-r from-blue-600 to-cyan-500
                px-4 py-2.5 text-sm font-semibold text-white
                shadow-[0_12px_28px_-14px_rgba(37,99,235,0.9)]
                transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get in touch
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-6">
          <p className="text-xs sm:text-sm text-slate-500">
            © {new Date().getFullYear()} Avere. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              About
            </Link>
            <Link to="/contactus" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
            <Link to="/position" className="hover:text-slate-300 transition-colors">
              Careers
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
