import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import axios from '../../helper/axios'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { isBlank } from '../../helper/formValidation'
import LineLoginButton from '../../components/LineLoginButton'
import GoogleLoginButton from '../../components/GoogleLoginButton'

const authInput =
  'peer w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-white outline-none transition'
const authInputOk = `${authInput} border-white/20 focus:border-cyan-400`
const authInputErr = `${authInput} border-red-400/80 bg-red-500/5 focus:border-red-400`

function FieldMsg({ message }) {
  if (!message) return null
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-red-400">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  let { dispatch, user, authReady } = useContext(AuthContext)

  if (authReady && user) {
    return <Navigate to="/" replace />
  }

  // OAuth error from redirect query
  const oauthError = new URLSearchParams(location.search).get('error')

  const clearField = (key) =>
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

  const createAcc = async (e) => {
    e.preventDefault()
    setError('')
    const next = {}
    if (isBlank(email)) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (isBlank(password)) next.password = 'Password is required'
    if (Object.keys(next).length) {
      setFieldErrors(next)
      return
    }
    setFieldErrors({})

    try {
      setSubmitting(true)
      const res = await axios.post(
        '/api/users/login',
        { email, password },
        { withCredentials: true }
      )

      if (res.status === 200) {
        dispatch({ type: 'LOGIN', payload: res.data.user })
        const from = location.state?.from
        // Always land on public site after login; open admin from navbar when needed
        if (from && !from.startsWith('/admin') && from !== '/login' && from !== '/register') {
          navigate(from)
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      const data = err.response?.data
      if (data?.code === 'EMAIL_NOT_VERIFIED') {
        navigate(`/verify-email?email=${encodeURIComponent(data.email || email.trim())}`)
        return
      }
      setError(data?.error || 'Login failed')
    } finally {
      setSubmitting(false)
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
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white text-center mb-2"
        >
          Login
        </motion.h2>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Sign in to your Avere account
        </p>

        <form className="space-y-5" onSubmit={createAcc} noValidate>
          {(error || oauthError || Object.keys(fieldErrors).length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3"
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">
                {error || oauthError || 'Please fix the highlighted fields'}
              </p>
            </motion.div>
          )}

          <LineLoginButton label="Continue with LINE" />
          <GoogleLoginButton label="Continue with Google" />

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="h-px flex-1 bg-white/10" />
            <span>or email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearField('email')
                setError('')
              }}
              className={fieldErrors.email ? authInputErr : authInputOk}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Email Address
            </label>
            <FieldMsg message={fieldErrors.email} />
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearField('password')
                setError('')
              }}
              className={fieldErrors.password ? authInputErr : authInputOk}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Password
            </label>
            <FieldMsg message={fieldErrors.password} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </motion.button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Do wanna make new acc?{' '}
            <Link to="/register">
              <span className="text-cyan-400 hover:underline cursor-pointer">
                Register
              </span>
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default LoginForm
