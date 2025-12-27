const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const REGION = process.env.REGION || 'unknown';

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Import routes
const testRoutes = require('./routes/testRoutes');

// Routes
app.use('/api/test', testRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    region: REGION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    region: REGION,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: {
      total: Math.round(require('os').totalmem() / 1024 / 1024),
      free: Math.round(require('os').freemem() / 1024 / 1024)
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Region: ${REGION}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
