let express = require('express');
let newscontroller = require('../controller/newscontroller');
let Router = express.Router();

const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
let upload = require('../helpers/upload');
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

Router.get('/api/news', ...adminOnly, newscontroller.index);

Router.post('/api/news/reorder', ...adminOnly, newscontroller.reorder);
Router.post('/api/news/normalize-orders', ...adminOnly, newscontroller.normalizeOrders);
Router.post('/api/news/move', ...adminOnly, newscontroller.move);
Router.post('/api/news/switch', ...adminOnly, newscontroller.switch);

Router.post(
  '/api/news',
  ...adminOnly,
  [
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('about').notEmpty().withMessage("About is required")
  ],
  handleerrormsg,
  newscontroller.store
);

Router.get('/api/news/:id', ...adminOnly, newscontroller.show);

Router.post(
  '/api/news/:id/upload',
  ...adminOnly,
  upload.single('photo'),
  newscontroller.upload
);

Router.post(
  '/api/news/:id/sections-upload',
  ...adminOnly,
  upload.array('photos', 20),
  newscontroller.uploadSections
);

Router.patch('/api/news/:id', ...adminOnly, newscontroller.update);

Router.patch('/api/news/:id/hidden', ...adminOnly, newscontroller.toggleHidden);

Router.patch('/api/news/:id/pinned', ...adminOnly, newscontroller.togglePinned);

Router.delete('/api/news/:id', ...adminOnly, newscontroller.destroy);

module.exports = Router;
