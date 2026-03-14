const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  createPoll,
  getAllPolls,
  vote,
  getPollResults
} = require('../controllers/pollController');

// Secretariat creates polls
router.post('/', auth, roleGuard('secretariat'), createPoll);

// All authenticated users can view polls
router.get('/', auth, getAllPolls);

// Staff can vote
router.post('/:id/vote', auth, roleGuard('staff'), vote);

// Anyone authenticated can view results
router.get('/:id/results', auth, getPollResults);

module.exports = router;
