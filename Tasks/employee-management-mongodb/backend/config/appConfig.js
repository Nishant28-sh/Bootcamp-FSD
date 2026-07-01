/**
 * Centralized application configuration.
 * All values are sourced from environment variables loaded by dotenv.
 */
const config = {
  env:         process.env.NODE_ENV      || "development",
  port:        parseInt(process.env.PORT || "5000", 10),
  mongoUri:    process.env.MONGODB_URI,
  corsOrigin:  process.env.CORS_ORIGIN   || "http://localhost:5173",
  jwt: {
    secret:    process.env.JWT_SECRET    || "changeme",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  logLevel:    process.env.LOG_LEVEL     || "dev",
};

module.exports = config;
