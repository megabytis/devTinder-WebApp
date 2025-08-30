const express = require("express");
const { connectDB, mongoose } = require("./config/database");
const { UserModel } = require("./models/user");

const app = express();
app.use(express.json());

// CREATE
// creating SIGNUP API
app.post("/sign-up", async (req, res) => {
  const { firstName, lastName, age, email } = req.body;

  const user = new UserModel({
    firstName: firstName,
    lastName: lastName,
    age: age,
    email: email,
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.log(err);
  }
});

// READ
// creating FEED API :- to get all users data from database
app.get("/feed", async (req, res, next) => {
  try {
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (foundUser.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(foundUser);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
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
app.delete("/user", async (req, res) => {
  try {
    // await UserModel.findByIdAndDelete({ _id: req.body.userID }); // OR
    await UserModel.findByIdAndDelete(req.body.userID);
    res.send("user Deleted successfully");
  } catch (err) {
    res.status(400).send("Error ocurred");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected to app");
    app.listen(8888, () => {
      console.log("App is listening on port 8888");
    });
  })
  .catch((err) => console.log(err));
