const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const { generalLimiter, registrationLimiter, errorHandler } = require("./middleware/security");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ---------------- //

// Security headers
app.use(helmet());

// Parse JSON + urlencoded bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Parse cookies (for JWT / sessions)
app.use(cookieParser());

// ✅ CORS setup with multiple origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-frontend-domain.com"]
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
      ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies / Authorization headers
  })
);

// ---------------- RATE LIMITS ---------------- //
app.use("/api/", generalLimiter);
app.use("/api/auth/register", registrationLimiter);

// ---------------- ROUTES ---------------- //

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Law Firm Backend API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// ---------------- SERVER START ---------------- //
app.listen(PORT, () => {
  console.log(`🚀 Law Firm Backend Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

// ---------------- GRACEFUL SHUTDOWN ---------------- //
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  process.exit(0);
});
