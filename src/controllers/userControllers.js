const User = require("../models/userModel");
const TimeTable = require("../models/timeTableModel");

//Create Staff and student Users
exports.createUser = async (req, res) => {
  try {
    const { role, advisor, ...userData } = req.body; // extract role and advisor from req.body
    const newUser = new User({
      ...userData,
      role: role.toLowerCase(), // make sure role is lowercase
    });

    if (newUser.role === "staff") {
      // if role is staff, create new user with role staff and take req.body rest for his information
      await newUser.save();
      res.status(201).json({ user: newUser });
    } else if (newUser.role === "student") {
      // if role is student, search for advisor name and populate the advisor with the id of the matching user
      const advisorUser = await User.findOne({ name: advisor });
      if (!advisorUser) throw new Error("Advisor not found");
      newUser.advisor = advisorUser._id;
      await newUser.save();
      res.status(201).json({ user: newUser });

      //Create Empty TimeTable for the Student
      const timeTable = new TimeTable({
        studentId: newUser._id,
      });

      await timeTable.save();
    } else {
      throw new Error("Invalid role");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all users with role 'staff'
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users with role 'student'
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students related to a specific advisor
exports.getStudentsByAdvisor = async (req, res) => {
  try {
    const advisor = await User.findById(req.params.advisorId);
    if (!advisor || advisor.role !== "staff") {
      return res.status(404).json({ message: "Advisor not found" });
    }

    const students = await User.find({ advisor: advisor._id });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update Staff or Student information
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Delete Staff or Student Users
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
