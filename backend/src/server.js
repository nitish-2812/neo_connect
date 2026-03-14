require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const startEscalationJob = require('./utils/escalation');

// Import routes
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const pollRoutes = require('./routes/polls');
const documentRoutes = require('./routes/documents');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const start = async () => {
  await connectDB();
  startEscalationJob();
  
  app.listen(PORT, () => {
    console.log(`🚀 NeoConnect Backend running on http://localhost:${PORT}`);
    console.log(`📋 API endpoints:`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/cases`);
    console.log(`   POST /api/cases`);
    console.log(`   GET  /api/polls`);
    console.log(`   GET  /api/analytics/overview`);
    console.log(`   GET  /api/health`);
  });
};

start();
