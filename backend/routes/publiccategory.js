let express = require('express')
const categorycontroller = require('../controller/categorycontroller')

let router = express.Router()


router.get('/api/publiccategory', categorycontroller.index)

module.exports= router