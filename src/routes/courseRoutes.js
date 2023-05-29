const express = require("express");
const router = express.Router();
const authMiddlware = require("../middlware/authMiddlware");

courseController = require("../controllers/courseContollers");

// POST
router.post(
  "/",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  courseController.createCourse
);

// GET
router.get(
  "/",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["admin", "staff", "student"]),
  courseController.getAllCourses
);

router.get(
  "/available",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["admin", "student"]),
  courseController.getAvailableCourses
);

router.get(
  "/advisor/:id",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["admin", "staff"]),
  courseController.getCoursesAdvisor
);

//PATCH
router.patch(
  "/:courseId",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  courseController.updateCourse
);

module.exports = router;
