const crypto = require('crypto');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 'Please add a valid email'],
  },

  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'please add a password'],
    minLength: 6,
    select: false,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10); // the more salt the more havier on your computer
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT
userSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.isCorrectPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Generate and Hash
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // hash token
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire
  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
