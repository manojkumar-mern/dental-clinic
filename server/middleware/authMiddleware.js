const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { parseCookies } = require("../utils/parseCookies");

// Protect routes - Verify JWT Access Token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get user and populate role + nested permissions
      req.user = await User.findById(decoded.id)
        .select("-password")
        .populate({
          path: "role",
          populate: { path: "permissions" },
        });

      if (!req.user) {
        res.status(401);
        return next(new Error("User associated with this token no longer exists."));
      }

      if (req.user.status === "inactive") {
        res.status(403);
        return next(new Error("Your account has been deactivated."));
      }

      // Check if password changed after token was issued
      if (req.user.passwordChangedAt) {
        const changedTimestamp = parseInt(
          req.user.passwordChangedAt.getTime() / 1000,
          10
        );
        if (decoded.iat < changedTimestamp) {
          res.status(401);
          return next(new Error("User recently changed password! Please log in again."));
        }
      }

      next();
    } catch (error) {
      res.status(401);
      next(error);
    }
  } else {
    res.status(401);
    next(new Error("Not authorized, no token provided."));
  }
};

// Restrict access to specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(403);
      return next(new Error("Not authorized, user role not assigned."));
    }

    if (!roles.includes(req.user.role.name)) {
      res.status(403);
      return next(
        new Error(`User role (${req.user.role.name}) is not authorized to access this resource.`)
      );
    }

    next();
  };
};

// Restrict access based on granular permissions
const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(403);
      return next(new Error("Not authorized, user role not assigned."));
    }

    // Super Admin has bypass/all access
    if (req.user.role.name === "Super Admin") {
      return next();
    }

    const userPermissions = req.user.role.permissions.map((perm) => perm.name);
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      res.status(403);
      return next(new Error("Access denied: Insufficient permissions."));
    }

    next();
  };
};

// Optional Protect - populate req.user if JWT is provided, but don't reject if not
const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      req.user = await User.findById(decoded.id)
        .select("-password")
        .populate({
          path: "role",
          populate: { path: "permissions" },
        });
      next();
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};

module.exports = {
  protect,
  authorizeRoles,
  authorizePermissions,
  optionalProtect,
};
