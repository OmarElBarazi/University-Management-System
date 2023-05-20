const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");

require("dotenv").config();

//Require Routes
const userRoutes = require("./src/routes/userRoutes");
const registerationRoutes = require("./src/routes/registerationRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const timeTableRoutes = require("./src/routes/timeTableRoutes");
const transcriptRoutes = require("./src/routes/transcriptRoutes");

const mongoString = process.env.DATABASE_URL;

mongoose
  .connect(mongoString, {
    useNewUrlParser: true,
  })
  .then(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //USE ROUTES IN SERVER
    app.use("/user", userRoutes);
    app.use("/registeration", registerationRoutes);
    app.use("/course", courseRoutes);
    app.use("/timetable", timeTableRoutes);
    app.use("/transcript", transcriptRoutes);

    app.listen(3000, () => {
      console.log(`Server Started at ${"localhost:3000"}`);
    });
  });

