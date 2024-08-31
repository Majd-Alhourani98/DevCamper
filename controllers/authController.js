const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

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
  sendTokenResponse(user, 200, res);
});

// Function to Log in users
// Method: POST /api/v1/auth/login
// Access: Public
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email & password
  if (!email || !password) return next(new appError(`Please provide an email and password`, 400));

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new appError('invalid credentials', 401));

  // check if password maches
  const isCorrectPassword = await user.isCorrectPassword(password);

  if (!isCorrectPassword) return next(new appError('invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.signToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;

  res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};

// PROTECT ROUTE MIDDLEWARE: you can store it in middlewae folder
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.token) token = req.cookies.token;

  // check if the token is exists
  if (!token) return next(new appError('Not authorize to access thie route', 401));

  // verify token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.log(err);
    return next(new appError('Not authorize to access thie route', 401));
  }
});

// Grant access to specific roles

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new appError(`User role ${req.user.role} is not authorized to access thie route`, 403)
      );

    next();
  };
};

// Function to Get current logged in user
// Method: POST /api/v1/auth/me
// Access: private
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = {
  register,
  login,
  protect,
  getMe,
  authorize,
};

// to store a token in postman
// pm.environment.set('jwt', pm.response.json().token);
