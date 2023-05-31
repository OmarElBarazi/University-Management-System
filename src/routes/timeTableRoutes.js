const express = require("express");
const router = express.Router();
const authMiddlware = require("../middlware/authMiddlware");

timeTableController = require("../controllers/timeTableControllers");

//GET
router.get(
  "/:id",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["admin", "staff", "student"]),
  timeTableController.getTimeTableByStudentId
);

//PATCH
router.patch(
  "/schedule/:id",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["student", "staff", "admin"]),
  timeTableController.updateSchedule
);

router.patch(
  "/confirm/:id",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole(["staff", "admin"]),
  timeTableController.updateConfirmStatus
);

module.exports = router;
