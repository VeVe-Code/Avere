let express = require('express')
const knowledgecontroller = require('../controller/knowledgecontroller')
let router = express.Router()

router.get('/api/publicknowledge',knowledgecontroller.index)
router.get('/api/publicknowledge/:id',knowledgecontroller.show)

module.exports = router