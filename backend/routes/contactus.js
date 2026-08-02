let express = require('express')
const contactuscontroller = require('../controller/contactuscontroller')
let  router = express.Router()
const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

// Public contact form
router.post("/api/contactus",[
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('phno').notEmpty(),
     body('msg').notEmpty(),       
],handleerrormsg, contactuscontroller.store)

// Admin only
router.get("/api/contactus" , ...adminOnly, contactuscontroller.index )
router.get("/api/contactus/:id", ...adminOnly, contactuscontroller.show)
router.delete("/api/contactus/:id", ...adminOnly, contactuscontroller.destory)

module.exports = router
