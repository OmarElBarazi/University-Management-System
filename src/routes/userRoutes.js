const express = require("express");
const router = express.Router();
const authMiddlware = require("../middlware/authMiddlware");

userController = require("../controllers/userControllers");

// POST
router.post(
  "/",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  userController.createUser
);

// GET
router.get(
  "/staff",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  userController.getStaff
);

router.get(
  "/student",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  userController.getStudents
);

router.get(
  "/student/:advisorId",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("staff"),
  userController.getStudentsByAdvisor
);

//PATCH
router.patch(
  "/:id",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["admin", "staff"]),
  userController.updateUser
);

//DELETE
router.delete(
  "/:id",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("admin"),
  userController.updateUser
);

module.exports = router;
