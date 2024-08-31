const path = require('path');

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
dotenv = require('dotenv');

// Securtiy packges
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load Environment variables
dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Connect to database
connectDB();

// Import routers
const bootcampRouter = require('./routes/bootcampRouter');
const courseRouter = require('./routes/courseRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');

// Create express application
const app = express();

// Parse JSON body
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Development Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// File uploading middleware
app.use(fileUpload());

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimiter({
  windowMs: 10 * 60 * 10000,
  max: 2,
});

app.use(limiter);

// Prevent HTTP param polution
app.use(hpp());

// Mount the routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reviews', reviewRouter);

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
