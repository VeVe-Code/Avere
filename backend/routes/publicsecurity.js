let express = require ('express')
const securitycontroller = require('../controller/securitycontoller')
let router = express.Router()

router.get('/api/publicsecurity',securitycontroller.publicIndex)
router.get('/api/publicsecurity/:id', securitycontroller.publicShow)

module.exports = router
