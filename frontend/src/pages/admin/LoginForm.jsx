import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import axios from '../../helper/axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

function LoginForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')   // ✅ string error
  const navigate = useNavigate()
  let {dispatch}= useContext(AuthContext)

  const createAcc = async (e) => {
    try {
      e.preventDefault()
      setError('') // clear old error

      const user = { email, password }

      const res = await axios.post(
        '/api/users/login',
        user,
        { withCredentials: true }
      )

      if (res.status === 200) {
        dispatch({type: "LOGIN", payload : res.data.user})
        navigate('/admin/adminservice')
      }

    } catch (e) {
      console.log("LOGIN ERROR 👉", e.response?.data)
      setError(e.response?.data?.error || "Login failed")
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

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white text-center mb-2"
        >
          Login Account
        </motion.h2>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Join our platform and get started
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={createAcc}>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="peer w-full bg-transparent border border-white/20 rounded-xl px-4 pt-5 pb-2 text-white outline-none focus:border-cyan-400 transition"
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="peer w-full bg-transparent border border-white/20 rounded-xl px-4 pt-5 pb-2 text-white outline-none focus:border-cyan-400 transition"
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Password
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-lg p-3 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Login
          </motion.button>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Do wanna make new acc?{" "}
            <span className="text-cyan-400 hover:underline cursor-pointer">
              Register
            </span>
          </p>

        </form>
      </motion.div>
    </div>
  )
}

export default LoginForm
