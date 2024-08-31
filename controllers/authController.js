const { promisify } = require('util');
const crypto = require('crypto');

const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const sendEmail = require('./../utils/sendEmail');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

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
  });

  user.password = undefined;
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

// Function to Forget password
// Method: POST /api/v1/auth/forget-password
// Access: public
const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return new appError('There is no user with that email', 404);

  // Get reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
  const message = `You are receiving this email becuase you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(new appError('Email could not be send', 500));
  }
});

// Function to rest password
// Method: PUT /api/v1/auth/reset-password/:token
// Access: public
const resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.params.token);
  // get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user) next(new appError('Invalid token', 400));

  // Set new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
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

// Function to Update user data
// Method: Put /api/v1/auth/update-data
// Access: private
const updateData = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Function to Update users's password
// Method: Put /api/v1/auth/update-password
// Access: private
const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current Passowrd
  if (!(await user.isCorrectPassword(req.body.currentPassword)))
    return next(new appError('Password is incorrect', 401));

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

module.exports = {
  register,
  login,
  protect,
  getMe,
  authorize,
  forgetPassword,
  resetPassword,
  updateData,
  updatePassword,
};

// to store a token in postman
// pm.environment.set('jwt', pm.response.json().token);
