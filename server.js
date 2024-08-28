const morgan = require('morgan');
const express = require('express');
dotenv = require('dotenv');

const connectDB = require('./config/db');

// Load Environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Import routers
const bootcampRouter = require('./routes/bootcampRouter');

// Create express application
const app = express();

// Parse JSON body
app.use(express.json());

// Development Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
// Mount the routers
app.use('/api/v1/bootcamps', bootcampRouter);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err.message}`);
  server.close(() => process.exit(1));
});
