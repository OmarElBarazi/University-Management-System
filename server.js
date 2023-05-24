const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");

require("dotenv").config();

//PORT DECLARATION
const PORT = process.env.PORT || 5000;

//REQUIRE ROUTES FOR MODELS
const userRoutes = require("./src/routes/userRoutes");
const registerationRoutes = require("./src/routes/registerationRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const timeTableRoutes = require("./src/routes/timeTableRoutes");
const transcriptRoutes = require("./src/routes/transcriptRoutes");

//REQUIRE ROUTE FOR KEY GENERATION
const keyGenerationRoutes = require("./src/routes/keyGenerationRoutes");

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

    //USE ROUTES IN SERVER FOR MODELS
    app.use("/user", userRoutes);
    app.use("/registeration", registerationRoutes);
    app.use("/course", courseRoutes);
    app.use("/timetable", timeTableRoutes);
    app.use("/transcript", transcriptRoutes);

    //USE ROUTES IN SERVER FOR KEY GENERATION
    app.use("/key", keyGenerationRoutes);

    app.listen(PORT, () => {
      console.log(`Server Started on port ${PORT}`);
    });
  });
