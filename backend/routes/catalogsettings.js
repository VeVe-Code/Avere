const express = require('express')
const catalogsettingscontroller = require('../controller/catalogsettingscontroller')
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware')

const router = express.Router()
const adminOnly = [AuthMiddleware, requireAdmin]

router.get('/:key', ...adminOnly, catalogsettingscontroller.show)
router.patch('/:key', ...adminOnly, catalogsettingscontroller.update)

module.exports = router
