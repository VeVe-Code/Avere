let express = require('express')
const contactinfocontroller = require('../controller/contactinfocontroller')
let router = express.Router()

router.get('/', contactinfocontroller.publicShow)

module.exports = router
