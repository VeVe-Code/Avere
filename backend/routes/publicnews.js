let express = require('express')
const newscontroller = require('../controller/newscontroller')
let router = express.Router()

router.get('/api/publicnews', newscontroller.publicIndex)
router.get('/api/publicnews/:id', newscontroller.publicShow)

module.exports = router
