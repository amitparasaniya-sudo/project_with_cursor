require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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
  console.error(err.stack);
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
    console.log(`Server is running on port ${PORT}__________`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
  });
}