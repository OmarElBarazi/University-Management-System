const bcrypt = require("bcrypt");

//Generate Student Id for new students
exports.generateStudentId = async (next) => {
  if (this.role !== "student" || this.studentId) {
    return next();
  }

  const currentYear = new Date().getFullYear().toString().slice(-2);
  const studentIdPrefix = currentYear + "000000";
  const studentCount = this.constructor.countDocuments({
    role: "student",
    studentId: {
      $regex: "^" + currentYear,
    },
  });

  studentCount
    .exec()
    .then((count) => {
      this.studentId = parseInt(studentIdPrefix, 10) + count;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

//Hash Password
exports.hashPassword = async (next) => {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      this.password = hash;
      next();
    });
  });
};
