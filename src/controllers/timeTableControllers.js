const TimeTable = require("../models/timeTableModel");
const Course = require("../models/courseModel");

const desSecurity = require("../encryption/des");

exports.getTimeTableByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the timetable by studentId
    const timetable = await TimeTable.findOne({ studentId });

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const decryptedSchedule = [];

    // Decrypt course data in the schedule and retrieve course information
    for (const entry of timetable.schedule) {
      const decryptedCourseId = desSecurity.decryptWithDES(entry.course);
      const courseId = JSON.parse(decryptedCourseId);

      // Retrieve course information using the decrypted course ID
      const course = await Course.findById(courseId);

      if (course) {
        decryptedSchedule.push(course);
      }
    }

    const decryptedTimetable = {
      studentId: timetable.studentId,
      schedule: decryptedSchedule,
      confirm: timetable.confirm,
    };

    res.status(200).json(decryptedTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { coursesToAdd, coursesToRemove } = req.body;

    const timetable = await TimeTable.findOne({ studentId });

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    let decryptedSchedule = [];
    // Decrypt course data in the schedule
    if (timetable.schedule.length > 0) {
      decryptedSchedule = timetable.schedule.map((entry) => {
        const decryptedCourse = desSecurity.decryptWithDES(entry.course);
        return { course: JSON.parse(decryptedCourse) };
      });
    }

    // Remove courses from schedule
    if (coursesToRemove && coursesToRemove.length > 0) {
      const updatedSchedule = decryptedSchedule.filter(
        (entry) => !coursesToRemove.includes(entry.course)
      );

      timetable.schedule = updatedSchedule.map((entry) => ({
        course: desSecurity.encryptWithDES(JSON.stringify(entry.course)),
      }));
    }

    // Add courses to schedule
    if (coursesToAdd && coursesToAdd.length > 0) {
      for (const courseId of coursesToAdd) {
        const courseExists = decryptedSchedule.some(
          (entry) => entry.course === courseId
        );

        if (!courseExists) {
          const course = await Course.findById(courseId);

          if (course) {
            timetable.schedule.push({
              course: desSecurity.encryptWithDES(JSON.stringify(course._id)),
            });
          }
        }
      }
    }

    // Save the updated timetable
    const updatedTimeTable = await timetable.save();

    res.status(200).json({ updatedTimeTable });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateConfirmStatus = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    const { confirm } = req.body;

    const timetable = await TimeTable.findById(timetableId);

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    timetable.confirm = confirm;
    const updatedTimetable = await timetable.save();

    res.status(200).json({ updatedTimetable });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
