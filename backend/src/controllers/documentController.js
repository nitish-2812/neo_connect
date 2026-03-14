const MeetingDocument = require('../models/MeetingDocument');

// POST /api/documents/minutes — Upload meeting minutes
exports.uploadMinutes = async (req, res) => {
  try {
    const { title, description, quarter } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const doc = await MeetingDocument.create({
      title,
      description,
      quarter,
      filePath: req.file.filename,
      uploadedBy: req.user._id
    });

    res.status(201).json({ message: 'Meeting minutes uploaded', document: doc });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload', error: error.message });
  }
};

// GET /api/documents/minutes — List all meeting minutes
exports.getMinutes = async (req, res) => {
  try {
    const { quarter } = req.query;
    const filter = {};
    if (quarter) filter.quarter = quarter;

    const documents = await MeetingDocument.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
  }
};
