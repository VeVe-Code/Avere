let express = require('express')
let usercontroller = require('../controller/usercontroller')
let router = express.Router()
const handleerrormsg = require("../middleware/handleerrormsg")
const { body } = require('express-validator');
const User = require('../model/User');
let AuthMiddleware = require('../middleware/AuthMiddleware')
let { requireOwner } = require('../middleware/AuthMiddleware')

router.get('/me', AuthMiddleware, usercontroller.me)
router.patch('/me', AuthMiddleware, [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('phone').optional({ checkFalsy: true }).custom((value) => {
    let phone = String(value || '').trim()
    if (!phone) return true
    let digits = phone.replace(/\D/g, '')
    if (digits.length < 8 || digits.length > 15) {
      throw new Error('Enter a valid phone number (8–15 digits)')
    }
    if (!/^[+\d][\d\s\-()]*$/.test(phone)) {
      throw new Error('Phone number format is invalid')
    }
    return true
  }),
], handleerrormsg, usercontroller.updateProfile)
router.patch('/me/password', AuthMiddleware, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], handleerrormsg, usercontroller.changePassword)
router.post('/login', usercontroller.login)
router.post('/logout', usercontroller.logout)
router.get('/auth/line', usercontroller.lineAuthStart)
router.get('/auth/line/callback', usercontroller.lineAuthCallback)
router.get('/auth/google', usercontroller.googleAuthStart)
router.get('/auth/google/callback', usercontroller.googleAuthCallback)
router.post('/verify-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('Verification code is required'),
], handleerrormsg, usercontroller.verifyEmail)
router.post('/resend-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
], handleerrormsg, usercontroller.resendOtp)

router.post('/register',[
    body('name').notEmpty().withMessage('Name is required'),
     body('email').isEmail().withMessage('Valid email is required').custom(async value => {
    let user = await User.findOne({email: String(value || '').trim().toLowerCase()})
      if (user) {
        return Promise.reject('E-mail already in use');
      }
  
  }),
    body('password').notEmpty().withMessage('Password is required'),
    body('phone').optional({ checkFalsy: true }).custom((value) => {
      let phone = String(value || '').trim()
      if (!phone) return true
      // allow +, spaces, dashes, parentheses; require 8–15 digits
      let digits = phone.replace(/\D/g, '')
      if (digits.length < 8 || digits.length > 15) {
        throw new Error('Enter a valid phone number (8–15 digits)')
      }
      if (!/^[+\d][\d\s\-()]*$/.test(phone)) {
        throw new Error('Phone number format is invalid')
      }
      return true
    }),
],handleerrormsg, usercontroller.register)

// my library — all content types
router.get('/library', AuthMiddleware, usercontroller.library)
router.get('/library/check/:type/:id', AuthMiddleware, usercontroller.checkSaved)
router.post('/library/:type/:id', AuthMiddleware, usercontroller.saveItem)
router.delete('/library/:type/:id', AuthMiddleware, usercontroller.unsaveItem)

// users management — owner only
router.get('/', AuthMiddleware, requireOwner, usercontroller.index)
router.patch('/:id/role', AuthMiddleware, requireOwner, usercontroller.updateRole)
router.delete('/:id', AuthMiddleware, requireOwner, usercontroller.destroy)

module.exports = router
