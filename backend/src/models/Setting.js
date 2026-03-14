const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'security'
  },
  minPasswordLength: { type: Number, default: 6 },
  saltRounds: { type: Number, default: 10 },
  jwtExpiry: { type: String, default: '24h' },
  maxLoginAttempts: { type: Number, default: 5 },
  sessionTimeout: { type: Number, default: 60 },
  corsEnabled: { type: Boolean, default: true },
  rateLimitEnabled: { type: Boolean, default: false },
  rateLimitRequests: { type: Number, default: 100 },
  rateLimitWindow: { type: Number, default: 15 },
  enforceStrongPassword: { type: Boolean, default: false },
  twoFactorAuth: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
