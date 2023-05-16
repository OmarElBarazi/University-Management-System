const Course = require("../models/courseModel");

exports.createCourse = async (req, res) => {
  try {
    const newCourse = new Course({
      code: req.body.code,
      description: req.body.description,
      credits: req.body.credits,
      instructor: req.body.instructor,
      day: req.body.day,
      time: req.body.time,
      available: req.body.available,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const updateObject = req.body;

    const course = await Course.findById(courseId);

    // Update specific fields from the updateObject
    if (updateObject.code) {
      course.code = updateObject.code;
    }
    if (updateObject.description) {
      course.description = updateObject.description;
    }
    if (updateObject.credits) {
      course.credits = updateObject.credits;
    }
    if (updateObject.instructor) {
      course.instructor = updateObject.instructor;
    }
    if (updateObject.available !== undefined) {
      course.available = updateObject.available;
    }
    if (updateObject.day) {
      course.day = updateObject.day;
    }
    if (updateObject.time) {
      course.time = updateObject.time;
    }

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    const availableCourses = await Course.find({ available: true });
    res.status(200).json(availableCourses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
