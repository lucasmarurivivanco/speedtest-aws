const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Test data directory
const TEST_DATA_DIR = path.join(__dirname, '../../test-data');

// Ensure test data directory exists
(async () => {
  try {
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating test data directory:', error);
  }
})();

// 1. Simple latency test
router.get('/ping', (req, res) => {
  const startTime = Date.now();
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime
  });
});

// 2. I/O File operations test
router.post('/io', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { operation = 'both', size = 1 } = req.body;
    const dataSize = size * 1024; // KB to bytes
    const fileName = `test-${Date.now()}.tmp`;
    const filePath = path.join(TEST_DATA_DIR, fileName);
    
    let writeTime = 0;
    let readTime = 0;
    
    if (operation === 'write' || operation === 'both') {
      const writeStart = Date.now();
      const data = Buffer.alloc(dataSize, 'a');
      await fs.writeFile(filePath, data);
      writeTime = Date.now() - writeStart;
    }
    
    if (operation === 'read' || operation === 'both') {
      const readStart = Date.now();
      await fs.readFile(filePath);
      readTime = Date.now() - readStart;
    }
    
    // Cleanup
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    const totalTime = Date.now() - startTime;
    
    res.json({
      operation,
      size: `${size}KB`,
      writeTime,
      readTime,
      totalTime,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'I/O operation failed',
      message: error.message,
      responseTime: Date.now() - startTime
    });
  }
});

// 3. Processing with I/O (simulate image processing)
router.post('/processing', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { iterations = 100 } = req.body;
    
    // Simulate image processing: create data, process it, write result
    const processStart = Date.now();
    
    // Generate fake image data (1MB)
    const imageData = Buffer.alloc(1024 * 1024, Math.floor(Math.random() * 256));
    
    // Simulate processing (some CPU work + I/O)
    let processedData = Buffer.alloc(imageData.length);
    for (let i = 0; i < imageData.length; i++) {
      // Simple transformation
      processedData[i] = (imageData[i] + 50) % 256;
    }
    
    const processingTime = Date.now() - processStart;
    
    // Write result
    const writeStart = Date.now();
    const fileName = `processed-${Date.now()}.tmp`;
    const filePath = path.join(TEST_DATA_DIR, fileName);
    await fs.writeFile(filePath, processedData);
    const writeTime = Date.now() - writeStart;
    
    // Cleanup
    await fs.unlink(filePath);
    
    const totalTime = Date.now() - startTime;
    
    res.json({
      processingTime,
      writeTime,
      totalTime,
      dataSize: '1MB',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Processing failed',
      message: error.message,
      responseTime: Date.now() - startTime
    });
  }
});

// 4. Database simulation (in-memory operations)
router.post('/database', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { operations = 100 } = req.body;
    
    // Create fake database
    const db = [];
    for (let i = 0; i < 10000; i++) {
      db.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        data: Math.random().toString(36).repeat(10)
      });
    }
    
    const createTime = Date.now() - startTime;
    
    // Perform queries
    const queryStart = Date.now();
    let results = [];
    
    for (let i = 0; i < operations; i++) {
      const searchId = Math.floor(Math.random() * 10000);
      const result = db.find(item => item.id === searchId);
      if (result) results.push(result);
    }
    
    const queryTime = Date.now() - queryStart;
    
    // Simulate write operations
    const writeStart = Date.now();
    for (let i = 0; i < operations / 10; i++) {
      db.push({
        id: 10000 + i,
        name: `New User ${i}`,
        email: `newuser${i}@example.com`,
        data: Math.random().toString(36).repeat(10)
      });
    }
    const writeOpsTime = Date.now() - writeStart;
    
    const totalTime = Date.now() - startTime;
    
    res.json({
      operations,
      createTime,
      queryTime,
      writeOpsTime,
      totalTime,
      resultsFound: results.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Database operation failed',
      message: error.message,
      responseTime: Date.now() - startTime
    });
  }
});

// Batch test endpoint (multiple tests at once)
router.post('/batch', async (req, res) => {
  const startTime = Date.now();
  const { tests = ['ping', 'io', 'processing', 'database'], count = 1 } = req.body;
  
  const results = {
    tests: [],
    summary: {
      totalTests: tests.length * count,
      totalTime: 0
    }
  };
  
  for (const test of tests) {
    for (let i = 0; i < count; i++) {
      try {
        let result;
        
        switch (test) {
          case 'ping':
            result = { message: 'pong', responseTime: 1 };
            break;
          case 'io':
            const data = Buffer.alloc(1024, 'a');
            const ioStart = Date.now();
            const fileName = `batch-${Date.now()}-${i}.tmp`;
            const filePath = path.join(TEST_DATA_DIR, fileName);
            await fs.writeFile(filePath, data);
            await fs.readFile(filePath);
            await fs.unlink(filePath);
            result = { responseTime: Date.now() - ioStart };
            break;
          default:
            result = { responseTime: 0 };
        }
        
        results.tests.push({
          type: test,
          iteration: i + 1,
          ...result
        });
      } catch (error) {
        results.tests.push({
          type: test,
          iteration: i + 1,
          error: error.message
        });
      }
    }
  }
  
  results.summary.totalTime = Date.now() - startTime;
  
  res.json(results);
});

module.exports = router;
