const bcrypt = require("bcrypt");

//Generate Student Id for new students
exports.generateStudentId = async function (next) {
  if (this.role !== "student" || this.studentId) {
    return next();
  }

  const currentYear = new Date().getFullYear().toString().slice(-2);
  const studentIdPrefix = parseInt(currentYear + "000000", 10);

  try {
    const lastStudent = await this.constructor
      .findOne(
        { role: "student", studentId: { $ne: null } },
        {},
        { sort: { studentId: -1 } }
      )
      .exec();

    const lastStudentId = lastStudent ? lastStudent.studentId : studentIdPrefix;

    this.studentId = lastStudentId + 1;

    next();
  } catch (err) {
    next(err);
  }
};

//Hash Password
exports.hashPassword = function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
};
