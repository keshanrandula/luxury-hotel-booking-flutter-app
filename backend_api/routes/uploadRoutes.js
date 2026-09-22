const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// Configure in-memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per photo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Single & multi file upload routes
router.post('/', upload.single('image'), uploadImage);
router.post('/multiple', upload.array('images', 10), uploadImage);

module.exports = router;
