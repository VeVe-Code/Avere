let express = require('express')
const systemscontroller = require('../controller/systemscontroller')
let router = express.Router()

router.get('/api/publicsystems',systemscontroller.index)
router.get('/api/publicsystems/:id',systemscontroller.show)

module.exports=router