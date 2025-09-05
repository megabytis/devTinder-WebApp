const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const { userAuth } = require("./middleware/Auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/profile", userAuth, async (req, res, next) => {
  const user = req.user;
  res.send(user);
});

// READ
// creating FEED API :- to get all users data from database
app.get("/feed", userAuth, async (req, res, next) => {
  const user = req.user;
  res.send(user);
});

// UPDATE
// updating a user data
app.patch("/user/:userID", userAuth, async (req, res) => {
  const data = req.body;
  const userID = req.params?.userID;

  try {
    const ALLOWED_UPDATES_LIST = [
      "firstName",
      "lastName",
      "age",
      "photoURL",
      "skills",
      "about",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES_LIST.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update now allowed !");
    }

    await UserModel.findByIdAndUpdate(userID, data, {
      runValidators: true,
    });
    res.send("User updated Successfully");
  } catch (err) {
    res.status(400).send(`UPDATE FAILED : ${err.message}`);
  }
});

// DELETE
// deleting a user from DB
app.delete("/user", userAuth, async (req, res, next) => {
  try {
    await UserModel.findByIdAndDelete(req.body.userID);
    res.send("user Deleted successfully");
  } catch (err) {
    next(err);
  }
});

// Global Error Handler middleWare
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).send(`ERROR: ${err.message}`);
});

connectDB()
  .then(() => {
    console.log("DB connected to app");
    app.listen(8888, () => {
      console.log("App is listening on port 8888");
    });
  })
  .catch((err) => console.log(err));
