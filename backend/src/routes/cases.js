const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  createCase,
  getAllCases,
  getMyCases,
  getResolvedCases,
  getAssignedCases,
  getCaseById,
  assignCase,
  updateCaseStatus,
  addNote
} = require('../controllers/caseController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Public Hub route (all authenticated users)
router.get('/resolved', auth, getResolvedCases);

// Staff routes
router.post('/', auth, roleGuard('staff'), upload.array('attachments', 5), createCase);
router.get('/my', auth, roleGuard('staff'), getMyCases);

// Case Manager routes
router.get('/assigned', auth, roleGuard('case-manager'), getAssignedCases);
router.put('/:id/status', auth, roleGuard('case-manager', 'secretariat'), updateCaseStatus);
router.post('/:id/notes', auth, roleGuard('case-manager', 'secretariat'), addNote);

// Secretariat routes
router.get('/', auth, roleGuard('secretariat', 'admin'), getAllCases);
router.put('/:id/assign', auth, roleGuard('secretariat'), assignCase);

// Shared routes
router.get('/:id', auth, getCaseById);

module.exports = router;
