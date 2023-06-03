const Transcript = require("../models/transcriptModel");
const Course = require("../models/courseModel");

const rsaSecurity = require("../encryption/rsa");
const desSecurity = require("../encryption/des");

const gpaCalculater = require("../utils/gpaCalculater");

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

    const populatedCourses = [];

    for (const entry of transcript.courses) {
      const coursePopulated = await Course.findById(entry.course);
      populatedCourses.push({ course: coursePopulated, grade: entry.grade });
    }

    transcript.gpa = await gpaCalculater.calculateGPA(populatedCourses);

    // Implement Logic for calculating CGPA
    const oldTranscripts = await Transcript.find({
      studentId: studentId,
      year: { $lte: year },
    }).sort({ year: -1 });

    const coursesTaken = [];

    if (oldTranscripts.length === 0) {
      transcript.cgpa = transcript.gpa;
    } else {
      for (const transcript of oldTranscripts) {
        for (const entry of transcript.courses) {
          const decryptedCourse = JSON.parse(
            desSecurity.decryptWithDES(entry.course)
          );
          const decryptedGrade = desSecurity.decryptWithDES(entry.grade);

          coursesTaken.push({
            course: await Course.findById(decryptedCourse),
            grade: decryptedGrade,
          });
        }
      }
      for (const entry of transcript.courses) {
        const coursePopulated = await Course.findById(entry.course);
        coursesTaken.push({ course: coursePopulated, grade: entry.grade });
      }

      transcript.cgpa = await gpaCalculater.calculateGPA(coursesTaken);
    }

    // Apply RSA encryption to GPA and CGPA
    const encryptedGPA = rsaSecurity.encryptWithPublicKey(
      transcript.gpa.toString()
    );
    const encryptedCGPA = rsaSecurity.encryptWithPublicKey(
      transcript.cgpa.toString()
    );

    //Apply DES encryption To Course and Grade
    const encryptedCourses = transcript.courses.map((entry) => ({
      course: desSecurity.encryptWithDES(JSON.stringify(entry.course)),
      grade: desSecurity.encryptWithDES(entry.grade.toString()),
    }));

    transcript.gpa = encryptedGPA;
    transcript.cgpa = encryptedCGPA;
    transcript.courses = encryptedCourses;

    // Save the transcript to the database
    await transcript.save();

    res.status(201).json({ transcript });
  } catch (error) {
    res.status(500).json({ message: "Failed to create transcript", error });
  }
};

// Controller to find all transcripts by student ID and decrypt the GPA fields
exports.getTranscripts = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Find all transcripts by student ID
    const transcripts = await Transcript.find({ studentId });

    // Decrypt the GPA fields using RSA private key
    const decryptedTranscripts = [];

    for (const transcript of transcripts) {
      const decryptedGpa = rsaSecurity.decryptWithPrivateKey(transcript.gpa);
      const decryptedCgpa = rsaSecurity.decryptWithPrivateKey(transcript.cgpa);
      const decryptedCourses = transcript.courses.map((entry) => ({
        course: JSON.parse(desSecurity.decryptWithDES(entry.course)),
        grade: desSecurity.decryptWithDES(entry.grade),
      }));

      const populatedDecryptedCourses = [];

      for (const entry of decryptedCourses) {
        const populatedCourse = await Course.findById(entry.course);
        populatedDecryptedCourses.push({
          course: populatedCourse,
          grade: entry.grade,
        });
      }

      // Create a new transcript object with decrypted GPA and CGPA
      const decryptedTranscript = {
        _id: transcript._id,
        studentId: transcript.studentId,
        year: transcript.year,
        semester: transcript.semester,
        courses: populatedDecryptedCourses,
        gpa: decryptedGpa,
        cgpa: decryptedCgpa,
      };

      decryptedTranscripts.push(decryptedTranscript);
    }

    // Send the decrypted transcripts as a JSON response
    res.status(200).json(decryptedTranscripts);
  } catch (error) {
    console.error("Error finding transcripts:", error);
    res.status(500).json({ error: "Failed to retrieve transcripts" });
  }
};

//Get Courses Taken By student with grades
exports.getTakenCoursesForStudent = async (req, res) => {
  const studentId = req.params.id;
  try {
    const transcripts = await Transcript.find({ studentId });

    const courses = [];
    for (const transcript of transcripts) {
      for (const entry of transcript.courses) {
        const decryptedCourse = JSON.parse(
          desSecurity.decryptWithDES(entry.course)
        );
        const decryptedPopulatedCourse = await Course.findById(decryptedCourse);
        courses.push(decryptedPopulatedCourse);
      }
    }
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error finding Courses:", error);
    res.status(500).json({ error: "Failed to retrieve taken courses" });
  }
};
