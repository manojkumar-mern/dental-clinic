const Notification = require("../models/Notification");
const Admin = require("../models/Admin");

// Module-level cache to avoid DB hit on every notification
let _cachedAdminId = null;

/**
 * Lazily resolves and caches the default admin recipient ID.
 * @returns {Promise<import("mongoose").Types.ObjectId|null>}
 */
const getDefaultAdminId = async () => {
  if (_cachedAdminId) return _cachedAdminId;
  const defaultAdmin = await Admin.findOne().select("_id").lean();
  if (defaultAdmin) {
    _cachedAdminId = defaultAdmin._id;
  }
  return _cachedAdminId;
};

/**
 * Creates a notification in the database.
 * Defaults recipient to the first Admin if no recipient ID is provided.
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} [params.type]
 * @param {import("mongoose").Types.ObjectId} [params.recipient]
 */
const createNotification = async ({ title, message, type, recipient }) => {
  try {
    const targetRecipient = recipient || (await getDefaultAdminId());

    if (!targetRecipient) {
      console.warn("Skipping notification: No admin recipient found.");
      return null;
    }

    return await Notification.create({
      recipient: targetRecipient,
      title,
      message,
      type: type || "system",
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = {
  createNotification,
};
