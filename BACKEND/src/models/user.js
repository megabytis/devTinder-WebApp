const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
