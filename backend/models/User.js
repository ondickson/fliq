const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // store image path or URL
    default: '',  // can be blank initially
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
