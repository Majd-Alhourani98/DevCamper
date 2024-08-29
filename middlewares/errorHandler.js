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

  console.log(err);
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
      error: error,
      stack: error.stack,
    });
  } else {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};

module.exports = errorHandler;

// Mongoose Error
// 1. CastError ==> IDs
// 2. Duplicate keys ==> code 11000
