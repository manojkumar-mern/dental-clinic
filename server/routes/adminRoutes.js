const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  seedAdminAccount,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  changeAdminPassword,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// Common validator error interceptor
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map((err) => err.msg).join(", ")));
  }
  next();
};

// Seeding endpoint (Public)
router.post("/seed", seedAdminAccount);

// Authentication endpoints
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
    validate,
  ],
  loginAdmin
);

router.post("/logout", protectAdmin, logoutAdmin);

// Profile and Configuration endpoints
router.get("/me", protectAdmin, getAdminMe);

router.put(
  "/change-password",
  protectAdmin,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    validate,
  ],
  changeAdminPassword
);

module.exports = router;
