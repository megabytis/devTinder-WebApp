const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder-DB:fzXGIEG5JCkItaOZ@devtinder.yzcimn0.mongodb.net/devTinder-DB"
  );
};

const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});

module.exports = {
  connectDB,
  mongoose,
};
