const Transcript = require("../models/transcriptModel");
const Course = require("../models/courseModel");

const gpaCalculater = require("../utils/gpaCalculater");
const cgpaCalculater = require("../utils/cgpaCalculater");

exports.createTranscript = async (req, res) => {
  const { studentId, year, semester, courses } = req.body;

  try {
    // Create a new transcript instance
    const transcript = new Transcript({
      studentId,
      year,
      semester,
      courses,
      gpa: 0, // Initialize with a default value
      cgpa: 0, // Initialize with a default value
    });

    const currentCourses = [];
    for (const courseEntry of transcript.courses) {
      const populatedCourse = await courseEntry
        .populate({ path: "courseEntry.course", model: "Course" })
        .exec();

      const courseInfo = {
        course: populatedCourse.course,
        grade: courseEntry.grade,
      };

      currentCourses.push(courseInfo);
    }
    transcript.gpa = await gpaCalculater.calculateGPA(currentCourses);

    //Implement Logic for calculating CGPA
    const oldTranscripts = await Transcript.find({
      studentId: studentId,
      year: { $lte: year },
    }).sort({ year: -1 });

    if (!oldTranscripts) {
      transcript.cgpa = transcript.gpa;
    } else {
      const coursesTaken = [];

      for (const transcript of oldTranscripts) {
        for (const courseEntry of transcript.courses) {
          const populatedCourseEntry = await courseEntry
            .populate({ path: "courseEntry.course", model: "Course" })
            .exec();

          const courseTaken = {
            course: populatedCourseEntry.course,
            grade: courseEntry.grade,
          };

          coursesTaken.push(courseTaken);
        }
      }

      transcript.cgpa = await cgpaCalculater.calculateCGPA(coursesTaken);
    }

    // Save the transcript to the database
    await transcript.save();

    res
      .status(201)
      .json({ message: "Transcript created successfully", transcript });
  } catch (error) {
    res.status(500).json({ message: "Failed to create transcript", error });
  }
};
