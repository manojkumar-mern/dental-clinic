const ContactMessage = require("../models/ContactMessage");
const { createNotification } = require("./notificationService");

/**
 * Submit contact message
 */
const submitMessage = async (data) => {
  const newMessage = await ContactMessage.create(data);
  
  createNotification({
    title: "New Contact Message",
    message: `Inquiry from ${newMessage.name}: "${newMessage.subject}".`,
    type: "message",
  }).catch((err) => console.error("Notification creation failed:", err));

  return newMessage;
};

/**
 * Get all messages with search, status filtering, pagination, and sorting
 */
const getAllMessages = async (options = {}) => {
  const { search, status, page = 1, limit = 10 } = options;

  const query = {};

  // Status filter (New / Read)
  if (status) {
    query.status = status;
  }

  // Search filter (Name, Email, Subject)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const skipIndex = (page - 1) * limit;

  const messages = await ContactMessage.find(query)
    .sort({ createdAt: -1 })
    .skip(skipIndex)
    .limit(Number(limit));

  const total = await ContactMessage.countDocuments(query);

  return {
    messages,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get single message by ID
 */
const getMessageById = async (id) => {
  const msg = await ContactMessage.findById(id);
  if (!msg) {
    throw new Error("Message not found.");
  }
  return msg;
};

/**
 * Mark message as Read
 */
const markAsRead = async (id) => {
  const msg = await ContactMessage.findById(id);
  if (!msg) {
    throw new Error("Message not found.");
  }

  msg.status = "Read";
  await msg.save();
  return msg;
};

/**
 * Delete message
 */
const deleteMessage = async (id) => {
  const msg = await ContactMessage.findById(id);
  if (!msg) {
    throw new Error("Message not found.");
  }
  await ContactMessage.findByIdAndDelete(id);
  return msg;
};

module.exports = {
  submitMessage,
  getAllMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
};
