const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

// POST /api/polls — Secretariat creates a poll
exports.createPoll = async (req, res) => {
  try {
    const { question, options, closesAt } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({ message: 'At least 2 options required' });
    }

    const poll = await Poll.create({
      question,
      options,
      closesAt,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Poll created', poll });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create poll', error: error.message });
  }
};

// GET /api/polls — Get all polls
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Get vote counts for each poll
    const pollsWithVotes = await Promise.all(
      polls.map(async (poll) => {
        const votes = await Vote.find({ poll: poll._id });
        const voteCounts = new Array(poll.options.length).fill(0);
        votes.forEach(v => {
          if (v.selectedOption < voteCounts.length) {
            voteCounts[v.selectedOption]++;
          }
        });

        // Check if current user has voted (if req.user exists)
        let userVote = null;
        if (req.user) {
          const existingVote = await Vote.findOne({ poll: poll._id, user: req.user._id });
          userVote = existingVote ? existingVote.selectedOption : null;
        }

        return {
          ...poll.toObject(),
          voteCounts,
          totalVotes: votes.length,
          userVote
        };
      })
    );

    res.json({ polls: pollsWithVotes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch polls', error: error.message });
  }
};

// POST /api/polls/:id/vote — Staff votes on a poll
exports.vote = async (req, res) => {
  try {
    const { selectedOption } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: 'Poll is closed' });
    }

    if (poll.closesAt && new Date() > poll.closesAt) {
      return res.status(400).json({ message: 'Poll has expired' });
    }

    if (selectedOption < 0 || selectedOption >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option selected' });
    }

    // Check for existing vote
    const existingVote = await Vote.findOne({ poll: req.params.id, user: req.user._id });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }

    await Vote.create({
      poll: req.params.id,
      user: req.user._id,
      selectedOption
    });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }
    res.status(500).json({ message: 'Failed to vote', error: error.message });
  }
};

// GET /api/polls/:id/results — Get poll results
exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('createdBy', 'name');
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const votes = await Vote.find({ poll: req.params.id });
    const voteCounts = new Array(poll.options.length).fill(0);
    votes.forEach(v => {
      if (v.selectedOption < voteCounts.length) {
        voteCounts[v.selectedOption]++;
      }
    });

    res.json({
      poll: poll.toObject(),
      voteCounts,
      totalVotes: votes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch results', error: error.message });
  }
};
