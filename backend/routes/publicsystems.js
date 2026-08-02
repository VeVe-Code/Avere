let express = require('express')
const systemscontroller = require('../controller/systemscontroller')
let router = express.Router()

router.get('/api/publicsystems',systemscontroller.publicIndex)
router.get('/api/publicsystems/:id',systemscontroller.publicShow)

module.exports=router
