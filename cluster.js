const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const app = require('./app');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    
    // Restart worker if it died unexpectedly
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log('Starting a new worker...');
      cluster.fork();
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down gracefully...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });

  // Handle worker disconnect
  cluster.on('disconnect', (worker) => {
    console.log(`Worker ${worker.process.pid} disconnected`);
  });

  // Handle worker online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

} else {
  // Worker processes
  const PORT = process.env.PORT || 3000;
  
  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });

  // Graceful shutdown for workers
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} received SIGTERM, shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`Worker ${process.pid} uncaught exception:`, err);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Worker ${process.pid} unhandled rejection at:`, promise, 'reason:', reason);
    process.exit(1);
  });
}
