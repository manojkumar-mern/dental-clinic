const authService = require("../services/authService");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const logActivity = require("../utils/logger");

// Helper to extract refresh token from body, headers, or cookies
const getRefreshToken = (req) => {
  if (req.body.refreshToken) return req.body.refreshToken;
  if (req.headers["x-refresh-token"]) return req.headers["x-refresh-token"];
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
      const parts = cookie.trim().split("=");
      const key = parts[0];
      const value = parts.slice(1).join("=");
      acc[key] = value;
      return acc;
    }, {});
    return cookies.refreshToken;
  }
  return null;
};

// Helper to set refresh token in cookie
const sendRefreshTokenCookie = (res, token) => {
  const secure = process.env.NODE_ENV === "production";
  const cookieExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  res.setHeader(
    "Set-Cookie",
    `refreshToken=${token}; HttpOnly; Path=/; Expires=${cookieExpiry.toUTCString()}; SameSite=Strict${
      secure ? "; Secure" : ""
    }`
  );
};

// Helper to clear refresh token cookie
const clearRefreshTokenCookie = (res) => {
  res.setHeader(
    "Set-Cookie",
    "refreshToken=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict"
  );
};

/**
 * @desc    Seed initial Permissions, Roles, and Accounts
 * @route   POST /api/auth/seed
 * @access  Public
 */
const seedAdmin = async (req, res, next) => {
  try {
    // 1. Define standard permissions
    const standardPermissions = [
      { name: "manage_users", description: "Create, update, and deactivate accounts" },
      { name: "manage_appointments", description: "Schedule and manage appointments" },
      { name: "manage_treatments", description: "Create and edit clinic treatment catalog" },
      { name: "edit_settings", description: "Configure system options and settings" },
      { name: "view_reports", description: "Access clinic reports and analytics" },
    ];

    const seededPermissions = [];
    for (const perm of standardPermissions) {
      let existingPerm = await Permission.findOne({ name: perm.name });
      if (!existingPerm) {
        existingPerm = await Permission.create(perm);
      }
      seededPermissions.push(existingPerm);
    }

    const permMap = seededPermissions.reduce((acc, curr) => {
      acc[curr.name] = curr._id;
      return acc;
    }, {});

    // 2. Define standard roles
    const standardRoles = [
      {
        name: "Super Admin",
        description: "Full system administration access",
        permissions: seededPermissions.map((p) => p._id),
      },
      {
        name: "Admin",
        description: "Clinic administration access",
        permissions: [
          permMap["manage_appointments"],
          permMap["manage_treatments"],
          permMap["view_reports"],
        ],
      },
      {
        name: "Doctor",
        description: "Medical practitioner access",
        permissions: [permMap["manage_appointments"], permMap["manage_treatments"]],
      },
      {
        name: "Receptionist",
        description: "Front desk scheduling and patient management",
        permissions: [permMap["manage_appointments"]],
      },
    ];

    const rolesMap = {};
    for (const roleObj of standardRoles) {
      let existingRole = await Role.findOne({ name: roleObj.name });
      if (!existingRole) {
        existingRole = await Role.create(roleObj);
      } else {
        // Update permissions in case they changed
        existingRole.permissions = roleObj.permissions;
        await existingRole.save();
      }
      rolesMap[roleObj.name] = existingRole._id;
    }

    // 3. Seed default Super Admin account if no users exist
    const userCount = await User.countDocuments();
    let superAdminUser;

    if (userCount === 0) {
      const defaultPassword = process.env.SEED_SUPER_ADMIN_PASSWORD || "SuperAdminPassword123!";
      superAdminUser = await User.create({
        name: "System Super Admin",
        email: "superadmin@auradental.com",
        password: defaultPassword,
        role: rolesMap["Super Admin"],
        phone: "+15550000000",
      });
      await logActivity(
        superAdminUser._id,
        "SEED_ADMIN_CREATED",
        "Initial System Super Admin account created.",
        req
      );
    } else {
      // Already seeded — do not recreate
      superAdminUser = null;
    }

    res.status(200).json({
      success: true,
      message: "Database system roles and permissions successfully seeded.",
      rolesSeeded: Object.keys(rolesMap),
      permissionsSeeded: seededPermissions.map((p) => p.name),
      superAdminCreated: !!superAdminUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in User (Admin, Doctor, Receptionist)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, req);

    // Set refresh token in HTTP-only Cookie
    sendRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      token: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new system user
 * @route   POST /api/auth/register
 * @access  Private (Admin Only)
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, roleName, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error("User with this email already exists."));
    }

    // Resolve Role ID from roleName
    const assignedRoleName = roleName || "Receptionist";
    const roleObj = await Role.findOne({ name: assignedRoleName });
    if (!roleObj) {
      res.status(400);
      return next(new Error(`Role '${assignedRoleName}' does not exist in the system.`));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: roleObj._id,
      phone,
    });

    await logActivity(
      req.user._id,
      "USER_REGISTERED",
      `Admin created new user: ${email} with role: ${assignedRoleName}`,
      req
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: assignedRoleName,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out current user / Invalidate session
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    const refreshToken = getRefreshToken(req);
    await authService.logoutUser(refreshToken, req.user ? req.user._id : null, req);

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh session tokens
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refresh = async (req, res, next) => {
  try {
    const refreshToken = getRefreshToken(req);
    const result = await authService.refreshSession(refreshToken, req);

    // Send new refresh token in Cookie
    sendRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      token: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role ? req.user.role.name : null,
        permissions: req.user.role ? req.user.role.permissions.map((p) => p.name) : [],
        phone: req.user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile info
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    await logActivity(
      user._id,
      "USER_PROFILE_UPDATE",
      `User updated profile fields: ${Object.keys(req.body).join(", ")}`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change authenticated user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changeUserPassword(req.user._id, currentPassword, newPassword, req);

    // Clear old refresh cookie
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Password updated successfully. Please log in again.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password trigger link request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email, req);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password processing
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    await authService.resetPassword(token, password, req);

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
