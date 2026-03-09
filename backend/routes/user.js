let express = require('express')
let usercontroller = require('../controller/usercontroller')
let router = express.Router()
const handleerrormsg = require("../middleware/handleerrormsg")
const { body, validationResult } = require('express-validator');
const User = require('../model/User');
let AuthMiddleware = require('../middleware/AuthMiddleware')

router.get('/me', AuthMiddleware,usercontroller.me)
router.post('/login', usercontroller.login)
router.post('/logout', usercontroller.logout)
router.post('/register',[
    body('name').notEmpty(),
     body('email').custom(async value => {
    let user = await User.findOne({email:value})
      if (user) {
        return Promise.reject('E-mail already in use');
      }
  
  }),
    body('password').notEmpty()        
],handleerrormsg, usercontroller.register)

module.exports = router