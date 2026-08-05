const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const RefreshToken = require("../models/RefreshToken");
const logActivity = require("../utils/logger");
const sendEmail = require("./emailService");

/**
 * Generate Access Token
 * @param {string} userId
 * @returns {string}
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { 
      id: userId,
      jti: crypto.randomBytes(16).toString("hex")
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

/**
 * Generate Refresh Token and save to database
 * @param {string} userId
 * @returns {Promise<string>}
 */
const generateAndSaveRefreshToken = async (userId) => {
  const token = jwt.sign(
    { 
      id: userId,
      jti: crypto.randomBytes(16).toString("hex")
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await RefreshToken.create({
    user: userId,
    token,
    expiresAt,
  });

  return token;
};

/**
 * Authenticate user credentials
 */
const loginUser = async (email, password, req) => {
  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select("+password").populate("role");

  if (!user) {
    await logActivity(null, "FAILED_LOGIN_ATTEMPT", `Attempted email: ${email}`, req);
    throw new Error("Invalid email or password.");
  }

  // Soft deleted check
  if (user.isDeleted) {
    await logActivity(null, "FAILED_LOGIN_ATTEMPT", `Soft deleted account login attempt: ${email}`, req);
    throw new Error("Invalid email or password.");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await logActivity(user._id, "FAILED_LOGIN_ATTEMPT", `Failed password check for user: ${email}`, req);
    throw new Error("Invalid email or password.");
  }

  if (user.status === "inactive") {
    await logActivity(user._id, "FAILED_LOGIN_ATTEMPT", `Deactivated account login attempt: ${email}`, req);
    throw new Error("Your account has been deactivated.");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateAndSaveRefreshToken(user._id);

  await logActivity(user._id, "USER_LOGIN", `User logged in successfully: ${user.email}`, req);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role ? user.role.name : null,
      phone: user.phone,
    },
  };
};

/**
 * Logout and invalidate refresh token
 */
const logoutUser = async (refreshToken, userId, req) => {
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
  await logActivity(userId, "USER_LOGOUT", "User logged out successfully", req);
};

/**
 * Refresh Session with Refresh Token Rotation (RTR)
 */
const refreshSession = async (oldRefreshToken, req) => {
  if (!oldRefreshToken) {
    throw new Error("No refresh token provided.");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (err) {
    // If invalid/expired token, attempt to clean up if it exists in DB
    await RefreshToken.deleteOne({ token: oldRefreshToken });
    throw new Error("Invalid or expired refresh token.");
  }

  // Look up in database
  const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });

  if (!storedToken) {
    // Token reuse / theft scenario!
    // As a strict security measure, revoke all active sessions for this user
    await RefreshToken.deleteMany({ user: decoded.id });
    await logActivity(
      decoded.id,
      "SECURITY_ALERT",
      `Possible refresh token reuse detected! Revoked all sessions for user ID: ${decoded.id}`,
      req
    );
    throw new Error("Security warning: Session hijacked. Please login again.");
  }

  // Remove the old token from database (rotation)
  await RefreshToken.deleteOne({ _id: storedToken._id });

  // Generate new tokens
  const accessToken = generateAccessToken(decoded.id);
  const newRefreshToken = await generateAndSaveRefreshToken(decoded.id);

  // Return new credentials
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Change User Password
 */
const changeUserPassword = async (userId, currentPassword, newPassword, req) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found.");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new Error("Current password is incorrect.");
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  // Revoke all other sessions after password change
  await RefreshToken.deleteMany({ user: userId });

  await logActivity(userId, "PASSWORD_CHANGED", "User changed their password successfully", req);
};

/**
 * Forgot Password - Send Reset Token
 */
const forgotPassword = async (email, req) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Return success message even if email doesn't exist for security reasons (prevent email enumeration)
    return { message: "If that email exists in our system, we have sent a reset code." };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time to 10 minutes
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Aura Dental Clinic - Password Reset Request",
      message,
    });

    await logActivity(user._id, "PASSWORD_RESET_REQUESTED", `Password reset email dispatched to: ${user.email}`, req);
    return { message: "Email sent" };
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new Error("Email could not be sent.");
  }
};

/**
 * Reset Password
 */
const resetPassword = async (token, newPassword, req) => {
  // Hash token to match with stored hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token.");
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  // Revoke all sessions
  await RefreshToken.deleteMany({ user: user._id });

  await logActivity(user._id, "PASSWORD_RESET_SUCCESS", "Password was reset successfully", req);
};

module.exports = {
  loginUser,
  logoutUser,
  refreshSession,
  changeUserPassword,
  forgotPassword,
  resetPassword,
};
