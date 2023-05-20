const express = require("express");
const router = express.Router();
const authMiddlware = require("../middlware/authMiddlware");

transcriptControllers = require("../controllers/transcriptControllers");

//POST
router.post(
  "/",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("staff"),
  transcriptControllers.createTranscript
);

module.exports = router;
