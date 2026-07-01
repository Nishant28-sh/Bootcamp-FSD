// ── Load environment variables first ─────────────────────────────────────────
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const path     = require("path");

const connectDB            = require("./config/db");
const config               = require("./config/appConfig");
const employeeRoutes       = require("./routes/employeeRoutes");
const loggerMiddleware     = require("./middleware/loggerMiddleware");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:         config.corsOrigin,
  methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/employees", employeeRoutes);

// ── Serve React Frontend (production) ─────────────────────────────────────────
const frontendDist = path.join(__dirname, "../frontend/dist");

if (config.env === "production") {
  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  // Dev: simple health check
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Employee Management API is running (dev)",
      version: "1.0.0",
    });
  });

  // 404 for unknown API routes in dev
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });
}

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Connect to DB then Start Server ──────────────────────────────────────────
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`\x1b[32m✓\x1b[0m Server running on \x1b[36mhttp://localhost:${config.port}\x1b[0m`);
    console.log(`\x1b[32m✓\x1b[0m API:      \x1b[36mhttp://localhost:${config.port}/employees\x1b[0m`);
    if (config.env === "production") {
      console.log(`\x1b[32m✓\x1b[0m Frontend: \x1b[36mhttp://localhost:${config.port}\x1b[0m`);
    } else {
      console.log(`\x1b[33m→\x1b[0m Frontend dev server: \x1b[36mhttp://localhost:5173\x1b[0m`);
    }
  });
});

module.exports = app;
