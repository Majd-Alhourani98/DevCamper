const { get } = require('../routes/authRouter');
const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// Function to Get All Users
// Method: GET /api/v1/users
// Access: private/Admin
const getUsers = catchAsync(async (req, res, next) => {
  res.status(200).json(res.response);
});

// Function to Get Single Users
// Method: GET /api/v1/users
// Access: private/Admin
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Function to create new user
// Method: POST /api/v1/users
// Access: private/Admin
const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: { user },
  });
});

// Function to update  user
// Method: PUT /api/v1/users/:id
// Access: private/Admin
const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Function to delete  user
// Method: delete /api/v1/users/:id
// Access: private/Admin
const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id, req.body);

  res.status(204).json({
    success: true,
    data: null,
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
