const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  uploadMinutes,
  getMinutes
} = require('../controllers/documentController');

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'minutes-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Secretariat uploads minutes
router.post('/minutes', auth, roleGuard('secretariat'), upload.single('file'), uploadMinutes);

// All authenticated users can view
router.get('/minutes', auth, getMinutes);

module.exports = router;
