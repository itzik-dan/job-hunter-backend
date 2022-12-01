const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
