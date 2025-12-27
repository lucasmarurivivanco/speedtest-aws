import axios from 'axios';

// Get API endpoints
const getEndpoint = (baseUrl, testType) => {
  const endpoints = {
    ping: '/api/test/ping',
    io: '/api/test/io',
    processing: '/api/test/processing',
    database: '/api/test/database',
  };
  return `${baseUrl}${endpoints[testType]}`;
};

// Run a single test request
export const runSingleTest = async (url, testType) => {
  const startTime = Date.now();
  
  try {
    const endpoint = getEndpoint(url, testType);
    
    if (testType === 'ping') {
      await axios.get(endpoint, { timeout: 10000 });
    } else {
      await axios.post(endpoint, {}, { timeout: 30000 });
    }
    
    const responseTime = Date.now() - startTime;
    return { success: true, time: responseTime };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return { 
      success: false, 
      time: responseTime,
      error: error.message 
    };
  }
};

// Run test for a single server
export const runServerTest = async (serverUrl, testType, requestCount, onProgress) => {
  const times = [];
  let errorCount = 0;
  let lastError = null;

  for (let i = 0; i < requestCount; i++) {
    const result = await runSingleTest(serverUrl, testType);
    
    if (result.success) {
      times.push(result.time);
    } else {
      errorCount++;
      lastError = result.error;
      // Still add the time even on error to show how long it took to fail
      times.push(result.time);
    }
    
    if (onProgress) {
      const progress = ((i + 1) / requestCount) * 100;
      onProgress(progress);
    }
  }

  return {
    times,
    errorCount,
    error: errorCount > 0 ? lastError : null,
  };
};

// Run test for both servers
export const runTest = async (config, onProgress) => {
  const { server1, server2, testType, requestCount } = config;
  
  const results = {
    server1: { times: [], errorCount: 0, error: null },
    server2: { times: [], errorCount: 0, error: null },
  };

  // Test server 1
  if (server1.enabled && server1.url) {
    results.server1 = await runServerTest(
      server1.url,
      testType,
      requestCount,
      (progress) => {
        if (onProgress) onProgress(Math.floor(progress / 2));
      }
    );
  }

  // Test server 2
  if (server2.enabled && server2.url) {
    results.server2 = await runServerTest(
      server2.url,
      testType,
      requestCount,
      (progress) => {
        if (onProgress) onProgress(50 + Math.floor(progress / 2));
      }
    );
  }

  if (onProgress) onProgress(100);

  return results;
};

// Calculate percentile
const percentile = (arr, p) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (lower === upper) {
    return sorted[lower];
  }
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

// Calculate metrics from response times
export const calculateMetrics = (times) => {
  if (!times || times.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      p50: 0,
      p95: 0,
      p99: 0,
    };
  }

  const sum = times.reduce((acc, time) => acc + time, 0);
  
  return {
    average: sum / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    p50: percentile(times, 50),
    p95: percentile(times, 95),
    p99: percentile(times, 99),
  };
};
