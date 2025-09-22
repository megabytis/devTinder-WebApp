const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./config/database");

const authRouter = require("./routers/auth-router");
const profileRouter = require("./routers/profile-router");
const requestRouter = require("./routers/request-router");
const userRouter = require("./routers/user-router");

const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: ["https://dev-tinder-web-app-six.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Router prefixes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error middleware:", err.message);
  res.status(err.statusCode || 500).json({ message: `ERROR: ${err.message}` });
});

// DB + start server
connectDB()
  .then(() => {
    console.log("✅ DB connected to app");
    app.listen(8080, () => {
      console.log("🚀 App is listening on port 8080");
    });
  })
  .catch((err) => console.log("DB connection error:", err));
