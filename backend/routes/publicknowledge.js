let express = require('express')
const knowledgecontroller = require('../controller/knowledgecontroller')
let router = express.Router()

router.get('/api/publicknowledge', knowledgecontroller.publicIndex)
router.get('/api/publicknowledge/:id', knowledgecontroller.publicShow)

module.exports = router
