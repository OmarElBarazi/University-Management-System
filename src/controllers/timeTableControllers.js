const TimeTable = require("../models/timeTableModel");
const Course = require("../models/courseModel");

exports.getTimeTableByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the timetable by studentId and populate the course information
    const timetable = await TimeTable.findOne({ studentId })
      .populate({
        path: "schedule.course",
        model: "Course",
      })
      .exec();

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.status(200).json(timetable);
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

    // Remove courses from schedule
    if (coursesToRemove && coursesToRemove.length > 0) {
      timetable.schedule = timetable.schedule.filter(
        (entry) => !coursesToRemove.includes(entry.course.toString())
      );
    }

    // Add courses to schedule
    if (coursesToAdd && coursesToAdd.length > 0) {
      coursesToAdd.forEach((courseId) => {
        const courseExists = timetable.schedule.some(
          (entry) => entry.course.toString() === courseId
        );

        if (!courseExists) {
          timetable.schedule.push({ course: courseId });
        }
      });
    }

    // Save the updated timetable
    const updatedTimeTable = await timetable.save();

    res.status(200).json(updatedTimeTable);
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

    res.status(200).json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
