const Case = require('../models/Case');

// GET /api/analytics/overview — Summary stats
exports.getOverview = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const newCases = await Case.countDocuments({ status: 'New' });
    const inProgress = await Case.countDocuments({ status: { $in: ['Assigned', 'In Progress'] } });
    const resolved = await Case.countDocuments({ status: 'Resolved' });
    const escalated = await Case.countDocuments({ status: 'Escalated' });
    const pending = await Case.countDocuments({ status: 'Pending' });

    res.json({
      overview: { totalCases, newCases, inProgress, resolved, escalated, pending }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overview', error: error.message });
  }
};

// GET /api/analytics/department — Cases by department
exports.getByDepartment = async (req, res) => {
  try {
    const data = await Case.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ departments: data.map(d => ({ department: d._id || 'Unspecified', count: d.count })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
};

// GET /api/analytics/category — Cases by category
exports.getByCategory = async (req, res) => {
  try {
    const data = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories: data.map(d => ({ category: d._id, count: d.count })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
};

// GET /api/analytics/status — Cases by status
exports.getByStatus = async (req, res) => {
  try {
    const data = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ statuses: data.map(d => ({ status: d._id, count: d.count })) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
};

// GET /api/analytics/hotspots — Departments with 5+ similar issues
exports.getHotspots = async (req, res) => {
  try {
    const data = await Case.aggregate([
      { $group: { _id: { department: '$department', category: '$category' }, count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      hotspots: data.map(d => ({
        department: d._id.department || 'Unspecified',
        category: d._id.category,
        count: d.count
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hotspots', error: error.message });
  }
};
