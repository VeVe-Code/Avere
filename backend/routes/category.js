let express = require('express')
const categorycontroller = require('../controller/categorycontroller')
const { body, validationResult } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');

let router = express.Router()

router.get('/api/category',categorycontroller.index)
router.post('/api/category',[
    body('title').notEmpty(),
       
],handleerrormsg,categorycontroller.store)
router.get('/api/category/:id',categorycontroller.show)
router.delete('/api/category/:id',categorycontroller.destory)
router.patch('/api/category/:id',categorycontroller.update)

module.exports = router

