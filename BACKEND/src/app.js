const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./config/database");

const authRouter = require("./routers/auth-router");
const profileRouter = require("./routers/profile-router");
const requestRouter = require("./routers/request-router");
const userRouter = require("./routers/user-router");

const app = express();

// Update your allowedOrigins array in app.js
const allowedOrigins = [
  "https://dev-tinder-web-app-woad.vercel.app",
  "http://localhost:5500",
  "https://devtinder-webapp.onrender.com", // Add your Render backend URL
];

// Update CORS middleware to be more permissive for development
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ✅ Force credentials header
// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.sendStatus(200);
});

// ✅ Handle preflight everywhere
// app.options("*", cors());

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
