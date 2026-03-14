const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  getOverview,
  getByDepartment,
  getByCategory,
  getByStatus,
  getHotspots
} = require('../controllers/analyticsController');

// All analytics routes are for secretariat and admin only
router.use(auth, roleGuard('secretariat', 'admin'));

router.get('/overview', getOverview);
router.get('/department', getByDepartment);
router.get('/category', getByCategory);
router.get('/status', getByStatus);
router.get('/hotspots', getHotspots);

module.exports = router;
