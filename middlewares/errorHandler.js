const appError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad Object ID
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new appError(message, 404);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate field value: ${Object.values(error.keyValue)[0]}`;
    error = new appError(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new appError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;

// Mongoose Error
// 1. CastError ==> IDs
// 2. Duplicate keys ==> code 11000
// 3. Validation Error
