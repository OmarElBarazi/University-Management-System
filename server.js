const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");

//Require Routes
const userRoutes = require("./src/routes/userRoutes");
const registerationRoutes = require("./src/routes/registerationRoutes");
const courseRoutes = require("./src/routes/courseRoutes");

require("dotenv").config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
  useNewUrlParser: true,
});
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(cors);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//USE ROUTES IN SERVER
app.use("/user", userRoutes);
app.use("/registeration", registerationRoutes);
app.use("/course", courseRoutes);

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
