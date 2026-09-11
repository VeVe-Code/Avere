let express = require('express')
const heroslidecontroller = require('../controller/heroslidecontroller')
let router = express.Router()

router.get('/', heroslidecontroller.publicIndex)

module.exports = router
