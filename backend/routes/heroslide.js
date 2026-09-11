const express = require('express')
const Router = express.Router()
const heroslidecontroller = require('../controller/heroslidecontroller')
const upload = require('../helpers/upload')
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware')
const adminOnly = [AuthMiddleware, requireAdmin]

Router.get('/', ...adminOnly, heroslidecontroller.index)

Router.post('/reorder', ...adminOnly, heroslidecontroller.reorder)
Router.post('/normalize-orders', ...adminOnly, heroslidecontroller.normalizeOrders)
Router.post('/move', ...adminOnly, heroslidecontroller.move)
Router.post('/switch', ...adminOnly, heroslidecontroller.switch)

Router.post('/', ...adminOnly, heroslidecontroller.store)

Router.get('/:id', ...adminOnly, heroslidecontroller.show)

Router.patch('/:id', ...adminOnly, heroslidecontroller.update)

Router.patch('/:id/hidden', ...adminOnly, heroslidecontroller.toggleHidden)

Router.delete('/:id', ...adminOnly, heroslidecontroller.destroy)

Router.post(
  '/:id/upload',
  ...adminOnly,
  upload.single('photo'),
  heroslidecontroller.upload
)

module.exports = Router
