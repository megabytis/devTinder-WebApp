const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder-DB:fzXGIEG5JCkItaOZ@devtinder.yzcimn0.mongodb.net/devTinder-DB"
  );
};

module.exports = {
  connectDB,
  mongoose,
};
