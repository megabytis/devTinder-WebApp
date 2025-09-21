const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    // "mongodb://127.0.0.1:27017/devTinder"
    "mongodb+srv://devTinder-DB:zOIiecBlsS98Ir2o@devtinder.yzcimn0.mongodb.net/devTinder-DB"
  );
};

module.exports = {
  connectDB,
};
