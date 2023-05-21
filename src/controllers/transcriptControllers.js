const Transcript = require("../models/transcriptModel");
const Course = require("../models/courseModel");

const gpaCalculater = require("../utils/gpaCalculater");

exports.createTranscript = async (req, res) => {
  const { studentId, year, semester, courses } = req.body;

  try {
    // Create a new transcript instance
    const transcript = await new Transcript({
      studentId,
      year,
      semester,
      courses,
      gpa: 0, // Initialize with a default value
      cgpa: 0, // Initialize with a default value
    }).populate({
      path: "courses.course",
      model: "Course",
    });

    transcript.gpa = await gpaCalculater.calculateGPA(transcript.courses);

    //Implement Logic for calculating CGPA
    const oldTranscripts = await Transcript.find({
      studentId: studentId,
      year: { $lte: year },
    }).sort({ year: -1 });

    const coursesTaken = [];

    if (oldTranscripts.length === 0) {
      transcript.cgpa = transcript.gpa;
    } else {
      oldTranscripts.push(transcript);
      for (const transcript of oldTranscripts) {
        await transcript.populate({
          path: "courses.course",
          model: "Course",
        });

        for (const courseEntry of transcript.courses) {
          coursesTaken.push(courseEntry);
        }
      }
      transcript.cgpa = await gpaCalculater.calculateGPA(coursesTaken);
    }

    // Save the transcript to the database
    await transcript.save();

    res.status(201).json({ transcript });
  } catch (error) {
    res.status(500).json({ message: "Failed to create transcript", error });
  }
};
