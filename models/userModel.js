const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
      'Please add a valid email',
    ],
  },

  role: {
    type: String,
    enum: ['user', 'publisher'],
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

const User = mongoose.model('User', userSchema);

module.exports = User;
