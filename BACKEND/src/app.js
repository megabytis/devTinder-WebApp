const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./config/database");
const { userAuth } = require("./middleware/Auth");

const authRouter = require("./routers/auth-router");
const profileRouter = require("./routers/profile-router");
const requestRouter = require("./routers/request-router");
const userRouter = require("./routers/user-router");

const app = express();
app.use(cors({
  origin: "https://dev-tinder-web-app-woad.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // add OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// explicitly respond to OPTIONS
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Global Error Handler middleWare
app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ message: `ERROR: ${err.message}` });
});

connectDB()
  .then(() => {
    console.log("DB connected to app");
    app.listen(8080, () => {
      console.log("App is listening on port 8080");
    });
  })
  .catch((err) => console.log(err));
