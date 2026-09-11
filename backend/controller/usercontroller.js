let User = require('../model/User')
let Knowledge = require('../model/Knowledge')
let News = require('../model/News')
let Service = require('../model/Services')
let Systems = require('../model/Systems')
let Network = require('../model/Network')
let Security = require('../model/Security')
let Events = require('../model/Events')
let createToken = require('../helpers/createToken')
let toSafeUser = require('../helpers/toSafeUser')
let cookieOptions = require('../helpers/cookieOptions')
let { sendVerificationOtp, mailConfigured } = require('../helpers/mail')
let lineAuth = require('../helpers/lineAuth')
let googleAuth = require('../helpers/googleAuth')

let maxAge = 3 * 24 * 60 * 60 * 1000

let allowedTypes = ['knowledge', 'news', 'service', 'system', 'network', 'security', 'events']

let modelByType = {
  knowledge: Knowledge,
  news: News,
  service: Service,
  system: Systems,
  network: Network,
  security: Security,
  events: Events,
}

let pathByType = {
  knowledge: '/knowledge/',
  news: '/news/',
  service: '/service/',
  system: '/system/',
  network: '/network/',
  security: '/security/',
  events: '/events/',
}

let labelByType = {
  knowledge: 'Knowledge',
  news: 'News',
  service: 'Service',
  system: 'System',
  network: 'Network',
  security: 'Security',
  events: 'Event',
}

async function migrateLegacySaves(user) {
  if (!user.savedKnowledge || !user.savedKnowledge.length) return user
  if (!user.savedItems) user.savedItems = []
  for (let id of user.savedKnowledge) {
    let exists = user.savedItems.some(
      s => s.type === 'knowledge' && String(s.itemId) === String(id)
    )
    if (!exists) {
      user.savedItems.push({ type: 'knowledge', itemId: id })
    }
  }
  user.savedKnowledge = []
  await user.save()
  return user
}

