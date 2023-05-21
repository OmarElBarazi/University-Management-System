exports.calculateGPA = async (courses) => {
  let totalCredits = 0;
  let totalGradePoints = 0;

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const {
      course: { credits },
      grade,
    } = course; // Update to access credits from course object

    // Assign grade point values based on letter grades
    let gradePoints;
    switch (grade.toUpperCase()) {
      case "A":
      case "A+":
        gradePoints = 4.0;
        break;
      case "B":
      case "B+":
        gradePoints = 3.0;
        break;
      case "C":
      case "C+":
        gradePoints = 2.0;
        break;
      case "D":
        gradePoints = 1.0;
        break;
      case "F":
        gradePoints = 0.0;
        break;
      default:
        gradePoints = 0.0;
        break;
    }

    totalCredits += credits;
    totalGradePoints += gradePoints * credits;
  }

  const GPA = totalGradePoints / totalCredits;
  return GPA.toFixed(2); // Return GPA rounded to two decimal places
};
