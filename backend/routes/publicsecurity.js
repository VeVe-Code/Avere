let express = require ('express')
const securitycontroller = require('../controller/securitycontoller')
let router = express.Router()

router.get('/api/publicsecurity',securitycontroller.index)
router.get('/api/publicsecurity/:id', securitycontroller.show)

module.exports = router