const multer = require('multer');
const path = require('path');
const fs = require('fs');

let allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// host-ready: same folder local + production
let imagesDir = path.join(__dirname, '../public/images');
fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      ext = '.jpg';
    }
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    let okType = file.mimetype && file.mimetype.startsWith('image/');
    let okExt = allowedExt.includes(ext);
    if (okType && okExt) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpg, png, webp, gif)'));
    }
  }
});

module.exports = upload;