let usercontroller = {

    me : async(req,res) => {
      return res.json(toSafeUser(req.user))
    },

    updateProfile: async (req, res) => {
      try {
        let { name, phone } = req.body
        let user = await User.findById(req.user._id)
        if (!user) {
          return res.status(404).json({ error: 'user not found' })
        }

        if (name !== undefined) {
          let cleanName = String(name || '').trim()
          if (!cleanName) {
            return res.status(400).json({ error: 'Name is required' })
          }
          user.name = cleanName
        }

        if (phone !== undefined) {
          let cleanPhone = String(phone || '').trim()
          if (cleanPhone) {
            let digits = cleanPhone.replace(/\D/g, '')
            if (digits.length < 8 || digits.length > 15) {
              return res.status(400).json({ error: 'Enter a valid phone number (8–15 digits)' })
            }
            if (!/^[+\d][\d\s\-()]*$/.test(cleanPhone)) {
              return res.status(400).json({ error: 'Phone number format is invalid' })
            }
          }
          user.phone = cleanPhone
        }

        await user.save()
        return res.json({ user: toSafeUser(user) })
      } catch (e) {
        return res.status(400).json({ error: e.message })
      }
    },

    changePassword: async (req, res) => {
      try {
        let { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
          return res.status(400).json({ error: 'Current and new password are required' })
        }
        if (String(newPassword).length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters' })
        }

        let user = await User.findById(req.user._id)
        if (!user) {
          return res.status(404).json({ error: 'user not found' })
        }

        let bcrypt = require('bcrypt')
        let ok = await bcrypt.compare(currentPassword, user.password)
        if (!ok) {
          return res.status(400).json({ error: 'Current password is incorrect' })
        }

        let salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(String(newPassword), salt)
        await user.save()
        return res.json({ message: 'Password updated' })
      } catch (e) {
        return res.status(400).json({ error: e.message })
      }
    },

    index : async(req,res) => {
      try {
        let users = await User.find().select('-password').sort({ _id: -1 })
        return res.json(users.map(u => toSafeUser(u)))
      } catch (e) {
        return res.status(500).json({ error: e.message })
      }
    },

  login: async (req, res) => {

    try {
      let { email, password } = req.body;

      let user = await User.login(email, password)
      let token = createToken(user._id)

      res.cookie('jwt', token, cookieOptions(maxAge))

      return res.json({ user: toSafeUser(user) })

    } catch (e) {
      if (e.code === 'EMAIL_NOT_VERIFIED') {
        return res.status(403).json({
          error: e.message,
          code: 'EMAIL_NOT_VERIFIED',
          email: String(req.body?.email || '').trim().toLowerCase(),
        })
      }
      return res.status(400).json({ error: e.message })
    }
  },

  register: async (req, res) => {
    try {
      let { name, email, password, phone } = req.body
      let cleanPhone = (phone || '').toString().trim()
      let cleanEmail = String(email || '').trim().toLowerCase()

      let user = await User.register(name, cleanEmail, password, 'customer', cleanPhone)

      let otp = user.setOtp()
      await user.save()
      let mailResult = await sendVerificationOtp(cleanEmail, otp)

      return res.json({
        needsVerification: true,
        email: cleanEmail,
        message: mailResult.preview
          ? 'Account created. SMTP is not configured — check the server console for your OTP.'
          : 'Account created. Check your email for the verification code.',
        smtpConfigured: mailConfigured(),
      })

    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  verifyEmail: async (req, res) => {
    try {
      let email = String(req.body?.email || '').trim().toLowerCase()
      let otp = String(req.body?.otp || '').trim()

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and verification code are required' })
      }

      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }
      if (user.isVerified) {
        let token = createToken(user._id)
        res.cookie('jwt', token, cookieOptions(maxAge))
        return res.json({ user: toSafeUser(user), message: 'Email already verified' })
      }
      if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Code expired. Please request a new one.' })
      }
      if (user.otp !== otp) {
        return res.status(400).json({ error: 'Invalid verification code' })
      }

      user.isVerified = true
      user.otp = null
      user.otpExpires = null
      await user.save()

      let token = createToken(user._id)
      res.cookie('jwt', token, cookieOptions(maxAge))
      return res.json({ user: toSafeUser(user), message: 'Email verified' })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  resendOtp: async (req, res) => {
    try {
      let email = String(req.body?.email || '').trim().toLowerCase()
      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }
      if (user.isVerified) {
        return res.json({ message: 'Email already verified' })
      }

      let otp = user.setOtp()
      await user.save()
      let mailResult = await sendVerificationOtp(email, otp)

      return res.json({
        email,
        message: mailResult.preview
          ? 'OTP printed in server console (SMTP not configured).'
          : 'A new verification code was sent to your email.',
        smtpConfigured: mailConfigured(),
      })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  lineAuthStart: async (req, res) => {
    try {
      if (!lineAuth.lineConfigured()) {
        return res.status(503).send('LINE Login is not configured')
      }
      let state = lineAuth.makeState()
      res.cookie('line_oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000,
      })
      return res.redirect(lineAuth.buildAuthorizeUrl(state))
    } catch (e) {
      let front = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
      return res.redirect(`${front}/login?error=${encodeURIComponent(e.message)}`)
    }
  },

  lineAuthCallback: async (req, res) => {
    let front = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
    try {
      if (!lineAuth.lineConfigured()) {
        return res.redirect(`${front}/login?error=${encodeURIComponent('LINE Login is not configured')}`)
      }

      let { code, state, error, error_description } = req.query
      if (error) {
        return res.redirect(
          `${front}/login?error=${encodeURIComponent(error_description || error)}`
        )
      }

      let savedState = req.cookies?.line_oauth_state
      res.clearCookie('line_oauth_state')
      if (!code || !state || !savedState || state !== savedState) {
        return res.redirect(`${front}/login?error=${encodeURIComponent('Invalid LINE login state')}`)
      }

      let tokenData = await lineAuth.exchangeCode(String(code))
      let profile = await lineAuth.fetchProfile(tokenData.access_token)
      let idInfo = await lineAuth.verifyIdToken(tokenData.id_token)

      let lineId = profile.userId
      let name = profile.displayName || idInfo?.name || 'LINE User'
      let email = idInfo?.email || null

      let user = await User.findOrCreateFromLine({ lineId, name, email })
      let jwtToken = createToken(user._id)
      res.cookie('jwt', jwtToken, cookieOptions(maxAge))

      return res.redirect(`${front}/?oauth=line`)
    } catch (e) {
      return res.redirect(`${front}/login?error=${encodeURIComponent(e.message || 'LINE login failed')}`)
    }
  },

  googleAuthStart: async (req, res) => {
    try {
      if (!googleAuth.googleConfigured()) {
        return res.status(503).send('Google Login is not configured')
      }
      let state = googleAuth.makeState()
      res.cookie('google_oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000,
      })
      return res.redirect(googleAuth.buildAuthorizeUrl(state))
    } catch (e) {
      let front = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
      return res.redirect(`${front}/login?error=${encodeURIComponent(e.message)}`)
    }
  },

  googleAuthCallback: async (req, res) => {
    let front = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
    try {
      if (!googleAuth.googleConfigured()) {
        return res.redirect(`${front}/login?error=${encodeURIComponent('Google Login is not configured')}`)
      }

      let { code, state, error, error_description } = req.query
      if (error) {
        return res.redirect(
          `${front}/login?error=${encodeURIComponent(error_description || error)}`
        )
      }

      let savedState = req.cookies?.google_oauth_state
      res.clearCookie('google_oauth_state')
      if (!code || !state || !savedState || state !== savedState) {
        return res.redirect(`${front}/login?error=${encodeURIComponent('Invalid Google login state')}`)
      }

      let tokenData = await googleAuth.exchangeCode(String(code))
      let profile = await googleAuth.fetchUserInfo(tokenData.access_token)

      let googleId = profile.sub
      let name = profile.name || profile.given_name || 'Google User'
      let email = profile.email || null

      if (!googleId) {
        return res.redirect(`${front}/login?error=${encodeURIComponent('Google profile missing id')}`)
      }

      let user = await User.findOrCreateFromGoogle({ googleId, name, email })
      let jwtToken = createToken(user._id)
      res.cookie('jwt', jwtToken, cookieOptions(maxAge))

      return res.redirect(`${front}/?oauth=google`)
    } catch (e) {
      return res.redirect(`${front}/login?error=${encodeURIComponent(e.message || 'Google login failed')}`)
    }
  },

  updateRole: async (req, res) => {
    try {
      let { role } = req.body
      let allowed = ['owner', 'admin', 'customer']
      if (!allowed.includes(role)) {
        return res.status(400).json({ error: 'role must be owner, admin, or customer' })
      }

      let target = await User.findById(req.params.id)
      if (!target) {
        return res.status(404).json({ error: 'user not found' })
      }

      // cannot change own role
      if (String(target._id) === String(req.user._id)) {
        return res.status(400).json({ error: 'cannot change your own role' })
      }

      // keep at least one owner
      if (target.role === 'owner' && role !== 'owner') {
        let ownerCount = await User.countDocuments({ role: 'owner' })
        if (ownerCount <= 1) {
          return res.status(400).json({ error: 'must keep at least one owner' })
        }
      }

      target.role = role
      await target.save()
      return res.json({ user: toSafeUser(target) })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  destroy: async (req, res) => {
    try {
      let target = await User.findById(req.params.id)
      if (!target) {
        return res.status(404).json({ error: 'user not found' })
      }

      if (String(target._id) === String(req.user._id)) {
        return res.status(400).json({ error: 'cannot delete your own account' })
      }

      if (target.role === 'owner') {
        let ownerCount = await User.countDocuments({ role: 'owner' })
        if (ownerCount <= 1) {
          return res.status(400).json({ error: 'must keep at least one owner' })
        }
      }

      await User.findByIdAndDelete(req.params.id)
      return res.json({ message: 'user deleted' })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  library: async (req, res) => {
    try {
      let user = await User.findById(req.user._id)
      user = await migrateLegacySaves(user)

      let results = []
      for (let entry of (user.savedItems || [])) {
        let Model = modelByType[entry.type]
        if (!Model) continue
        let doc = await Model.findById(entry.itemId)
        if (!doc) continue
        results.push({
          type: entry.type,
          label: labelByType[entry.type],
          path: pathByType[entry.type] + doc._id,
          _id: doc._id,
          title: doc.title || doc.name || '',
          description: doc.description || '',
          photo: doc.photo || ''
        })
      }
      return res.json(results)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  },

  saveItem: async (req, res) => {
    try {
      let type = req.params.type
      let itemId = req.params.id
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'invalid type' })
      }

      let Model = modelByType[type]
      let existsDoc = await Model.findById(itemId)
      if (!existsDoc) {
        return res.status(404).json({ error: 'item not found' })
      }

      let user = await User.findById(req.user._id)
      user = await migrateLegacySaves(user)
      if (!user.savedItems) user.savedItems = []

      let exists = user.savedItems.some(
        s => s.type === type && String(s.itemId) === String(itemId)
      )
      if (!exists) {
        user.savedItems.push({ type, itemId })
        await user.save()
      }
      return res.json({ saved: true })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  unsaveItem: async (req, res) => {
    try {
      let type = req.params.type
      let itemId = req.params.id
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'invalid type' })
      }

      let user = await User.findById(req.user._id)
      user = await migrateLegacySaves(user)
      user.savedItems = (user.savedItems || []).filter(
        s => !(s.type === type && String(s.itemId) === String(itemId))
      )
      await user.save()
      return res.json({ saved: false })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  checkSaved: async (req, res) => {
    try {
      let type = req.params.type
      let itemId = req.params.id
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'invalid type' })
      }

      let user = await User.findById(req.user._id)
      user = await migrateLegacySaves(user)
      let saved = (user.savedItems || []).some(
        s => s.type === type && String(s.itemId) === String(itemId)
      )
      return res.json({ saved })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  },

  logout :(req,res) => {
      res.cookie('jwt', '', cookieOptions(1))
      return res.json({message : "user logout"})
  }

}

module.exports = usercontroller
