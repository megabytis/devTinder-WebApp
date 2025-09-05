const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateSignupData } = require("../utils/validate");
const { UserModel } = require("../models/user");

const authRouter = express.Router();

// SIGN-UP API
authRouter.post("/sign-up", async (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    email,
    password,
    skills,
    photoURL,
    gender,
    about,
  } = req.body;

  // 1st Validating Data
  validateSignupData(req);

  // 2nd Encrypting the Password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    firstName: firstName,
    lastName: lastName,
    age: age,
    email: email,
    password: hashedPassword,
    skills: skills,
    photoURL: photoURL,
    gender: gender,
    about: about,
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    next(err);
  }
});

// LOGIN API
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find User
    // first checking wheather the email id is present in the DataBase or not
    const foundUserData = await UserModel.findOne({ email: email });
    if (!foundUserData) {
      throw new Error("Invalid Credential!");
    }

    // 2️⃣ Validate password
    const isPasswordSame = await foundUserData.validatePassword(password);

    if (isPasswordSame) {
      // if password is valid then ;
      // 3️⃣ Generate JWT via schema method
      const token = await foundUserData.getJWT();

      // Add the token to Cookie & then send the response back
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: "strict", // CSRF protection
      });

      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Credential!");
    }
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  res.send("Logout successful!");
});

module.exports = authRouter;
