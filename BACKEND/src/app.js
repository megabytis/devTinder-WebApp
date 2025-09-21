const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./config/database");

const authRouter = require("./routers/auth-router");
const profileRouter = require("./routers/profile-router");
const requestRouter = require("./routers/request-router");
const userRouter = require("./routers/user-router");

const app = express();

const allowedOrigins = [
  "https://dev-tinder-web-app-woad.vercel.app", // your Vercel frontend
  "http://localhost:5173", // local dev
];

// ✅ CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked origin:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Force credentials header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Handle preflight everywhere
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// ✅ Router prefixes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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
