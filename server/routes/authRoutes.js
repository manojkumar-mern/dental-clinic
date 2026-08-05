const express = require("express");
const router = express.Router();

const {
  seedAdmin,
  login,
  register,
  logout,
  refresh,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  protect,
  authorizePermissions,
} = require("../middleware/authMiddleware");

const {
  loginValidator,
  registerValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const { authRateLimiter } = require("../middleware/rateLimitMiddleware");

// Seeding
router.post("/seed", seedAdmin);

// Authentication & Session
router.post("/login", authRateLimiter, loginValidator, login);
router.post("/logout", protect, logout);
router.post("/refresh", refresh);

// Registration (Admin only)
router.post(
  "/register",
  protect,
  authorizePermissions("manage_users"),
  registerValidator,
  register
);

// Profile
router.route("/me")
  .get(protect, getMe)
  .put(protect, updateProfile);

// Password Management
router.put(
  "/change-password",
  protect,
  changePasswordValidator,
  changePassword
);
router.post(
  "/forgot-password",
  authRateLimiter,
  forgotPasswordValidator,
  forgotPassword
);
router.put(
  "/reset-password/:token",
  authRateLimiter,
  resetPasswordValidator,
  resetPassword
);

module.exports = router;
