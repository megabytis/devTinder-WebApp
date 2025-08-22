const express = require("express");
const { connectDB, mongoose } = require("./config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("DB connected to app");
    app.listen(3000, () => {
      console.log("App is listening on port 3000");
    });
  })
  .catch((err) => console.log(err))
  .finally(mongoose.disconnect());
