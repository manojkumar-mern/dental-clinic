const ActivityLog = require("../models/ActivityLog");

/**
 * Standardized utility to write activity logs.
 * @param {string|null} userId - The ID of the authenticated user who initiated the action.
 * @param {string} action - The action string.
 * @param {string} details - Detailed info on what changed.
 * @param {Object} [req] - Express request object to extract IP address.
 */
const logActivity = async (userId, action, details, req) => {
  try {
    const ipAddress = req ? (req.headers["x-forwarded-for"] || req.socket.remoteAddress) : null;
    await ActivityLog.create({
      user: userId,
      action,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error("Activity logging failed:", error.message);
  }
};

module.exports = logActivity;
