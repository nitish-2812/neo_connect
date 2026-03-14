const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  register,
  login,
  getMe,
  getAllUsers,
  updateUserRole,
  toggleUserStatus
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

// Admin and Secretariat routes
router.get('/users', auth, roleGuard('admin', 'secretariat'), getAllUsers);
router.put('/users/:id/role', auth, roleGuard('admin'), updateUserRole);
router.put('/users/:id/status', auth, roleGuard('admin'), toggleUserStatus);

module.exports = router;
