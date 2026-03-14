const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Admin only
router.get('/', auth, roleGuard('admin'), getSettings);
router.put('/', auth, roleGuard('admin'), updateSettings);

module.exports = router;
