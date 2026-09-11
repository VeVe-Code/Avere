const express = require('express')
const Router = express.Router()
const contactinfocontroller = require('../controller/contactinfocontroller')
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware')
const adminOnly = [AuthMiddleware, requireAdmin]

Router.get('/', ...adminOnly, contactinfocontroller.show)

Router.put('/', ...adminOnly, contactinfocontroller.update)

module.exports = Router
