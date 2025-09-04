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

// CREATE
// creating SIGNUP API
app.post("/sign-up", async (req, res, next) => {
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

// creating LOGIN API
app.post("/login", async (req, res, next) => {
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
