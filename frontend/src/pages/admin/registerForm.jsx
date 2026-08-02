import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import axios from '../../helper/axios'
import { Link, useNavigate } from 'react-router-dom'
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

export default function RegisterForm() {
  let [name, setName] = useState('')
  let [email, setEmail] = useState('')
  let [phone, setPhone] = useState('')
  let [password, setPassword] = useState('')
  let [error, setError] = useState({})
  let [formError, setFormError] = useState('')
  let [submitting, setSubmitting] = useState(false)
  let navigate = useNavigate()
  let { dispatch } = useContext(AuthContext)

  let clearField = (key) =>
    setError((prev) => {
      if (!prev[key]) return prev
      let next = { ...prev }
      delete next[key]
      return next
    })

  let createNewAcc = async (e) => {
    e.preventDefault()
    setFormError('')
    let next = {}
    if (isBlank(name)) next.name = { msg: 'Full name is required' }
    if (isBlank(email)) next.email = { msg: 'Email is required' }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = { msg: 'Enter a valid email address' }
    }
    if (isBlank(password)) next.password = { msg: 'Password is required' }
    else if (password.length < 6) {
      next.password = { msg: 'Password must be at least 6 characters' }
    }
    if (Object.keys(next).length) {
      setError(next)
      return
    }
    setError({})

    try {
      setSubmitting(true)
      let newacc = {
        name,
        email,
        phone: phone.trim(),
        password,
      }
      let res = await axios.post('/api/users/register', newacc, {
        withCredentials: true,
      })
      if (res.status === 200 && res.data?.needsVerification) {
        navigate(`/verify-email?email=${encodeURIComponent(res.data.email)}`)
        return
      }
      if (res.status === 200 && res.data?.user) {
        dispatch({ type: 'LOGIN', payload: res.data.user })
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.errors || {})
      if (err.response?.data?.error) {
        setFormError(err.response.data.error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  let hasErrors = formError || Object.values(error).some((v) => v?.msg)

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
          Create Account
        </motion.h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Register as a customer
        </p>

        <form className="space-y-5" onSubmit={createNewAcc} noValidate>
          {hasErrors && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3"
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <div className="min-w-0 text-sm text-red-300">
                <p className="font-medium">
                  {formError || 'Please fix the highlighted fields'}
                </p>
                {!formError &&
                  Object.entries(error)
                    .filter(([, v]) => v?.msg)
                    .map(([key, v]) => (
                      <p key={key} className="mt-1 text-red-400/90">
                        <span className="capitalize">{key}</span> — {v.msg}
                      </p>
                    ))}
              </div>
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
              type="text"
              className={error.name ? authInputErr : authInputOk}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearField('name')
              }}
              aria-invalid={Boolean(error.name)}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Full Name
            </label>
            <FieldMsg message={error.name?.msg} />
          </div>

          <div className="relative">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearField('email')
              }}
              type="email"
              className={error.email ? authInputErr : authInputOk}
              aria-invalid={Boolean(error.email)}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Email Address
            </label>
            <FieldMsg message={error.email?.msg} />
          </div>

          <div>
            <div className="relative">
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  clearField('phone')
                }}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder=" "
                className={error.phone ? authInputErr : authInputOk}
                aria-invalid={Boolean(error.phone)}
              />
              <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                Phone number
              </label>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400 px-1">
              Optional — for follow-up only (e.g. 09xxxxxxxxx)
            </p>
            <FieldMsg message={error.phone?.msg} />
          </div>

          <div className="relative">
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearField('password')
              }}
              type="password"
              className={error.password ? authInputErr : authInputOk}
              aria-invalid={Boolean(error.password)}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Password
            </label>
            <FieldMsg message={error.password?.msg} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Register'}
          </motion.button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login">
              <span className="text-cyan-400 hover:underline cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
