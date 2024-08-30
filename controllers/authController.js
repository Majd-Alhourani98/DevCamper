const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// Function to register users
// Method: POST /api/v1/auth/register
// Access: Public
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create Token
  const token = user.signToken();

  res.status(200).json({
    success: true,
    token,
  });
});

module.exports = {
  register,
};
