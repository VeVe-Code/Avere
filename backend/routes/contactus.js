let express = require('express')
const contactuscontroller = require('../controller/contactuscontroller')
let  router = express.Router()
const { body, validationResult } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');

router.get("/api/contactus" , contactuscontroller.index )
router.post("/api/contactus",[
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('phno').notEmpty(),
     body('msg').notEmpty(),       
],handleerrormsg, contactuscontroller.store)
router.get("/api/contactus/:id", contactuscontroller.show)
router.delete("/api/contactus/:id", contactuscontroller.destory)

module.exports = router