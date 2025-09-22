const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder-DB:zOIiecBlsS98Ir2o@devtinder.yzcimn0.mongodb.net/devTinder-DB?retryWrites=true&w=majority&appName=devTinder"
  );
};

module.exports = {
  connectDB,
};
