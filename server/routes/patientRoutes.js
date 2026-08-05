const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
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

const patientValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Patient full name is required")
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
  body("dateOfBirth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Please enter a valid date of birth (YYYY-MM-DD)"),
  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be 'Male', 'Female', or 'Other'"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either 'Active' or 'Inactive'"),
  validate,
];

// All patient endpoints require Admin protection
router.use(protectAdmin);

router.route("/")
  .get(getPatients)
  .post(patientValidationRules, createPatient);

router.route("/:id")
  .get(getPatientById)
  .put(patientValidationRules, updatePatient)
  .delete(deletePatient);

module.exports = router;
