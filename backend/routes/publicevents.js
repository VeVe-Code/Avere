let express = require('express')
const eventscontroller = require('../controller/eventscontroller')
let router = express.Router()

router.get('/', eventscontroller.publicIndex)
router.get('/:id', eventscontroller.publicShow)

module.exports = router
