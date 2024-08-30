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

// Function to Log in users
// Method: POST /api/v1/auth/login
// Access: Public
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email & password
  if (!email || !password)
    return next(new appError(`Please provide an email and password`, 400));

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new appError('invalid credentials', 401));

  // check if password maches
  const isCorrectPassword = await user.isCorrectPassword(password);

  if (!isCorrectPassword) return next(new appError('invalid credentials', 401));

  // Create Token
  const token = user.signToken();

  res.status(200).json({
    success: true,
    token,
  });
});

module.exports = {
  register,
  login,
};
