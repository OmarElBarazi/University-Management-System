const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//User JWT Auth Middlware
exports.userAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded._id).select("-password");

      next();
    } catch (error) {
      res.status(401).json(error);
    }
  }

  if (!token) {
    res.status(401).json("No Token");
  }
};

//Check User Role for login
exports.userCheckRole = (roles) => async (req, res, next) => {
  let { email } = req.user;
  !roles.includes(req.user.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
};
