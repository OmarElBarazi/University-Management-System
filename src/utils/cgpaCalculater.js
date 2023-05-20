exports.calculateCGPA = async (semesters) => {
  let totalCredits = 0;
  let totalGradePoints = 0;

  for (let i = 0; i < semesters.length; i++) {
    const semester = semesters[i];

    let semesterCredits = 0;
    let semesterGradePoints = 0;

    for (let j = 0; j < semester.length; j++) {
      const course = semester[j];
      const { credits, grade } = course;

      // Assign grade point values based on letter grades
      let gradePoints;
      switch (grade.toUpperCase()) {
        case "A":
          gradePoints = 4.0;
          break;
        case "B":
          gradePoints = 3.0;
          break;
        case "C":
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

      semesterCredits += credits;
      semesterGradePoints += gradePoints * credits;
    }

    totalCredits += semesterCredits;
    totalGradePoints += semesterGradePoints;

    const semesterGPA = semesterGradePoints / semesterCredits;
    console.log(`GPA for Semester ${i + 1}:`, semesterGPA.toFixed(2));
  }

  const CGPA = totalGradePoints / totalCredits;
  console.log("CGPA:", CGPA.toFixed(2));
};
