let express = require('express')
const networkcontroller = require("../controller/networkcontroller")

let router = express.Router()

router.get('/api/publicnetwork',networkcontroller.index)
router.get('/api/publicnetwork/:id',networkcontroller.show)

module.exports = router