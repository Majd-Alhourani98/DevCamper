const express = require('express');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');

const User = require('./../models/userModel');
const queryBuilder = require('./../middlewares/queryBuilder');
const { protect, authorize } = require('./../controllers/authController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/').get(queryBuilder(User), getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
