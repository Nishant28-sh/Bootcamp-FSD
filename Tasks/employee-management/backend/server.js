const express = require("express");
const cors    = require("cors");
const path    = require("path");

const employeeRoutes   = require("./routes/employeeRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");

const app  = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === "production";

// ── CORS (only needed in dev; in prod same origin serves both) ────────────────
// Allow all origins so any deployed frontend can reach this API
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

if (isProduction) {
  app.use(express.static(frontendDist));

  // All non-API routes → serve React's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  // Dev: simple health check
  app.get("/", (req, res) => {
    res.json({ success: true, message: "Employee Management API is running (dev)", version: "1.0.0" });
  });

  // 404 for unknown API routes in dev
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });
}

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\x1b[32m✓\x1b[0m Server running on \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[32m✓\x1b[0m API:      \x1b[36mhttp://localhost:${PORT}/employees\x1b[0m`);
  if (isProduction) {
    console.log(`\x1b[32m✓\x1b[0m Frontend: \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  } else {
    console.log(`\x1b[33m→\x1b[0m Frontend dev server: \x1b[36mhttp://localhost:5173\x1b[0m`);
  }
});

module.exports = app;
