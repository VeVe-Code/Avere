let express = require('express')
let servicecontroller = require('../controller/servicecontroller')
let router = express.Router()

router.get('/api/publicservice',servicecontroller.index)
router.get('/api/publicservice/:id',servicecontroller.show)

module.exports = router