const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  role: {
    type: String,
    enum: ["admin", "staff", "student"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
