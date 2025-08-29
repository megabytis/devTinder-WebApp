const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  photoURL: {
    type: String,
    default:
      "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
  },
  skills: {
    type: [String],
    default: ["driving", "cooking"],
  },
  about: {
    type: String,
    default: "Hey There! I'm using devTinder",
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
