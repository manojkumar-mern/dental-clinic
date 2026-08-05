const contactMessageService = require("../services/contactMessageService");
const logActivity = require("../utils/logger");

/**
 * @desc    Submit a new contact message (Public)
 * @route   POST /api/contact-messages
 * @access  Public
 */
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    const newMessage = await contactMessageService.submitMessage({
      name,
      phone,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully.",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages (Filtered, Paginated)
 * @route   GET /api/contact-messages
 * @access  Private (Admin Only)
 */
const getMessages = async (req, res, next) => {
  try {
    const { search, status, page, limit } = req.query;

    const result = await contactMessageService.getAllMessages({
      search,
      status,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single contact message details
 * @route   GET /api/contact-messages/:id
 * @access  Private (Admin Only)
 */
const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await contactMessageService.getMessageById(id);

    res.status(200).json({
      success: true,
      data: msg,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark contact message as Read
 * @route   PATCH /api/contact-messages/:id/read
 * @access  Private (Admin Only)
 */
const markMessageAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await contactMessageService.markAsRead(id);

    await logActivity(
      req.admin._id,
      "CONTACT_MESSAGE_READ",
      `Marked contact message from: ${msg.name} as Read`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Message marked as read successfully.",
      data: msg,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact-messages/:id
 * @access  Private (Admin Only)
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await contactMessageService.deleteMessage(id);

    await logActivity(
      req.admin._id,
      "CONTACT_MESSAGE_DELETED",
      `Deleted contact message from: ${msg.name} (Subject: ${msg.subject})`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage,
};
