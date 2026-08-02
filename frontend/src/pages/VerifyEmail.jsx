import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import axios from '../helper/axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const authInput =
  'peer w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-white outline-none transition border-white/20 focus:border-cyan-400'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { dispatch } = useContext(AuthContext)

  const [email, setEmail] = useState(params.get('email') || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(
    params.get('email')
      ? 'Enter the 6-digit code we sent to your email.'
      : 'Enter your email and the verification code.'
  )
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const verify = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !otp.trim()) {
      setError('Email and code are required')
      return
    }
    try {
      setSubmitting(true)
      const res = await axios.post(
        '/api/users/verify-email',
        { email: email.trim().toLowerCase(), otp: otp.trim() },
        { withCredentials: true }
      )
      if (res.status === 200) {
        dispatch({ type: 'LOGIN', payload: res.data.user })
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  const resend = async () => {
    setError('')
    if (!email.trim()) {
      setError('Enter your email first')
      return
    }
    try {
      setResending(true)
      const res = await axios.post('/api/users/resend-otp', {
        email: email.trim().toLowerCase(),
      })
      setInfo(res.data?.message || 'A new code was sent.')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">Verify email</h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Confirm your inbox so we know this email is real.
        </p>

        <form className="space-y-5" onSubmit={verify} noValidate>
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          {!error && info && (
            <div className="flex items-start gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-cyan-400" />
              <p className="text-sm text-cyan-100">{info}</p>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInput}
              autoComplete="email"
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={authInput}
              autoComplete="one-time-code"
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              6-digit code
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? 'Verifying...' : 'Verify & continue'}
          </motion.button>

          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="w-full text-sm text-cyan-400 hover:underline disabled:opacity-60"
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            <Link to="/login" className="text-cyan-400 hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
