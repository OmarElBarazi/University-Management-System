const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  courses: [
    {
      course: {
        type: String,
        required: true,
      },
      grade: {
        type: String,
        required: true,
      },
    },
  ],
  gpa: { type: String, required: true },
  cgpa: { type: String, required: true },
});

const Transcript = mongoose.model("Transcript", transcriptSchema);

module.exports = Transcript;
