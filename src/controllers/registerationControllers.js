const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//USER SignUp
const userSignUp = async (req, res) => {
  try {
    //GET the user from database with same name if any
    const validateUserName = async (name) => {
      let user = await User.findOne({ name });
      return user ? false : true;
    };

    //GET the user from database with same email if any
    const validateEmail = async (email) => {
      let user = await User.findOne({ email });
      return user ? false : true;
    };

    //Validate the name
    let nameNOtTaken = await validateUserName(req.body.name);
    if (!nameNOtTaken) {
      return res.status(400).json({
        message: `User name is already taken`,
      });
    }

    //Validate email
    let emailNotTaken = await validateEmail(req.body.email);
    if (!emailNotTaken) {
      return res.status(400).json({
        message: `User email is already taken`,
      });
    }

    //Create new User
    const newUser = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      startDate: req.body.startDate,
      year: req.body.year,
      semester: req.body.semester,
    });

    await newUser.save();
    return res.status(201).json({
      message: " You are registered. Please login.",
    });
  } catch (err) {
    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};

//User Login
const userLogin = async (req, res) => {
  let { email, password } = req.body;

  // First Check if the user exist in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User email is not found. Invalid login credentials.",
      success: false,
    });
  }

  // That means the user is existing
  // Now check if the password match
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // if the password match Sign a the token and issue it to the user
    let token = jwt.sign(
      {
        role: user.role,
        name: user.name,
        surname: user.surname,
        email: user.email,
        startDate: user.startDate,
        year: user.year,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30 days" }
    );

    let result = {
      role: user.role,
      name: user.name,
      surname: user.surname,
      email: user.email,
      startDate: user.startDate,
      year: user.year,
      _id: user._id,
      token: token,
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in.",
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
    });
  }
};

module.exports = { userSignUp, userLogin };
