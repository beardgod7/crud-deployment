const express = require("express");           
const User = require("../database/models/user");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
const sendToken = require("../utils/usertoken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");


// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password 
    } = req.body;

    if ( !name||!email || !password ) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ message: 'user already exists' });
    };

    const user = {
      name: name,
      email: email,
      password: password,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/api/v2/user/activation/${activationToken}`;
    
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    };
  } catch (error) {
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    return next(new ErrorHandler(error.message, 400));
  };
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      };
      user = await User.create({
        name,
        email,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    };
  })
);
module.exports=router
