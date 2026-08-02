const express = require('express');
const Router = express.Router();
const eventscontroller = require('../controller/eventscontroller');
const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
const upload = require('../helpers/upload');
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

Router.get('/', ...adminOnly, eventscontroller.index);

Router.post(
  '/',
  ...adminOnly,
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty(),
  ],
  handleerrormsg,
  eventscontroller.store
);

Router.get('/:id', ...adminOnly, eventscontroller.show);

Router.patch('/:id', ...adminOnly, eventscontroller.update);

Router.patch('/:id/hidden', ...adminOnly, eventscontroller.toggleHidden);

Router.delete('/:id', ...adminOnly, eventscontroller.destroy);

Router.post(
  '/:id/upload',
  ...adminOnly,
  upload.single('photo'),
  eventscontroller.upload
);

module.exports = Router;
