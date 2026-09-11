let express = require('express')
const partnercontroller = require('../controller/partnercontroller')
let router = express.Router()

router.get('/', partnercontroller.publicIndex)

module.exports = router
