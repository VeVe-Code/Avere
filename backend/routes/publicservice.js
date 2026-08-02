let express = require('express')
let servicecontroller = require('../controller/servicecontroller')
let router = express.Router()

router.get('/api/publicservice',servicecontroller.publicIndex)
router.get('/api/publicservice/:id',servicecontroller.publicShow)

module.exports = router
