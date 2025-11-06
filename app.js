require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');
const fs =require("fs")
const path = require("path")
// Import database connection
const connectDB = require('./config/database');

// Import routes
const users = require('./routes/users');
console.log(/a/);

// console.log(/redisClient/,redisClient);

require('./config/queueProcessor');

// Connect to database
connectDB();
console.log(/reach line 22/);


const app = express();
const port = process.env.SERVER_PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the CRUD API!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users'
    }
  });
});

// Mount routes
app.use('/api/users', users);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { stack: err.stack, message: err.message,
    //  route: req.originalUrl 
  });
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Export app for clustering
console.log(/rech kibef e 68/);

// Start server only if not in cluster mode
// app.listen(port, () => {
  //   console.log(port);
  
//   logger.info(`Server is running on port ${port}`);
//     logger.info(`API Base URL: http://localhost:${port}/api`);
//   });

const server = app.listen(port)
.on('error', (error) => {
    logger.error('Error starting server:', error);
    // process.exit(1);
  })
  .on('listening', () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`API Base URL: http://localhost:${port}/api`);
  });
  
  const redisClient = require('./config/redis');
  
redisClient.on("connect",()=>{
  logger.info("Connected to Redis");
})

redisClient.connect()
module.exports = app;

// Remove debug date logs


const filePath = path.join(__dirname,'middleware','file.txt')

console.log(filePath);


// const readfile  = fs.createReadStream(filePath,{encoding:"utf-8"})



// readfile.on("data",(chunk)=>{
//   console.log("chunk",chunk)
// })

// readfile.on("end",()=>{
//   console.log('file read successfully');
  
// })

// readfile.on('error', (err) => {
//   console.error('Error reading file:', err.message);
// });
// const write  = fs.createWriteStream('output.txt',{flags:'a'})

// readfile.pipe(write)