const express = require('express');

const {
  register,
  login,
  getMe,
  protect,
  forgetPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.get('/me', protect, getMe);

module.exports = router;
