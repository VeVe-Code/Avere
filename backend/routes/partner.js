const express = require('express')
const Router = express.Router()
const partnercontroller = require('../controller/partnercontroller')
const upload = require('../helpers/upload')
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware')
const adminOnly = [AuthMiddleware, requireAdmin]

Router.get('/', ...adminOnly, partnercontroller.index)

Router.post('/reorder', ...adminOnly, partnercontroller.reorder)
Router.post('/normalize-orders', ...adminOnly, partnercontroller.normalizeOrders)
Router.post('/move', ...adminOnly, partnercontroller.move)
Router.post('/switch', ...adminOnly, partnercontroller.switch)

Router.post('/', ...adminOnly, partnercontroller.store)

Router.get('/:id', ...adminOnly, partnercontroller.show)

Router.patch('/:id', ...adminOnly, partnercontroller.update)

Router.patch('/:id/hidden', ...adminOnly, partnercontroller.toggleHidden)

Router.delete('/:id', ...adminOnly, partnercontroller.destroy)

Router.post(
  '/:id/upload',
  ...adminOnly,
  upload.single('photo'),
  partnercontroller.upload
)

module.exports = Router
