let express = require('express')

const positioncontroller = require('../controller/positioncontroller')
let router = express.Router()

router.get('/', positioncontroller.publicIndex)
router.get('/:id', positioncontroller.publicShow)

module.exports = router
