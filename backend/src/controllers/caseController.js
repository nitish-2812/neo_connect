const Case = require('../models/Case');
const generateTrackingId = require('../utils/trackingId');
const path = require('path');

// POST /api/cases — Staff submits a new complaint
exports.createCase = async (req, res) => {
  try {
    const { title, description, category, severity, department, location, isAnonymous } = req.body;

    const trackingId = await generateTrackingId();
    
    const attachments = req.files ? req.files.map(f => f.filename) : [];

    const newCase = await Case.create({
      trackingId,
      title,
      description,
      category,
      severity,
      department,
      location,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      submittedBy: req.user._id,
      attachments
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      trackingId: newCase.trackingId,
      case: newCase
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit complaint', error: error.message });
  }
};

// GET /api/cases — Secretariat/Admin gets all cases
exports.getAllCases = async (req, res) => {
  try {
    const { status, department, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (category) filter.category = category;

    const cases = await Case.find(filter)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.author', 'name email')
      .sort({ createdAt: -1 });

    // Hide submitter info for anonymous cases
    const sanitizedCases = cases.map(c => {
      const obj = c.toObject();
      if (obj.isAnonymous) {
        obj.submittedBy = { name: 'Anonymous', email: 'hidden', department: obj.department };
      }
      return obj;
    });

    res.json({ cases: sanitizedCases });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cases', error: error.message });
  }
};

// GET /api/cases/my — Staff gets own complaints
exports.getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ submittedBy: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('notes.author', 'name')
      .sort({ createdAt: -1 });

    res.json({ cases });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your cases', error: error.message });
  }
};

// GET /api/cases/resolved — All resolved cases (for Public Hub)
exports.getResolvedCases = async (req, res) => {
  try {
    const cases = await Case.find({ status: 'Resolved' })
      .populate('assignedTo', 'name email')
      .populate('notes.author', 'name')
      .sort({ resolvedAt: -1, updatedAt: -1 });

    const sanitizedCases = cases.map(c => {
      const obj = c.toObject();
      if (obj.isAnonymous) {
        obj.submittedBy = { name: 'Anonymous', email: 'hidden', department: obj.department };
      }
      return obj;
    });

    res.json({ cases: sanitizedCases });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resolved cases', error: error.message });
  }
};

// GET /api/cases/assigned — Case Manager gets assigned cases
exports.getAssignedCases = async (req, res) => {
  try {
    const cases = await Case.find({ assignedTo: req.user._id })
      .populate('submittedBy', 'name email department')
      .populate('notes.author', 'name')
      .sort({ createdAt: -1 });

    const sanitizedCases = cases.map(c => {
      const obj = c.toObject();
      if (obj.isAnonymous) {
        obj.submittedBy = { name: 'Anonymous', email: 'hidden', department: obj.department };
      }
      return obj;
    });

    res.json({ cases: sanitizedCases });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assigned cases', error: error.message });
  }
};

// GET /api/cases/:id — Get single case
exports.getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.author', 'name email role');

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const obj = caseItem.toObject();
    if (obj.isAnonymous && req.user.role === 'case-manager') {
      obj.submittedBy = { name: 'Anonymous', email: 'hidden', department: obj.department };
    }

    res.json({ case: obj });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch case', error: error.message });
  }
};

// PUT /api/cases/:id/assign — Secretariat assigns a Case Manager
exports.assignCase = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const caseItem = await Case.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        assignedBy: req.user._id,
        status: 'Assigned',
        assignedAt: new Date()
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json({ message: 'Case assigned successfully', case: caseItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign case', error: error.message });
  }
};

// PUT /api/cases/:id/status — Case Manager updates status
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status, resolution } = req.body;
    const validStatuses = ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'Resolved') {
      updateData.resolvedAt = new Date();
      if (resolution) updateData.resolution = resolution;
    }

    const caseItem = await Case.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json({ message: 'Case status updated', case: caseItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// POST /api/cases/:id/notes — Add a note to a case
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;

    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    caseItem.notes.push({
      author: req.user._id,
      content
    });

    await caseItem.save();

    const updated = await Case.findById(req.params.id)
      .populate('notes.author', 'name email role');

    res.json({ message: 'Note added', case: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add note', error: error.message });
  }
};
