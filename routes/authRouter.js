const express = require('express');

const {
  register,
  login,
  getMe,
  protect,
  forgetPassword,
  resetPassword,
  updateData,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/update-data', protect, updateData);
router.put('/update-password', protect, updatePassword);

router.get('/me', protect, getMe);

module.exports = router;
