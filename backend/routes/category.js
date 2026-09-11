let express = require('express')
const categorycontroller = require('../controller/categorycontroller')
const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

let router = express.Router()

router.get('/api/category', ...adminOnly, categorycontroller.index)
router.get('/api/category/meta', ...adminOnly, categorycontroller.categories)
router.post('/api/category', ...adminOnly, [
    body('title').notEmpty(),
    body('category').notEmpty(),
],handleerrormsg,categorycontroller.store)
router.get('/api/category/:id', ...adminOnly, categorycontroller.show)
router.delete('/api/category/:id', ...adminOnly, categorycontroller.destory)
router.patch('/api/category/:id', ...adminOnly, categorycontroller.update)

module.exports = router
