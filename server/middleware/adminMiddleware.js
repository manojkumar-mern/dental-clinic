const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { parseCookies } = require("../utils/parseCookies");

/**
 * Protect routes - Verify Admin JWT from Headers or Cookies
 */
const protectAdmin = async (req, res, next) => {
  let token;

  // 1. Check authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Check cookies
  else {
    token = parseCookies(req).adminToken;
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token provided."));
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not configured.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      res.status(401);
      return next(new Error("Admin user not found."));
    }

    if (admin.status !== "Active") {
      res.status(403);
      return next(new Error("Your administrator account is deactivated."));
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    return next(new Error("Not authorized, invalid or expired token."));
  }
};

/**
 * Optional Protect - Populate req.admin if valid JWT exists, but proceed regardless
 */
const optionalProtectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = parseCookies(req).adminToken;
  }

  if (token && process.env.JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
    } catch (_) {
      // Proceed without req.admin — optional auth
    }
  }
  next();
};

module.exports = { protectAdmin, optionalProtectAdmin };
