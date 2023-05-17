const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("../models/userModel");
const Course = require("../models/courseModel");

const timetableSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  schedule: [
    {
      course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    },
  ],
  confirm: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const TimeTable = mongoose.model("TimeTable", timetableSchema);

module.exports = TimeTable;
