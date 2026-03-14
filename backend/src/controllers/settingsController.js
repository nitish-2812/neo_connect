const Setting = require('../models/Setting');

// GET /api/settings — Retrieve current security settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'security' });
    if (!settings) {
      settings = await Setting.create({ key: 'security' });
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/settings — Update security settings
exports.updateSettings = async (req, res) => {
  try {
    const allowedFields = [
      'minPasswordLength', 'saltRounds', 'jwtExpiry', 'maxLoginAttempts',
      'sessionTimeout', 'corsEnabled', 'rateLimitEnabled', 'rateLimitRequests',
      'rateLimitWindow', 'enforceStrongPassword', 'twoFactorAuth'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let settings = await Setting.findOneAndUpdate(
      { key: 'security' },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
