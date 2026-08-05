const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Helper to set Cookie
const sendTokenCookie = (res, token) => {
  const secure = process.env.NODE_ENV === "production";
  const cookieExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  res.setHeader(
    "Set-Cookie",
    `adminToken=${token}; HttpOnly; Path=/; Expires=${cookieExpiry.toUTCString()}; SameSite=Strict${
      secure ? "; Secure" : ""
    }`
  );
};

// Helper to clear Cookie
const clearTokenCookie = (res) => {
  res.setHeader(
    "Set-Cookie",
    "adminToken=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict"
  );
};

/**
 * @desc    Seed initial Administrator account
 * @route   POST /api/admin/seed
 * @access  Public
 */
const seedAdminAccount = async (req, res, next) => {
  try {
    const adminExists = await Admin.findOne({ email: "admin@auradental.com" });

    if (adminExists) {
      res.status(400);
      return next(new Error("Default Administrator account already seeded."));
    }

    const defaultAdmin = await Admin.create({
      name: "Aura Administrator",
      email: "admin@auradental.com",
      password: "AdminPassword123!",
      role: "Admin",
      status: "Active",
    });

    res.status(201).json({
      success: true,
      message: "Default Administrator account created successfully.",
      admin: {
        id: defaultAdmin._id,
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        role: defaultAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate admin & get token
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error("Please enter both email and password."));
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401);
      return next(new Error("Invalid credentials."));
    }

    if (admin.status !== "Active") {
      res.status(403);
      return next(new Error("This administrator account has been deactivated."));
    }

    // Update login timestamp
    admin.lastLogin = Date.now();
    await admin.save();

    const token = generateToken(admin._id);
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out Admin & clear cookies
 * @route   POST /api/admin/logout
 * @access  Private
 */
const logoutAdmin = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/admin/me
 * @access  Private
 */
const getAdminMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change admin password
 * @route   PUT /api/admin/change-password
 * @access  Private
 */
const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      return next(new Error("Please enter both current and new passwords."));
    }

    const admin = await Admin.findById(req.admin._id).select("+password");

    if (!admin || !(await admin.matchPassword(currentPassword))) {
      res.status(400);
      return next(new Error("Incorrect current password."));
    }

    admin.password = newPassword;
    await admin.save();

    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  seedAdminAccount,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  changeAdminPassword,
};
