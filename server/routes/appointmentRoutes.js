const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protectAdmin, optionalProtectAdmin } = require("../middleware/adminMiddleware");

// Common validator error interceptor
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map((err) => err.msg).join(", ")));
  }
  next();
};

const apptValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Patient name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Mobile phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please enter a valid mobile number"),
  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("service")
    .trim()
    .notEmpty()
    .withMessage("Service is required")
    .isMongoId()
    .withMessage("Please select a valid service"),
  body("preferredDate")
    .trim()
    .notEmpty()
    .withMessage("Preferred date is required")
    .isISO8601()
    .withMessage("Please select a valid date (YYYY-MM-DD)"),
  body("preferredTime")
    .trim()
    .notEmpty()
    .withMessage("Preferred time slot is required"),
  body("reasonForVisit")
    .optional()
    .trim(),
  validate,
];

// 1. Create Appointment - Public (optionally checks if admin is booking)
router.post("/", optionalProtectAdmin, apptValidationRules, createAppointment);

// 2. Protected admin routes
router.use(protectAdmin);

router.route("/")
  .get(getAppointments);

router.route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.patch("/:id/status", updateAppointmentStatus);

module.exports = router;
