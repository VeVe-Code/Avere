import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axios from '../../helper/axios'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm() {
    let [name, setName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [error, setError] = useState({})
    let navigate = useNavigate()

    let createNewAcc = async (e) => {
       try {
         e.preventDefault()
        let newacc = {
            name,
            email,
            password
        }
        let res = await axios.post('/api/users/register',newacc,{
            withCredentials: true
        })
        if(res.status === 200){
            navigate('/admin/adminservice')
        }
       } catch (e) {
        setError(e.response.data.errors)
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
          Create Account
        </motion.h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Join our platform and get started
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={createNewAcc}>
          {/* Name */}
          
          <div className="relative">
            <input
              type="text"
             
              className="peer w-full bg-transparent border border-white/20 rounded-xl px-4 pt-5 pb-2 text-white outline-none focus:border-cyan-400 transition"
              value = {name}
              onChange = { e => setName(e.target.value)}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Full Name
            </label>
{error.name && <p className="text-red-600 text-sm">{error.name.msg} Name</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <input
            value={email}
            onChange = { e => setEmail(e.target.value)}
              type="email"
             
              className="peer w-full bg-transparent border border-white/20 rounded-xl px-4 pt-5 pb-2 text-white outline-none focus:border-cyan-400 transition"
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Email Address
            </label>
            {error.email && <p className="text-red-600 text-sm">{error.email.msg} Email</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
             value={password}
             onChange={e => setPassword(e.target.value)}
              type="password"
             
              className="peer w-full bg-transparent border border-white/20 rounded-xl px-4 pt-5 pb-2 text-white outline-none focus:border-cyan-400 transition"
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-focus:text-cyan-400 peer-focus:top-1 peer-focus:text-xs transition-all">
              Password
            </label>
               {error.password && <p className="text-red-600 text-sm">{error.password.msg} Name</p>}
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Register
          </motion.button>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <span className="text-cyan-400 hover:underline cursor-pointer">Login</span>
          </p>
        </form>
      </motion.div>
    </div>
  )
}