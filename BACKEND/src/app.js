const express = require("express");
const { connectDB, mongoose } = require("./config/database");
const { UserModel } = require("./models/user");

const app = express();
app.use(express.json());

// creating API
app.post("/signup", async (req, res) => {
  // const User = new UserModel({
  //   firstName: "Lalu",
  //   lastName: "Yadav",
  //   age: 51,
  //   email: "lallu@yadav.com",
  // });

  try {
    await User.save();
    res.send("User added successfully");
  } catch (err) {
    console.log(err);
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
