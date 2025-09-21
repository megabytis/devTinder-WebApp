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
const allowedOrigins = [
  "https://dev-tinder-web-app-woad.vercel.app", // your vercel frontend
  "http://localhost:5173", // for local testing
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// VERY IMPORTANT: handle preflight OPTIONS globally
app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use((req, res, next) => {
  console.log("Incoming origin:", req.headers.origin);
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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
