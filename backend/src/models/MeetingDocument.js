const mongoose = require('mongoose');

const meetingDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quarter: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MeetingDocument', meetingDocumentSchema);
