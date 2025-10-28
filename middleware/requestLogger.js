const crypto = require('crypto');

// Request tracking middleware
const requestLogger = (req, res, next) => {
  // Generate unique request ID
  const requestId = crypto.randomBytes(16).toString('hex');
  
  // Get worker information
  const workerInfo = {
    pid: process.pid,
    workerId: `worker-${process.pid}`
  };

  // Add request ID and worker info to request object
  req.requestId = requestId;
  req.workerInfo = workerInfo;

  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Worker-PID', workerInfo.pid);
  res.setHeader('X-Worker-ID', workerInfo.workerId);

  // Log request details with worker info
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${requestId.substring(0, 8)}...] [Worker-${workerInfo.pid}] ${req.method} ${req.originalUrl}`);

  // Override res.json to include request info
  const originalJson = res.json;
  res.json = function(data) {
    // Add request tracking info to response
    if (data && typeof data === 'object') {
      data.requestInfo = {
        requestId: requestId,
        workerPid: workerInfo.pid,
        workerId: workerInfo.workerId,
        timestamp: timestamp
      };
    }
    
    // Log response with worker info
    console.log(`[${timestamp}] [${requestId.substring(0, 8)}...] [Worker-${workerInfo.pid}] Status: ${res.statusCode}`);
    
    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
