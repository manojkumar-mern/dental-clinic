const rateLimit = require("express-rate-limit");

// Strict rate limiter for auth routes (login, forgot-password, reset-password, register)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 15 : 1000, // Allow up to 1000 attempts in development
  message: {
    success: false,
    message: "Too many attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// General rate limiter for all other routes
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 5000, // Allow up to 5000 requests in development
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authRateLimiter,
  generalRateLimiter,
};
