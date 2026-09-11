let express = require('express');
let knowledgecontroller = require('../controller/knowledgecontroller');
let Router = express.Router();

const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
let upload = require('../helpers/upload');
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];


/* =========================
   GET ALL KNOWLEDGE
========================= */
Router.get('/api/knowledge', ...adminOnly, knowledgecontroller.index);

Router.post('/api/knowledge/reorder', ...adminOnly, knowledgecontroller.reorder);
Router.post('/api/knowledge/normalize-orders', ...adminOnly, knowledgecontroller.normalizeOrders);
Router.post('/api/knowledge/move', ...adminOnly, knowledgecontroller.move);
Router.post('/api/knowledge/switch', ...adminOnly, knowledgecontroller.switch);

Router.post(
  '/api/knowledge',
  ...adminOnly,
  [
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('about').notEmpty().withMessage("About is required")
  ],
  handleerrormsg,
  knowledgecontroller.store
);


/* =========================
   GET SINGLE KNOWLEDGE
========================= */
Router.get('/api/knowledge/:id', ...adminOnly, knowledgecontroller.show);


/* =========================
   UPLOAD MAIN IMAGE
========================= */
Router.post(
  '/api/knowledge/:id/upload',
  ...adminOnly,
  upload.single('photo'),
  knowledgecontroller.upload
);


/* =========================
   UPLOAD 5 SECTION IMAGES
========================= */
Router.post(
  '/api/knowledge/:id/sections-upload',
  ...adminOnly,
  upload.array('photos', 5),
  knowledgecontroller.uploadSections
);


/* =========================
   UPDATE KNOWLEDGE
========================= */
Router.patch('/api/knowledge/:id', ...adminOnly, knowledgecontroller.update);

/* =========================
   TOGGLE HIDDEN (public visibility)
========================= */
Router.patch('/api/knowledge/:id/hidden', ...adminOnly, knowledgecontroller.toggleHidden);

Router.patch('/api/knowledge/:id/pinned', ...adminOnly, knowledgecontroller.togglePinned);

/* =========================
   DELETE KNOWLEDGE
========================= */
Router.delete('/api/knowledge/:id', ...adminOnly, knowledgecontroller.destroy);


module.exports = Router;
