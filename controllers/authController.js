const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// Function to register users
// Method: POST /api/v1/auth/register
// Access: Public
const register = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true });
});

module.exports = {
  register,
};
