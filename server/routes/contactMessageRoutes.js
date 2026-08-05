const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  submitContactMessage,
  getMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage,
} = require("../controllers/contactMessageController");
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

const messageValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please enter a valid phone number"),
  body("subject")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Subject cannot exceed 150 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ max: 2000 })
    .withMessage("Message cannot exceed 2000 characters"),
  validate,
];

// 1. Submit message (Public)
router.post("/", messageValidationRules, submitContactMessage);

// 2. Protected admin routes
router.use(protectAdmin);

router.route("/")
  .get(getMessages);

router.route("/:id")
  .get(getMessageById)
  .delete(deleteMessage);

router.patch("/:id/read", markMessageAsRead);

module.exports = router;
