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
  authMiddlware.userCheckRole("admin"),
  courseController.getAllCourses
);

router.get(
  "/available",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["admin", "student"]),
  courseController.getAvailableCourses
);

//PATCH
router.patch(
  "/courses/:courseId",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  courseController.updateCourse
);

module.exports = router;
