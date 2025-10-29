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

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

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
module.exports = app;

// Start server only if not in cluster mode
if (!module.parent) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`API Base URL: http://localhost:${PORT}/api`);
  });
}

// Remove debug date logs


const filePath = path.join(__dirname,'middleware','file.txt')

console.log(filePath);


const readfile  = fs.createReadStream(filePath,{encoding:"utf-8"})



readfile.on("data",(chunk)=>{
  console.log("chunk",chunk)
})

readfile.on("end",()=>{
  console.log('file read successfully');
  
})

readfile.on('error', (err) => {
  console.error('Error reading file:', err.message);
});
const write  = fs.createWriteStream('output.txt',{flags:'a'})

readfile.pipe(write)