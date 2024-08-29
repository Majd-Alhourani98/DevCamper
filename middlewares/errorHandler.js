const appError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad Object ID
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new appError(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;

// Mongoose Error
// 1. CastError ==> IDs
