const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB, mongoose } = require("./config/database");
const { UserModel } = require("./models/user");
const { validateSignupData } = require("./utils/validate");

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

    // first checking wheather the email id is present in the DataBase or not
    const foundUserData = await UserModel.findOne({ email: email });
    if (!foundUserData) {
      throw new Error("Invalid Creadential!");
    }

    const isPasswordSame = await bcrypt.compare(
      password,
      foundUserData.password
    );

    if (isPasswordSame) {
      // if password is valid then ;
      // Create a JWT token
      const token = await jwt.sign(
        { _id: foundUserData._id },
        "#MyDevT1nder----"
      );

      // Add the token to Cookie & then send the response back
      res.cookie("token", token);

      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Creadential!");
    }
  } catch (err) {
    next(err);
  }
});

app.get("/profile", async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Token is not valid!");
    }

    const decodeToken = await jwt.verify(token, "#MyDevT1nder----");
    const { _id } = decodeToken;

    console.log(`User DB id is : ${_id}`);

    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not present!");
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
});

// READ
// creating FEED API :- to get all users data from database
app.get("/feed", async (req, res, next) => {
  try {
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (foundUser.length === 0) {
      res.status(404).send("Invalid Creadential!");
    } else {
      res.send(foundUser);
    }
  } catch (err) {
    next(err);
  }
});

// UPDATE
// updating a user data
app.patch("/user/:userID", async (req, res) => {
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
app.delete("/user", async (req, res, next) => {
  try {
    // await UserModel.findByIdAndDelete({ _id: req.body.userID }); // OR
    await UserModel.findByIdAndDelete(req.body.userID);
    res.send("user Deleted successfully");
  } catch (err) {
    next(err);
  }
});

// Global Error Handler middleWare
app.use((err, req, res, next) => {
  // console.log(err); // for debugging purpose
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
