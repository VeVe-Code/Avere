let express = require('express')
const networkcontroller = require("../controller/networkcontroller")

let router = express.Router()

router.get('/api/publicnetwork',networkcontroller.publicIndex)
router.get('/api/publicnetwork/:id',networkcontroller.publicShow)

module.exports = router
