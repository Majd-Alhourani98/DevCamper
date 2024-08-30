const path = require('path');

const fileUpload = require('express-fileupload');
const express = require('express');
const morgan = require('morgan');
dotenv = require('dotenv');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load Environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Import routers
const bootcampRouter = require('./routes/bootcampRouter');
const courseRouter = require('./routes/courseRouter');

// Create express application
const app = express();

// Parse JSON body
app.use(express.json());

// Development Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// File uploading middleware
app.use(fileUpload());

// Mount the routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err.message}`);
  server.close(() => process.exit(1));
});

// 1. Create Error handler express middleware to pass error via the next function
// 2. Create a class to build an error object from it
