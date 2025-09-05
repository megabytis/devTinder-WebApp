const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Defining Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minLength: 1,
      maxLength: 30,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minLength: 1,
      maxLength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Email Not Valid ${value}`);
        }
      },
    },
    password: {
      type: String,
      unique: true,
      required: true,
      validate(pass) {
        if (!validator.isStrongPassword(pass)) {
          throw new Error(`Not a Strong Password: ${pass}`);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoURL: {
      type: String,
      default:
        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`Invalid Photo URL: ${value}`);
        }
      },
    },
    skills: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (arr) => arr.length <= 10,
          message: "Skills cannot exceed 10 items",
        },
        {
          validator: (arr) =>
            arr.every(
              (s) =>
                typeof s === "string" &&
                s.trim().length > 0 &&
                s.trim().length <= 30
            ),
          message: "Each skill must be 1-30 chars",
        },
      ],
    },
    about: {
      type: String,
      default: "Hey There! I'm using devTinder",
    },
    gender: {
      type: String,
      validate(enteredGender) {
        if (!["male", "female", "others"].includes(enteredGender)) {
          throw new Error("Gender is not Valid!");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// Schema Methods
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "#MyDevT1nder----", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordEnteredByUser) {
  const user = this;
  const hashedPasswordInDB = user.password;
  const isDecrypted = bcrypt.compare(passwordEnteredByUser, hashedPasswordInDB);

  return isDecrypted;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
