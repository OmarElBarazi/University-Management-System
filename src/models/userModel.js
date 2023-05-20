const mongoose = require("mongoose");
const userPreFunctions = require("../pre-functions/userPreFunctions");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
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
  studentId: {
    type: Number,
    unique: true,
    sparse: true,
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: {
    type: String,
    required: true,
    match: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/,
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    enum: ["fall", "spring"],
    required: true,
  },
});

userSchema.pre("save", userPreFunctions.hashPassword);
userSchema.pre("save", userPreFunctions.generateStudentId);

const User = mongoose.model("User", userSchema);

module.exports = User;
